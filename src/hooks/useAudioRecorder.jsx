import { useState, useRef, useEffect } from "react";

export const useAudioRecorder = ({ onStop } = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fullRecordingUrl, setFullRecordingUrl] = useState(null);

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const allBlobsRef = useRef([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (fullRecordingUrl) {
        URL.revokeObjectURL(fullRecordingUrl);
      }
    };
  }, [fullRecordingUrl]);

  const requestMic = async () => {
    setStatusMessage("Requesting microphone permission...");
    setPermissionStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionStatus("granted");
      setStatusMessage("Permission granted.");
      return true;
    } catch (err) {
      console.error("Mic permission error:", err);
      setPermissionStatus("denied");
      setStatusMessage("Microphone permission denied.");
      return false;
    }
  };

  const handleDataAvailable = (e) => {
    if (e.data.size > 0) {
      audioChunksRef.current.push(e.data);
    }
  };

  const handleStop = () => {
    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];

    if (blob.size > 1024) {
      if (onStop) onStop(blob);
      allBlobsRef.current.push(blob);
    }

    if (isRecording && streamRef.current) {
      const newRecorder = new MediaRecorder(streamRef.current);
      newRecorder.ondataavailable = handleDataAvailable;
      newRecorder.onstop = handleStop;
      newRecorder.onerror = handleError;

      mediaRecorderRef.current = newRecorder;
      newRecorder.start();
    }
  };

  const handleError = (e) => {
    console.error("Recording error:", e);
    setStatusMessage(`Recording error: ${e.error.message}`);
    setIsRecording(false);
    setPermissionStatus("error");
  };

  const startRecording = async () => {
    if (isRecording) return;
    const granted = await requestMic();
    if (!granted || !streamRef.current) return;

    setStatusMessage("Recording...");
    setIsRecording(true);
    audioChunksRef.current = [];
    allBlobsRef.current = [];

    const recorder = new MediaRecorder(streamRef.current);
    recorder.ondataavailable = handleDataAvailable;
    recorder.onstop = handleStop;
    recorder.onerror = handleError;

    mediaRecorderRef.current = recorder;
    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      setStatusMessage("Stopping recording...");
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (allBlobsRef.current.length > 0) {
      const fullBlob = new Blob(allBlobsRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(fullBlob);
      setFullRecordingUrl(url);
      allBlobsRef.current = [];
    }
  };

  return {
    isRecording,
    permissionStatus,
    statusMessage,
    startRecording,
    stopRecording,
    fullRecordingUrl,
  };
};

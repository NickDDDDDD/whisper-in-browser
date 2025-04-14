import React, { useState } from "react";
import { useWhisperModel } from "../hooks/useWhisperModel";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import ProgressBar from "./ProgressBar";
import { read_audio } from "@huggingface/transformers";

const Whisper = () => {
  const [transcript, setTranscript] = useState(null);
  const { pipe, fileProgress } = useWhisperModel();

  const {
    isRecording,
    permissionStatus,
    statusMessage,
    startRecording,
    stopRecording,
    recordingUrl,
  } = useAudioRecorder({
    onStop: async (blob) => {
      try {
        const url = URL.createObjectURL(blob);
        const audio = await read_audio(url, 16000);
        const result = await pipe(audio);
        setTranscript(result.text);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Transcription failed:", err);
      }
    },
  });

  // --- UI rendering ---
  const progressEntries = Object.entries(fileProgress || {});

  return (
    <div className="aspect-4/3 h-8/12 max-w-3xl rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 p-8 text-zinc-300">
      {pipe ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8">
          <h1 className="text-2xl font-bold">
            Model loaded: Xenova/whisper-base
          </h1>
          {statusMessage && (
            <p className="text-lg font-medium">Status: {statusMessage}</p>
          )}
          <div className="flex w-full items-center justify-evenly">
            <button
              className={`rounded-full px-6 py-3 font-bold transition-colors duration-200 ${
                isRecording ||
                permissionStatus === "denied" ||
                permissionStatus === "requesting"
                  ? "cursor-not-allowed bg-gray-600 text-gray-400"
                  : "cursor-pointer bg-green-700 text-white hover:bg-green-600 active:bg-green-800"
              }`}
              onClick={startRecording}
              disabled={
                isRecording ||
                permissionStatus === "denied" ||
                permissionStatus === "requesting"
              }
            >
              Start Recording
            </button>
            <button
              onClick={stopRecording}
              className={`rounded-full px-6 py-3 font-bold transition-colors duration-200 ${
                !isRecording
                  ? "cursor-not-allowed bg-gray-600 text-gray-400"
                  : "cursor-pointer bg-red-700 text-white hover:bg-red-600 active:bg-red-800"
              }`}
              disabled={!isRecording}
            >
              Stop Recording
            </button>
          </div>
          {recordingUrl && (
            <div className="mt-4 w-full max-w-xl">
              <h3 className="mb-1 text-sm font-semibold">
                Playback Recording:
              </h3>
              <audio
                controls
                preload="metadata"
                src={recordingUrl}
                className="w-full"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {transcript && (
            <div className="mt-4 w-full max-w-xl rounded bg-zinc-700 p-4 text-sm">
              <h3 className="mb-2 font-semibold">Transcript:</h3>
              <p className="whitespace-pre-wrap">{transcript}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8">
          <h1 className="text-2xl font-bold">
            Loading Whisper Model in Browser
          </h1>
          {progressEntries.map(([name, progressValue]) => (
            <ProgressBar key={name} name={name} progress={progressValue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Whisper;

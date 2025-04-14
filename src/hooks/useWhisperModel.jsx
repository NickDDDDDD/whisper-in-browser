// hooks/useWhisperModel.js
import { useState, useEffect } from "react";
import { pipeline } from "@huggingface/transformers";

export const useWhisperModel = () => {
  const [pipe, setPipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileProgress, setFileProgress] = useState({});

  useEffect(() => {
    let cancelled = false;

    const onProgress = (data) => {
      if (cancelled || !data.file) return;

      const fileKey = data.file;
      let currentProgress = 0;
      switch (data.status) {
        case "progress":
          currentProgress = Math.round(data.progress);
          break;
        case "done":
          currentProgress = 100;
          break;

        default:
          return;
      }

      setFileProgress((prev) => {
        if (prev[fileKey] === currentProgress) {
          return prev;
        }

        return {
          ...prev,
          [fileKey]: currentProgress,
        };
      });
    };

    const load = async () => {
      try {
        const whisperPipe = await pipeline(
          "automatic-speech-recognition",
          "Xenova/whisper-base",
          {
            dtype: "fp32",
            useWorker: true,
            progress_callback: onProgress,
          },
        );
        if (!cancelled) setPipe(() => whisperPipe);
      } catch (err) {
        if (!cancelled) setError(err);
        console.error("❌ model load fail :", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
  }, []);

  return { pipe, loading, error, fileProgress };
};

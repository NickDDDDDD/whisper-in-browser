import { pipeline } from "@huggingface/transformers";

export const whisperLoader = async () => {
  const pipe = await pipeline("automatic-speech-recognition", null, {
    device: "webgpu",
  });
  return pipe;
};

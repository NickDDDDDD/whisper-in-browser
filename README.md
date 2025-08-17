# 🗣️ Browser-side Speech-to-Text with Transformers.js

This project demonstrates **speech-to-text (STT) running entirely in the browser**, built with **React + Vite** and [Transformers.js](https://github.com/xenova/transformers.js).  
It uses the open-source model **[`Xenova/whisper-base`](https://huggingface.co/Xenova/whisper-base)**, a Web-friendly ONNX conversion of OpenAI’s Whisper.

## ✨ Features

- **Client-side inference**: Audio never leaves the browser – privacy-friendly and secure.
- **Zero backend required**: Works directly with microphone input, no server needed.
- **Hardware acceleration**: Automatically leverages **WebGPU** if available, falls back to WASM/CPU otherwise.
- **Model flexibility**: Default model is `whisper-base`, but you can swap in `whisper-tiny`, `whisper-small`, or larger variants depending on speed vs. accuracy needs.

## 🚀 Quick Start

```
# Install dependencies
npm install
npm install @xenova/transformers

# Run development server
npm run dev

```

🌐 Live Demo

Try it out directly in your browser (hosted via GitHub Pages):

👉 [Quick Demo on GitHub Pages](https://nickdddddd.github.io/whisper-in-browser/)

⚠️ First run will download model weights (~140 MB for whisper-base). They are cached locally after that.

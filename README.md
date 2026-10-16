# Browser-based AI Object Detector

A lightweight web application for real-time object detection in the browser using client-side machine learning. Built with vanilla JavaScript and Transformers.js.

<img width="800" alt="scanned-img" src="https://github.com/user-attachments/assets/0adf3028-71d1-4b1e-91da-55942e0e7ca9" />


## Overview

This project runs object detection models locally using WebAssembly. It requires no backend server, database, or external API keys. Images uploaded by the user are processed entirely within the browser session.

## Features

- **Ai Model**: Uses the `Xenova/detr-resnet-50` model via Transformers.js for browser-based image processing.
- **Bounding Box Overlay**: Dynamically renders labeled bounding boxes and color-coded tags over detected objects.
- **Canvas Image Export**: Merges HTML overlay elements into a single HTML5 Canvas to download the analyzed image with bounding boxes.
- **Detailed Inspection View**: Displays images within an HTML `<dialog>` modal for high-resolution inspection.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **ML Runtime**: Transformers.js (v3) / ONNX Runtime Web
- **Model**: DETR (DEtection TRansformer) with a ResNet-50 backbone

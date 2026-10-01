# CodeSage

A privacy-first local AI developer assistant that analyzes, explains, fixes, and refactors code using Llama 3.2 through Ollama.

## Overview

CodeSage is a local AI-powered coding assistant designed to help developers understand and improve their code without sending their source code to a remote AI service.

It uses the Llama 3.2 model running locally through Ollama and provides a web-based interface for interacting with the model.

## Features

- 🐛 **Debug Code** — Identify actual bugs and explain their causes.
- 📖 **Explain Code** — Understand how code works step by step.
- 🔧 **Fix Code** — Generate corrected code while preserving the original intent.
- ♻️ **Refactor Code** — Suggest meaningful improvements to code structure and readability.
- 📁 **Project Analysis** — Analyze multiple files together to understand relationships within a project.
- 🔒 **Local AI** — Code analysis is performed using a locally running Llama 3.2 model.
- 💻 **Web Interface** — Simple browser-based developer interface.
- 📝 **Code Diff** — Compare the original code with the generated correction.

## Tech Stack

### AI

- Llama 3.2
- Ollama

### Backend

- Python
- Python Standard Library
- HTTP Server

### Frontend

- HTML
- CSS
- JavaScript
- Highlight.js

## Architecture

```text
┌──────────────────────────┐
│       CodeSage UI        │
│    HTML / CSS / JS       │
└────────────┬─────────────┘
             │
             │ HTTP
             ▼
┌──────────────────────────┐
│      Python Backend      │
│       backend.py         │
└────────────┬─────────────┘
             │
             │ Local API
             ▼
┌──────────────────────────┐
│          Ollama          │
│        Llama 3.2         │
└──────────────────────────┘

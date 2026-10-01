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
```

## How It Works

1. Enter or load source code in the CodeSage interface.
2. Select the programming language.
3. Choose an operation such as **Debug**, **Explain**, **Fix**, or **Refactor**.
4. CodeSage sends the request to the local Python backend.
5. The backend sends the prompt to Llama 3.2 through Ollama.
6. The model analyzes the code locally.
7. The result is displayed in the CodeSage interface.

For project analysis, CodeSage can load multiple supported source files and provide them to the model as project context.

## Supported Languages

Currently supported:

- Java
- Python
- JavaScript
- C
- C++

## Requirements

- Python 3.10+
- Ollama
- Llama 3.2
- A modern web browser

## Installation

### 1. Install Ollama

Install Ollama from:

https://ollama.com/

Then download Llama 3.2:

```bash
ollama pull llama3.2
```

### 2. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/CodeSage.git
cd CodeSage
```

Replace `YOUR-USERNAME` with your GitHub username.

### 3. Start Ollama

```bash
ollama run llama3.2
```

Keep Ollama running.

### 4. Start the CodeSage Backend

Open another terminal:

```bash
python backend.py
```

The backend will run at:

```text
http://localhost:8000
```

### 5. Start the Frontend

Open another terminal:

```bash
python -m http.server 5500 --directory frontend
```

Then open:

```text
http://localhost:5500
```

## Example

CodeSage can analyze code such as:

```java
public class BuggyExample {

    public static void main(String[] args) {

        String name = null;

        System.out.println("Name length: " + name.length());

        System.out.println("Program finished.");
    }
}
```

The **Debug** feature can identify the `NullPointerException`, while the **Fix** feature can generate a corrected version.

## Project Structure

```text
CodeSage/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── samples/
│   └── BuggyExample.java
│
├── backend.py
├── README.md
├── LICENSE
├── .gitignore
└── requirements.txt
```

## Privacy

CodeSage is designed around local code analysis.

The AI model runs locally through Ollama, allowing source code to be processed on the user's machine rather than requiring a cloud AI API.

The frontend uses Highlight.js for code syntax highlighting.

## Why CodeSage?

Modern AI coding assistants often rely on cloud-based services. CodeSage explores a different approach: running an open-weight AI model locally and building useful developer tooling around it.

The project demonstrates how local AI can be integrated into practical software development workflows such as debugging, explanation, refactoring, and project analysis.

## Future Improvements

Potential future improvements include:

- AST-based code analysis
- Automated test generation
- Git integration
- Security vulnerability scanning
- Repository-wide RAG
- Support for additional local models
- Multi-file intelligent code fixes
- Agent-based development workflows
- Improved code diff generation

## License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.

## Built With

Built as an open-source AI project using:

- Llama 3.2
- Ollama
- Python
- HTML
- CSS
- JavaScript

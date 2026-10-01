import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.request


OLLAMA_URL = "http://localhost:11434/api/generate"


def ask_ollama(prompt):
    data = {
        "model": "llama3.2",
        "prompt": prompt,
        "stream": False
    }

    request = urllib.request.Request(
        OLLAMA_URL,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode("utf-8"))

    return result["response"]


def build_prompt(action, language, code):

    instructions = {
        "debug": """
Find actual bugs in the code.

Rules:
- Do not invent bugs.
- Only report problems supported by the code.
- If there are no bugs, say so clearly.
- Explain the cause and provide a fix.
""",

        "explain": """
Explain the code clearly for a programmer who is still learning.

Rules:
- Explain what it does.
- Explain the important parts.
- Do not invent problems.
- If the code is correct, say so.
""",

        "fix": """
Analyze the code for actual problems and provide a corrected version.

Rules:
- Do not invent bugs.
- Preserve the original intent.
- Explain every important change.
""",

        "refactor": """
Review the code for meaningful refactoring opportunities.

Focus on:
- readability
- maintainability
- unnecessary complexity
- duplicated logic
- naming
- potential bugs

Do not suggest pointless changes.
"""
    }

    instruction = instructions.get(action, instructions["debug"])

    return f"""
You are CodeSage, a local AI developer assistant.

The programming language is: {language}

{instruction}

Structure your response clearly with headings.

CODE:

{code}
"""


class CodeSageHandler(BaseHTTPRequestHandler):

    def send_json(self, status, data):

        response = json.dumps(data).encode("utf-8")

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json"
        )

        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )

        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )

        self.end_headers()

        self.wfile.write(response)


    def do_OPTIONS(self):

        self.send_response(204)

        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )

        self.send_header(
            "Access-Control-Allow-Methods",
            "POST, OPTIONS"
        )

        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )

        self.end_headers()


    def do_POST(self):

        if self.path != "/analyze":

            self.send_json(
                404,
                {"error": "Endpoint not found"}
            )

            return


        try:

            content_length = int(
                self.headers.get("Content-Length", 0)
            )

            body = self.rfile.read(content_length)

            data = json.loads(body.decode("utf-8"))

            action = data.get("action", "debug")
            language = data.get("language", "Unknown")
            code = data.get("code", "")

            if not code.strip():

                self.send_json(
                    400,
                    {"error": "No code provided"}
                )

                return


            prompt = build_prompt(
                action,
                language,
                code
            )

            answer = ask_ollama(prompt)

            self.send_json(
                200,
                {
                    "response": answer
                }
            )

        except Exception as error:

            print("Error:", error)

            self.send_json(
                500,
                {
                    "error": str(error)
                }
            )


def main():

    server = HTTPServer(
        ("localhost", 8000),
        CodeSageHandler
    )

    print()
    print("=" * 50)
    print("              CODESAGE BACKEND")
    print("=" * 50)
    print()
    print("Server: http://localhost:8000")
    print("AI:     Llama 3.2 via Ollama")
    print()
    print("Waiting for requests...")
    print()

    try:

        server.serve_forever()

    except KeyboardInterrupt:

        print("\nStopping CodeSage...")

        server.server_close()


if __name__ == "__main__":
    main()
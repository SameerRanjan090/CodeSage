const codeInput =
    document.getElementById("codeInput");

const result =
    document.getElementById("result");

const thinking =
    document.getElementById("thinking");

const language =
    document.getElementById("language");

const lineNumbers =
    document.getElementById("lineNumbers");

const highlighted =
    document.querySelector("#highlightedCode code");

const folderInput =
    document.getElementById("folderInput");

const fileList =
    document.getElementById("fileList");


let projectFiles = [];

let currentFixedCode = null;


const languageMap = {

    "Java": "java",

    "Python": "python",

    "JavaScript": "javascript",

    "C++": "cpp",

    "C": "c"

};


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;

}


function updateEditor() {

    const code =
        codeInput.value;

    const count =
        Math.max(
            1,
            code.split("\n").length
        );


    lineNumbers.textContent =
        Array.from(
            { length: count },
            (_, i) => i + 1
        ).join("\n");


    if (window.hljs) {

        const lang =
            languageMap[language.value]
            || "plaintext";

        try {

            highlighted.innerHTML =
                hljs.highlight(
                    code,
                    {
                        language: lang
                    }
                ).value;

        } catch {

            highlighted.textContent =
                code;

        }

    } else {

        highlighted.textContent =
            code;

    }

}


function syncScroll() {

    document.querySelector(
        ".line-numbers"
    ).scrollTop =
        codeInput.scrollTop;


    document.getElementById(
        "highlightedCode"
    ).scrollTop =
        codeInput.scrollTop;


    document.getElementById(
        "highlightedCode"
    ).scrollLeft =
        codeInput.scrollLeft;

}


codeInput.addEventListener(
    "input",
    updateEditor
);


codeInput.addEventListener(
    "scroll",
    syncScroll
);


language.addEventListener(
    "change",
    updateEditor
);


document.getElementById(
    "copyCodeBtn"
).onclick = async () => {

    await navigator.clipboard.writeText(
        codeInput.value
    );

    const button =
        document.getElementById(
            "copyCodeBtn"
        );

    button.textContent =
        "Copied";

    setTimeout(
        () => button.textContent = "Copy",
        1000
    );

};


document.getElementById(
    "clearBtn"
).onclick = () => {

    codeInput.value = "";

    currentFixedCode = null;

    updateEditor();

};


document.getElementById(
    "folderBtn"
).onclick = () => {

    folderInput.click();

};


folderInput.addEventListener(
    "change",
    async () => {

        projectFiles = [];


        for (
            const file
            of folderInput.files
        ) {

            if (
                file.size > 250000
            ) {
                continue;
            }


            if (
                !/\.(java|py|js|jsx|ts|tsx|cpp|cc|h|hpp|c|cs|go|rs|html|css|json|md)$/i
                    .test(file.name)
            ) {

                continue;

            }


            projectFiles.push({

                name:
                    file.webkitRelativePath
                    || file.name,

                content:
                    await file.text()

            });

        }


        renderFileList();


        if (projectFiles.length) {

            document.getElementById(
                "editorTitle"
            ).textContent =
                `${projectFiles.length} project files loaded`;


            result.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ▦
                    </div>

                    <h3>
                        Project loaded
                    </h3>

                    <p>
                        Click "Analyze Project"
                        to inspect the codebase.
                    </p>

                </div>

            `;

        }

    }
);


function renderFileList() {

    if (!projectFiles.length) {

        fileList.innerHTML = `
            <span class="muted">
                No project loaded
            </span>
        `;

        return;

    }


    fileList.innerHTML =
        projectFiles
            .map(
                (file, i) => `

                    <button
                        class="file-item"
                        data-index="${i}"
                    >
                        ${escapeHtml(file.name)}
                    </button>

                `
            )
            .join("");


    document
        .querySelectorAll(".file-item")
        .forEach(button => {

            button.onclick = () => {

                const file =
                    projectFiles[
                        Number(button.dataset.index)
                    ];


                codeInput.value =
                    file.content;


                document
                    .querySelectorAll(
                        ".file-item"
                    )
                    .forEach(
                        x =>
                            x.classList.remove(
                                "selected"
                            )
                    );


                button.classList.add(
                    "selected"
                );


                const ext =
                    file.name
                        .split(".")
                        .pop()
                        .toLowerCase();


                const extensionMap = {

                    java: "Java",

                    py: "Python",

                    js: "JavaScript",

                    ts: "JavaScript",

                    cpp: "C++",

                    cc: "C++",

                    c: "C"

                };


                if (extensionMap[ext]) {

                    language.value =
                        extensionMap[ext];

                }


                document.getElementById(
                    "editorTitle"
                ).textContent =
                    file.name;


                updateEditor();

            };

        });

}


document.getElementById(
    "singleModeBtn"
).onclick = () => {

    document
        .getElementById(
            "singleModeBtn"
        )
        .classList.add("active");


    document
        .getElementById(
            "projectModeBtn"
        )
        .classList.remove("active");

};


document.getElementById(
    "projectModeBtn"
).onclick = () => {

    document
        .getElementById(
            "projectModeBtn"
        )
        .classList.add("active");


    document
        .getElementById(
            "singleModeBtn"
        )
        .classList.remove("active");

};


document
    .querySelectorAll(
        "[data-action]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () =>
                analyze(
                    button.dataset.action
                )
        );

    });


async function analyze(action) {

    const code =
        codeInput.value;


    if (
        !code.trim()
        && !projectFiles.length
    ) {

        showEmpty(
            "No code provided",
            "Paste code or load a project folder first."
        );

        return;

    }


    if (
        action === "project"
        && !projectFiles.length
    ) {

        showEmpty(
            "No project loaded",
            "Use 'Add Project Folder' first."
        );

        return;

    }


    thinking.textContent =
        "Analyzing…";


    result.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                ◌
            </div>

            <h3>
                CodeSage is thinking...
            </h3>

            <p>
                Running locally with Llama 3.2
            </p>

        </div>

    `;


    const payload = {

        action,

        language:
            language.value,

        code,

        files:
            action === "project"
                ? projectFiles
                : []

    };


    try {

        const response =
            await fetch(
                "http://localhost:8000/analyze",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error
                || "Backend error"
            );

        }


        thinking.textContent =
            "Complete";


        currentFixedCode =
            action === "fix"
                ? extractCodeBlock(
                    data.response
                )
                : null;


        result.innerHTML = `

            <div class="analysis">
                ${escapeHtml(data.response)}
            </div>

            ${
                action === "fix"
                && currentFixedCode

                ? `

                    <div class="fix-actions">

                        <button id="applyFix">
                            Apply Corrected Code
                        </button>

                        <button id="showDiff">
                            Show Diff
                        </button>

                    </div>

                    <div id="diffArea"></div>

                `

                : ""
            }

        `;


        if (
            action === "fix"
            && currentFixedCode
        ) {

            document.getElementById(
                "applyFix"
            ).onclick = () => {

                codeInput.value =
                    currentFixedCode;

                updateEditor();

                document.getElementById(
                    "editorTitle"
                ).textContent =
                    "Corrected code";

            };


            document.getElementById(
                "showDiff"
            ).onclick = () => {

                document.getElementById(
                    "diffArea"
                ).innerHTML =
                    makeDiff(
                        code,
                        currentFixedCode
                    );

            };

        }

    } catch (error) {

        thinking.textContent =
            "Error";


        showEmpty(
            "Connection error",
            error.message
        );

    }

}


function extractCodeBlock(text) {

    const match =
        text.match(
            /```(?:[\w#+.-]+)?\s*([\s\S]*?)```/
        );


    return match
        ? match[1].trim()
        : null;

}


function makeDiff(
    oldText,
    newText
) {

    const oldLines =
        oldText.split("\n");

    const newLines =
        newText.split("\n");


    const max =
        Math.max(
            oldLines.length,
            newLines.length
        );


    let html = "";


    for (
        let i = 0;
        i < max;
        i++
    ) {

        const oldLine =
            oldLines[i];

        const newLine =
            newLines[i];


        if (
            oldLine === newLine
        ) {

            html += `
                <div class="diff-line">
                    ${escapeHtml(oldLine ?? "")}
                </div>
            `;

        } else {

            if (
                oldLine !== undefined
            ) {

                html += `
                    <div class="diff-line diff-remove">
                        - ${escapeHtml(oldLine)}
                    </div>
                `;

            }


            if (
                newLine !== undefined
            ) {

                html += `
                    <div class="diff-line diff-add">
                        + ${escapeHtml(newLine)}
                    </div>
                `;

            }

        }

    }


    return `
        <div class="diff">
            ${html}
        </div>
    `;

}


function showEmpty(
    title,
    message
) {

    result.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                !
            </div>

            <h3>
                ${escapeHtml(title)}
            </h3>

            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;

}


updateEditor();


const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "test" is now active!');

    let currentPanel = undefined;
    let count = 0;

    let disposable = vscode.commands.registerCommand('test.showWebview', function () {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (currentPanel) {
            currentPanel.reveal(columnToShowIn);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                'testWebview',
                'Test Webview',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            currentPanel.webview.html = getWebviewContent(count);

            currentPanel.onDidDispose(
                () => {
                    currentPanel = undefined;
                },
                null,
                context.subscriptions
            );

            currentPanel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'buttonClicked':
                            count++;
                            currentPanel.webview.html = getWebviewContent(count);
                            return;
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    });

    let aiAssistantDisposable = vscode.commands.registerCommand('test.showAIAssistant', function () {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (currentPanel) {
            currentPanel.reveal(columnToShowIn);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                'aiAssistantWebview',
                'AI Assistant',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            currentPanel.webview.html = getAIAssistantWebviewContent();

            currentPanel.onDidDispose(
                () => {
                    currentPanel = undefined;
                },
                null,
                context.subscriptions
            );

            currentPanel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'buttonClicked':
                            count++;
                            currentPanel.webview.html = getAIAssistantWebviewContent();
                            return;
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    });

    context.subscriptions.push(disposable, aiAssistantDisposable);
}

function getWebviewContent(count) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Webview</title>
    </head>
    <body>
        <button id="clickButton">Click me</button>
        <p id="count">Button clicked ${count} times</p>

        <script>
            const vscode = acquireVsCodeApi();

            document.getElementById('clickButton').addEventListener('click', () => {
                vscode.postMessage({
                    command: 'buttonClicked'
                });
            });
        </script>
    </body>
    </html>`;
}

function getAIAssistantWebviewContent() {
    return `
	<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEV://SMITH</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #222; /* Dark background color */
      color: white; /* Text color */
      font-family: Arial, sans-serif; /* Font */
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px; /* Padding on all sides */
      height: 100vh;
    }
    
    h1 {
      text-align: center;
      margin-top: 0; /* Remove default margin */
    }
    textarea {
      width: 90%;
      height: 30vh;
      margin-bottom: 10px; /* Reduced margin between elements */
      padding: 10px;
      font-size: 16px;
      background-color: #333; /* Darker textarea background */
      color: white; /* Text color */
      border: none; /* Remove border */
      resize: none; /* Disable textarea resizing */
      text-align: center; /* Center text */
    }
    .button-container {
      display: flex;
      justify-content: flex-start; /* Align buttons to the left */
      width: 90%;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      margin: 5px;
      background-color: #444; /* Darker button background */
      color: cyan;
      border: none; /* Remove border */
      cursor: pointer; /* Change cursor to pointer */
      border-radius: 5px; /* Rounded corners */
    }
    @media only screen and (max-width: 600px) {
      /* Adjust textarea height for smaller screens */
      textarea {
        height: 20vh;
      }
    }
  </style>
  <script type="importmap">
    {
      "imports": {
        "@google/generative-ai": "https://esm.run/@google/generative-ai"
      }
    }
  </script>
</head>

<body>
  <div class="container">
    <h1>DEV://SMITH</h1>

    <textarea id="searchbox" placeholder="Enter your search here"></textarea>
    <textarea id="outputbox" placeholder="Results will be displayed here" readonly></textarea>

    <div class="button-container">
      <button onclick="run(0)">Search</button>
      <button onclick="run(1)">Debug</button>
      <button onclick="run(2)">Document</button>
    </div>
  </div>

  <script type="module">
    import { GoogleGenerativeAI } from "@google/generative-ai";

    const apiKey = 'AIzaSyAEH3dG-EzGcmJwWIjwYTYeLGKhlcbXIPM'; // Replace with your actual API key

    // Initialize Generative AI and the Generative Model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Export elements to global scope
    window.genAI = genAI;
    window.model = model;
  </script> 

  <script>
    async function run(a) {
      document.getElementById("outputbox").value = "Initializing";

      let prompt = document.getElementById("searchbox").value;

      if (!prompt) {
        document.getElementById("outputbox").value = "Enter a prompt!";
        return;
      }

      try {
        if(a==1){
            prompt=prompt +" debug the code and write only the code";
        }
        else if(a==2){
            prompt=prompt+" for the following code create documentation";
        }
        const result = await window.model.generateContent(prompt); // Access model from global scope
        const response = await result.response;
        const text = await response.text();
    
        document.getElementById("outputbox").value = text;

      } catch (error) {
        console.error("Error:", error);
        document.getElementById("outputbox").value = "An error occurred. Please try again later.";
      }
    }
  </script>
</body>
</html>
`;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};

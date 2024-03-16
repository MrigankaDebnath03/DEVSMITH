const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "test" is now active!');

    let currentPanel = undefined;
    let count = 0;

    let disposable = vscode.commands.registerCommand('test.showWebview', function () {
        const columnToShowIn = vscode.ViewColumn.Two;

        if (currentPanel) {
            currentPanel.reveal(columnToShowIn);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                'testWebview',
                'Test Webview',
                columnToShowIn,
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
        const columnToShowIn = vscode.ViewColumn.Two;

        if (currentPanel) {
            currentPanel.reveal(columnToShowIn);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                'aiAssistantWebview',
                'AI Assistant',
                columnToShowIn,
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

            const editor = vscode.window.activeTextEditor;
            
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
        <button id="clickButton" style="background-color: #ff6347; color: white;">Click me</button>
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
      background-color: #222;
      color: white;
      font-family: Arial, sans-serif;
    }
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        height: 100vh;
          
    background: linear-gradient(45deg,rgb(134, 115, 115), rgba(15, 72, 146, 0.6),rgba(138, 113, 113, 0.6),rgba(52, 109, 156, 0.6));
    background-size: 300% 300%;
    animation: color 8s ease-in infinite;
      }
      
  @keyframes color{
  
  0%{
  background-position: 0 50%;
  }
  50%{
  background-position: 100% 50%;
  }
  100%{
  background-position: 0 50%;
  }
  }
  #title{
    font-size: 40px;
    color:  goldenrod;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  } 
  h1 {
    text-align: center;
    margin-top: 0;
  }
  textarea {
    width: 90%;
    height: 30vh;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 16px;
    background-color:#33333352;
    color: white;
    border: 0.5px solid goldenrod;
    resize: none;
    border-radius: 0px;
    position:relative;
    
  }
  .button-container {
    display: flex;
    justify-content: flex-start;
    width: 90%;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    margin: 5px;
    background-color: #ff6347;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 0px;
    position: relative;
    box-sizing: border-box; 
    font-family: sans-serif;
    }
    @media only screen and (max-width: 600px) {
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
    <h1 id="title">DEV://SMITH</h1>

    <textarea id="searchbox" placeholder="Enter your search here"></textarea>
    <textarea id="outputbox" placeholder="Results will be displayed here" readonly></textarea>

    <div class="button-container">
      <button onclick="run(0)">Search</button>
      <button onclick="run(1)">Debug</button>
      <button onclick="run(2)">Document</button>
      <a href="http://127.0.0.1:5500/Free-Forum-Template/forms2.html" target="_blank"><button id="forum"> forum</button></a>
    </div>
  </div>

  <script type="module">
    import { GoogleGenerativeAI } from "@google/generative-ai";

    const apiKey = 'AIzaSyAEH3dG-EzGcmJwWIjwYTYeLGKhlcbXIPM';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    window.genAI = genAI;
    window.model = model;
  </script> 

  <script>
    async function run(a) {
      document.getElementById("outputbox").value = "Initializing...";

      let prompt = document.getElementById("searchbox").value;
      
      if (!prompt)  {
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
        const result = await window.model.generateContent(prompt);
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

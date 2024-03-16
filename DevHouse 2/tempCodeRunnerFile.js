
// const vscode = require('vscode');
// const fs = require('fs/promises');

// async function readFolderContents(folderPath) {
//   try {
//     const folderUri = vscode.Uri.file(folderPath);
//     const entries = await vscode.workspace.fs.readDirectory(folderUri); // Corrected line
  
//     const fileContents = {};
//     for (const entry of entries) {
//     const entryPath = vscode.Uri.joinPath(folderUri, entry.name);
//     if (entry.type === vscode.FileType.Directory) {
//       const subFolderContents = await readFolderContents(entryPath.fsPath);
//       fileContents[entry.name] = subFolderContents;
//     } else if (entry.type === vscode.FileType.File) {
//       const content = await fs.readFile(entryPath.fsPath, 'utf8');
//       fileContents[entry.name] = content;
//     }
//     }
//     return fileContents;
//   } catch (error) {
//     vscode.window.showErrorMessage(`Error reading folder: ${error.message}`);
//     return {};
//   }
// }

// /**
//  * Activates the extension when the custom command is triggered.
//  * @param {vscode.ExtensionContext} context
//  */
// function activate(context) {
//   console.log('Congratulations, your extension "dev---smith-2" is now active!');

//   let disposable = vscode.commands.registerCommand('dev---smith-2.helloWorld', function () {
//     vscode.window.showInformationMessage('Hello World from DEV://Smith 2!');
//   });

//   // Register moxa command
//   let moxaDisposable = vscode.commands.registerCommand('dev---smith.moxa', function () {
//     const editor = vscode.window.activeTextEditor;
//     if (editor) {
//       const selection = editor.selection;
//       // @ts-ignore
//       const text = editor.document.getText(selection);

//       // Replace selection with 'print('HELLO')'
//       editor.edit(editBuilder => editBuilder.replace(selection, `print('HELLO')`));
//     }
//   });

//   context.subscriptions.push(disposable, moxaDisposable);

//   let folderContents = {}; // Variable to store file contents

//   // Command to trigger folder selection and read contents
//   const readFolderCommand = vscode.commands.registerCommand('dev---smith.readFolder', async () => {
//     const folder = await vscode.window.showOpenDialog({
//       canSelectFolders: true,
//       canSelectFiles: false,
//       title: 'Select Folder to Read'
//     });

//     if (folder && folder.length) {
//       folderContents = await readFolderContents(folder[0].fsPath);

//       // Save file contents to JSON and log to console
//       try {
//         const jsonData = JSON.stringify(folderContents, null, 2); // Format for readability
//         const outputFilePath = folder[0].fsPath + '/folder_contents.json';
//         await fs.writeFile(outputFilePath, jsonData, 'utf8');
//         console.log('File contents saved to:', outputFilePath);
//         console.log('File contents:\n', jsonData);
//         vscode.window.showInformationMessage(`File contents written to ${outputFilePath}`);
//       } catch (error) {
//         vscode.window.showErrorMessage(`Error saving file: ${error.message}`);
//       }

//       vscode.window.showInformationMessage(`All files are read.`);
//     }
//   });

//   // Command to open a webview
//   const openWebViewCommand = vscode.commands.registerCommand('dev---smith.openwebview', () => {
//     const panel = vscode.window.createWebviewPanel(
//       'helloWorld',
//       'Hello World',
//       vscode.ViewColumn.Two, // Changed from One to Two
//       {}
//     );

//     panel.webview.html = getWebviewContent();
//   });

//   context.subscriptions.push(readFolderCommand);
//   context.subscriptions.push(openWebViewCommand);
// }

// function getWebviewContent() {
//   return `
//   <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' vscode-resource:; style-src vscode-resource: 'unsafe-inline'; img-src vscode-resource:; font-src vscode-resource:;">

//   <title>DEV://SMITH</title>
//   <script type="importmap">
//   {
//     "imports": {
//       "@google/generative-ai": "https://esm.run/@google/generative-ai"
//     }
//   }
//   </script>
//   <style>
//     body {
//       margin: 0;
//       padding: 0;
//       background-color: #222; /* Dark background color */
//       color: white; /* Text color */
//       font-family: Arial, sans-serif; /* Font */
//     }
//     .container {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       padding-top: 20px; /* Added padding to top */
//       height: 100vh;
//     }
//     h1 {
//       text-align: center;
//       margin-top: 0; /* Remove default margin */
//     }
//     textarea {
//       width: 90%;
//       height: 30vh;
//       margin-bottom: 10px; /* Reduced margin between elements */
//       padding: 10px;
//       font-size: 16px;
//       background-color: #333; /* Darker textarea background */
//       color: white; /* Text color */
//       border: none; /* Remove border */
//     }
//     .button-container {
//       display: flex;
//       justify-content: space-between;
//       width: 90%;
//     }
//     button {
//       padding: 10px 20px;
//       font-size: 16px;
//       margin: 5px;
//       background-color: #444; /* Darker button background */
//       color: cyan;
//       border: none; /* Remove border */
//       cursor: pointer; /* Change cursor to pointer */
//     }
//     @media only screen and (max-width: 600px) {
//       /* Adjust textarea height for smaller screens */
//       textarea {
//         height: 20vh;
//       }
//     }
//   </style>
// </head>
// <body>

//   <div class="container">
//     <h1>DEV://SMITH</h1>
    
//     <textarea id="inputContent">Your coding buddy</textarea> <!-- Changed id to inputContent -->
//     <textarea id="aiOutput">AI Output</textarea> <!-- Added new textarea with id aiOutput -->

//     <div class="button-container">
//       <button id="debugBtn" onclick="run(1)">Debug</button>
//       <button id="docBtn"  onclick="run(2)" >Generate Documentation</button>
//     </div>
//   </div>

//   <button class="button" id="myButton">Click Me</button>
//   <p id="clickCount">0</p>

//   <script type="module">
//       import { GoogleGenerativeAI } from "@google/generative-ai";

//       const apiKey = 'AIzaSyAEH3dG-EzGcmJwWIjwYTYeLGKhlcbXIPM'; //  API key

//       // Initialize Generative AI and the Generative Model
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//       // Export elements to global scope
//       window.genAI = genAI;
//       window.model = model;
        
//   </script> 

  

//   <script>


//   const button = document.getElementById('myButton');
//   const clickCountElement = document.getElementById('clickCount');

//   // Initialize click count
//   let clickCount = 0;

//   // Add event listener for button click
//   button.addEventListener('click', () => {
//       // Increment click count
//       clickCount++;

//       // Update click count display
//       clickCountElement.textContent = clickCount;

//     });

//     // document.getElementById('debugBtn').addEventListener('click', function() {
//     //   // Add your debug logic here
//     //   run(1);
//     // });


//     // document.getElementById('docBtn').addEventListener('click', function() {
//     //   // Add your documentation generation logic here
//     //   run(2));
//     // });

    
//     async function run(a) {

//       document.getElementById("aiOutput").value = "Initializing";
   
//       let prompt = document.getElementById("inputContent").value;
   
//      if (!prompt) {
//        document.getElementById("aiOutput").value = "enter a prompt!";
//        return;
//      }
   
//      try {
   
//        if(a==1){
//            prompt=prompt +"debug the code wrand ite only the code";
//        }
//        else if(a==2){
//            prompt=prompt+"for the following code create documentation"
//        }
//            const result = await window.model.generateContent(prompt); // Access model from global scope
//            const response = await result.response;
//            const text = await response.text();
       
//        document.getElementById("aiOutput").value = text;
   
//      } catch (error) {
//        console.error("Error:", error);
//        document.getElementById("aiOutput").innerHTML = "An error occurred. Please try again later.";
//      }
//    }



//   </script>
// </body>
// </html>

//   `;
// }

// // This line is only required if you want to access `getFolderContents` from other scripts
// exports.activate = activate;




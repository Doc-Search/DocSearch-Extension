// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import vscode from 'vscode';
// import fetch from 'node-fetch';
const vscode = require("vscode");
const axios = require("axios");
// const fetch = require("node-fetch");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "docsearch.supersearch",
    function () {
      //capture selected text and store in a variable
      let editor = vscode.window.activeTextEditor;
      let selection = editor.selection;
      let selectedText = editor.document.getText(selection);
      //open the browser with the selected text

      vscode.window
        .showInputBox({ prompt: "Search for:", value: selectedText })
        .then(function (value) {
          if (value) {
            var data = JSON.stringify({
              id: "1",
              lang: "en",
              query: value,
            });

            var config = {
              method: "post",
              url: "http://127.0.0.1:8000/search/",
              headers: {
                "Content-Type": "application/json",
              },
              data: data,
            };

            const { Configuration, OpenAIApi } = require("openai");

            const configuration = new Configuration({
              apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);

            axios(config)
              .then((response) => {
                const panel = vscode.window.createWebviewPanel(
                  "docsearch",
                  "docsearch",
                  vscode.ViewColumn.One,
                  {
                    enableScripts: true,
                  }
                );

                async function fetchResponse(value) {
                  const response = await openai.createCompletion(
                    "text-davinci-002",
                    {
                      prompt: value,
                      temperature: 0.7,
                      max_tokens: 200,
                      top_p: 1,
                      frequency_penalty: 0.7,
                      presence_penalty: 0,
                    }
                  );
                  console.log(response);
                  return response;
                }

                panel.webview.html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Answer to query:</title>
                </head>
                <body style="display:flex; flex-direction:column; width:100%;">
                    <h2 style="height:15%; width:100%; border-bottom: 2px solid white; font-family:monospace;">Question: ${value}</h2>
                    <h3 style="width:100%; y-overflow:scroll; x-overflow:none; font-family:monospace;"><span style="width: 100%;">Answer:</span> ${JSON.parse(
                      response.data
                    )
                      .result.replaceAll(" ", "&nbsp;")
                      .replaceAll("\n", "<br />")}
                    </h3>
                    <div id="externals" style="width:75%; height:50%; display: flex; flex-direction: row; position: relative; left:50%; transform: translateX(-50%);">
                      <a href="https://www.google.com/search?q=${value}" target="_blank" style="width: 50%; margin-right: 5px;">
                        <button style="width:100%; height:100%; background-color: #4CAF50; border: 1px solid white; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor:pointer;">Search on Google</button>
                      </a>
                      <a href="https://stackoverflow.com/search?q=${value}" target="_blank" style="width: 50%; margin-right: 5px;">
                        <button style="width:100%; height:100%; background-color: #4CAF50; border: 1px solid white; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer;">Search on StackOverflow</button>
                      </a>
                    </div>
                </body>
                </html>`;
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

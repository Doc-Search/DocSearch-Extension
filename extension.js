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
              url: "http://127.0.0.1:8000/search",
              headers: {
                "Content-Type": "application/json",
              },
              data: data,
            };

            axios(config)
              .then((response) => {
                vscode.window.showInformationMessage(
                  "Response: " + JSON.parse(response.data).result
                );
              })
              .catch(function (error) {
                console.log(error);
              });

            // var myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");

            // var raw = JSON.stringify({
            //   id: "1",
            //   lang: "en",
            //   query: "who invented python",
            // });

            // var requestOptions = {
            //   method: "POST",
            //   headers: myHeaders,
            //   body: raw,
            //   redirect: "follow",
            // };

            // fetch("http://127.0.0.1:8000/search", requestOptions)
            //   .then((response) => response.text())
            //   .then((result) =>
            //   vscode.window.showInformationMessage("Response: " + result)
            //   )
            //   .catch((error) => console.log("error", error));
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

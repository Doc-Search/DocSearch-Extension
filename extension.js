// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
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
	let disposable = vscode.commands.registerCommand('docsearch.supersearch', function () {
		//capture selected text and store in a variable
		let editor = vscode.window.activeTextEditor;
		let selection = editor.selection;
		let selectedText = editor.document.getText(selection);
		//open the browser with the selected text
		
		vscode.window.showInputBox({prompt: "Search for:", value: selectedText}).then(function(value) {
			let responseData = "";
			if (value) {
				// vscode.env.openExternal(vscode.Uri.parse('https://www.google.com/search?q=' + value));
				// perform api call and store data in responseData
				
			}
			vscode.window.showInformationMessage('Response: ' + responseData);
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

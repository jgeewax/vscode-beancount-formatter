// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[vscode-beancount-formatter] activated!');

	let disposable = vscode.languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: 'beancount' }, {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			let formatterPath = vscode.workspace.getConfiguration("beancountFormatter")["binPath"];
			let result = child.spawnSync(formatterPath, [], {
				input: document.getText(),
				cwd: process.cwd(),
				env: process.env,
				stdio: 'pipe',
				encoding: 'utf-8'
			});
			if (result.output[1]) {
				let rangeStart: vscode.Position = document.lineAt(0).range.start;
				let rangeEnd: vscode.Position = document.lineAt(document.lineCount - 1).range.end;
				return [vscode.TextEdit.replace(new vscode.Range(rangeStart, rangeEnd), result.output[1])];
			} else if (result.output[2]) {
				vscode.window.showInformationMessage(result.output[2]);
			}
			return [];
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
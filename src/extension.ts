import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('feature-sliced-design-components.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from FSD Components!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

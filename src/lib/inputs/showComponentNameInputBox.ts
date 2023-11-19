import * as vscode from 'vscode';

export const showComponentNameInputBox = async () =>
  await vscode.window.showInputBox({
    placeHolder: 'Component',
    prompt: 'Enter name of the component',
    ignoreFocusOut: true,
  });

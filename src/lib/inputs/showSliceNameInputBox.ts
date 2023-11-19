import * as vscode from 'vscode';

export const showSliceNameInputBox = async () =>
  await vscode.window.showInputBox({
    placeHolder: 'Slice',
    prompt: 'Enter name of the slice',
    ignoreFocusOut: true,
  });

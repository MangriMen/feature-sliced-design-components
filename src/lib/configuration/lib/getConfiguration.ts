import * as vscode from 'vscode';

export const getConfiguration = () =>
  vscode.workspace.getConfiguration('feature-sliced-design-components');

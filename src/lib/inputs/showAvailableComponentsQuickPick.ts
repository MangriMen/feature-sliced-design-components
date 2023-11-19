import * as vscode from 'vscode';
import { getAvailableComponents } from '../configuration';

export const showAvailableComponentsQuickPick = async (
  context: vscode.ExtensionContext
) => {
  const availableComponents = getAvailableComponents(context);

  return await vscode.window.showQuickPick(Object.keys(availableComponents));
};

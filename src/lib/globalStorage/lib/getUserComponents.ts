import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { getUserComponentsUri } from './getUserComponentsFilePath';

export const getUserComponents = (context: vscode.ExtensionContext) => {
  const userComponentsFileURI = getUserComponentsUri(context);
  return fs.readJSONSync(userComponentsFileURI.fsPath);
};

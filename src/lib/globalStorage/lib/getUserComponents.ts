import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { USER_COMPONENTS_FILENAME } from '../config';

export const getUserComponents = (context: vscode.ExtensionContext) => {
  const userComponentsFileURI = vscode.Uri.joinPath(
    context.globalStorageUri,
    USER_COMPONENTS_FILENAME
  );

  if (!fs.existsSync(userComponentsFileURI.fsPath)) {
    fs.writeJSONSync(userComponentsFileURI.fsPath, {});
  }

  return fs.readJSONSync(userComponentsFileURI.fsPath);
};

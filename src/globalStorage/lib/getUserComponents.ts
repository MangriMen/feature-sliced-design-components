import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { Component } from '../../componentOperator';

const userComponentsFilename = 'userComponents.json';

export const getUserComponents = (context: vscode.ExtensionContext) => {
  const userComponentsFileURI = vscode.Uri.joinPath(
    context.globalStorageUri,
    userComponentsFilename
  );

  if (!fs.existsSync(userComponentsFileURI.fsPath)) {
    fs.writeJSONSync(userComponentsFileURI.fsPath, {});
  }

  return fs.readJSONSync(userComponentsFileURI.fsPath);
};

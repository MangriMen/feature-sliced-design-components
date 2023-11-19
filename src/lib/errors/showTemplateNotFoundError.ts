import * as vscode from 'vscode';

export enum TemplateType {
  component = 'Component',
}

export const showTemplateNotFoundError = (
  templateType: TemplateType,
  templateKey?: string
) => {
  vscode.window.showErrorMessage(
    `${templateType} template "${templateKey}" not found`
  );
};

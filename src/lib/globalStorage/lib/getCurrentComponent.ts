import * as vscode from 'vscode';

import {
  getAvailableComponents,
  getCurrentComponentTemplateKey,
} from '../../configuration';

export const getCurrentComponentTemplate = (
  context: vscode.ExtensionContext
) => {
  const currentComponentTemplateKey = getCurrentComponentTemplateKey();

  if (!currentComponentTemplateKey) {
    return null;
  }

  const availableComponents = getAvailableComponents(context);

  return availableComponents[currentComponentTemplateKey];
};

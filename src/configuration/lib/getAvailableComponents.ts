import * as vscode from 'vscode';

import { getUserComponents } from '../../globalStorage';
import { defaultComponents } from '../../defaultComponents';

export const getAvailableComponents = (context: vscode.ExtensionContext) => ({
  ...defaultComponents,
  ...getUserComponents(context),
});

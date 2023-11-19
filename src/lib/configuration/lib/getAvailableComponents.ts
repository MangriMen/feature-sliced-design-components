import * as vscode from 'vscode';

import { getUserComponents } from '../../globalStorage';
import { FsStructure } from '../../fsStructure';
import { DEFAULT_COMPONENTS } from '../../../config';

export const getAvailableComponents = (
  context: vscode.ExtensionContext
): Record<string, FsStructure> => ({
  ...DEFAULT_COMPONENTS,
  ...getUserComponents(context),
});

import * as vscode from 'vscode';
import { DEFAULT_SEGMENTS } from '../../config';

export const showSegmentNamesQuickPick = async (
  defaultPicked: string[] = []
) => {
  const quickPickSegments = Object.keys(DEFAULT_SEGMENTS).map(
    (segment) =>
      ({
        label: segment,
        picked: defaultPicked.includes(segment),
      } as vscode.QuickPickItem)
  );

  const segments = await vscode.window.showQuickPick(quickPickSegments, {
    canPickMany: true,
    ignoreFocusOut: true,
  });

  return segments?.map((segment) => segment.label);
};

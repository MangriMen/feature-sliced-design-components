import * as vscode from 'vscode';
import { ComponentOperator } from './componentOperator';
import { defaultComponents } from './defaultComponents';
import { defaultSegments } from './defaultSegments';
import { FsStructure, writeFsStructure } from './lib';
import * as path from 'path';
import * as fs from 'fs-extra';

interface Command {
  command: string;
  callback: (...args: any[]) => any;
}

const commands: Command[] = [
  {
    command: 'feature-sliced-design-components.createComponent',
    callback: (uri: vscode.Uri) => createComponent(uri.fsPath),
  },
  {
    command: 'feature-sliced-design-components.createSegment',
    callback: (uri: vscode.Uri) => createSegment(uri.fsPath),
  },
  {
    command: 'feature-sliced-design-components.createSlice',
    callback: (uri: vscode.Uri) => createSlice(uri.fsPath),
  },
];

async function createComponent(folderPath: string) {
  const componentName = await vscode.window.showInputBox({
    placeHolder: 'Component',
    prompt: 'Enter name of the component',
    ignoreFocusOut: true,
  });

  if (!componentName) {
    return;
  }

  const component = new ComponentOperator(defaultComponents.defaultComponent);
  component.write(folderPath, componentName);
}

async function createSegment(folderPath: string) {
  const quickPickSegments = Object.keys(defaultSegments).map(
    (segment) =>
      ({
        label: segment,
      } as vscode.QuickPickItem)
  );

  const segmentNames = await vscode.window.showQuickPick(quickPickSegments, {
    canPickMany: true,
    ignoreFocusOut: true,
  });

  if (!segmentNames) {
    return;
  }

  const segments = segmentNames.reduce((acc, segmentItem) => {
    acc[segmentItem.label] =
      defaultSegments[segmentItem.label as keyof typeof defaultSegments];
    return acc;
  }, {} as FsStructure);

  writeFsStructure(segments, folderPath);

  const parentIndex = path.join(folderPath, 'index.ts');
  if (fs.existsSync(parentIndex)) {
    fs.appendFileSync(
      parentIndex,
      segmentNames.reduce(
        (acc, segmentItem) => `${acc}export * from './${segmentItem.label}';\n`,
        ''
      )
    );
  }
}

async function createSlice(folderPath: string) {
  const quickPickSegments = Object.keys(defaultSegments).map(
    (segment) =>
      ({
        label: segment,
        picked: segment === 'ui',
      } as vscode.QuickPickItem)
  );

  const sliceName = await vscode.window.showInputBox({
    placeHolder: 'slice',
    prompt: 'Enter name of the slice',
    ignoreFocusOut: true,
  });

  if (!sliceName) {
    return;
  }

  const segmentNames = await vscode.window.showQuickPick(quickPickSegments, {
    canPickMany: true,
    ignoreFocusOut: true,
  });

  if (!segmentNames) {
    return;
  }

  const sliceContent = segmentNames.reduce((acc, segmentItem) => {
    acc[segmentItem.label] =
      defaultSegments[segmentItem.label as keyof typeof defaultSegments];
    return acc;
  }, {} as FsStructure);

  sliceContent['index.ts'] = segmentNames.reduce(
    (acc, segmentItem) => `${acc}export * from './${segmentItem.label}';\n`,
    ''
  );

  const slice: FsStructure = {
    [sliceName]: sliceContent,
  };

  writeFsStructure(slice, folderPath);
}

function registerCommands(context: vscode.ExtensionContext) {
  const disposables = commands.map((command) =>
    vscode.commands.registerCommand(command.command, command.callback)
  );

  context.subscriptions.push(...disposables);
}

export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
}

export function deactivate() {}

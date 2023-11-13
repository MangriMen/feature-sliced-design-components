import * as vscode from 'vscode';
import { ComponentOperator } from './componentOperator';
import { defaultSegments } from './defaultSegments';
import { FsStructure, writeFsStructure } from './lib';
import * as path from 'path';
import * as fs from 'fs-extra';
import {
  getAvailableComponents,
  setCurrentComponentTemplateKey,
  getCurrentComponentTemplateKey,
} from './configuration';

interface Command {
  command: string;
  callback: (...args: any[]) => any;
}

const commands: Command[] = [
  {
    command: 'fsd-components.changeComponentTemplate',
    callback: (context: vscode.ExtensionContext) =>
      changeComponentTemplate(context),
  },
  {
    command: 'fsd-components.createComponent',
    callback: (context: vscode.ExtensionContext, uri: vscode.Uri) =>
      createComponent(context, uri.fsPath),
  },
  {
    command: 'fsd-components.createSegment',
    callback: (uri: vscode.Uri) => createSegment(uri.fsPath),
  },
  {
    command: 'fsd-components.createSlice',
    callback: (uri: vscode.Uri) => createSlice(uri.fsPath),
  },
];

async function changeComponentTemplate(context: vscode.ExtensionContext) {
  const availableComponents = getAvailableComponents(context);

  const componentTemplateKey = await vscode.window.showQuickPick(
    Object.keys(availableComponents)
  );

  if (!componentTemplateKey) {
    return;
  }

  setCurrentComponentTemplateKey(componentTemplateKey);
}

async function createComponent(
  context: vscode.ExtensionContext,
  folderPath: string
) {
  const componentName = await vscode.window.showInputBox({
    placeHolder: 'Component',
    prompt: 'Enter name of the component',
    ignoreFocusOut: true,
  });

  if (!componentName) {
    return;
  }

  const currentComponentTemplateKey = getCurrentComponentTemplateKey();
  const availableComponents = getAvailableComponents(context);

  const currentTemplate =
    availableComponents[currentComponentTemplateKey || 'defaultComponent'];

  if (!currentTemplate) {
    vscode.window.showErrorMessage(
      `Can't find "${currentComponentTemplateKey}" template`
    );
  }

  const component = new ComponentOperator(currentTemplate);
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
    vscode.commands.registerCommand(command.command, (args) =>
      command.callback(context, args)
    )
  );

  context.subscriptions.push(...disposables);
}

export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
}

export function deactivate() {}

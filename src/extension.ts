import * as vscode from 'vscode';

import {
  getAvailableComponents,
  setCurrentComponentTemplateKey,
  getCurrentComponentTemplateKey,
} from './lib/configuration';
import { TemplateType, showTemplateNotFoundError } from './lib/errors';
import {
  showAvailableComponentsQuickPick,
  showComponentNameInputBox,
  showSegmentNamesQuickPick,
  showSliceNameInputBox,
} from './lib/inputs';

import { Slice } from './lib/slice';
import { Component } from './lib/component';
import { getSegmentsFromSegmentNames } from './lib/segment';
import { getUserComponentsUri } from './lib/globalStorage/lib/getUserComponentsFilePath';

interface Command {
  command: string;
  callback: (...args: any[]) => any;
}

const commands: Command[] = [
  {
    command: 'feature-sliced-design-components.openComponentsConfig',
    callback: (context: vscode.ExtensionContext) =>
      openComponentsConfig(context),
  },
  {
    command: 'feature-sliced-design-components.changeComponentTemplate',
    callback: (context: vscode.ExtensionContext) =>
      changeComponentTemplate(context),
  },
  {
    command: 'feature-sliced-design-components.createComponent',
    callback: (context: vscode.ExtensionContext, uri: vscode.Uri) =>
      createComponent(context, uri.fsPath),
  },
  {
    command: 'feature-sliced-design-components.createSegment',
    callback: (_, uri: vscode.Uri) => createSegment(uri.fsPath),
  },
  {
    command: 'feature-sliced-design-components.createSlice',
    callback: (_, uri: vscode.Uri) => createSlice(uri.fsPath),
  },
];

async function openComponentsConfig(context: vscode.ExtensionContext) {
  const userComponentsUri = getUserComponentsUri(context);

  vscode.workspace
    .openTextDocument(userComponentsUri)
    .then((doc) => vscode.window.showTextDocument(doc));
}

async function changeComponentTemplate(context: vscode.ExtensionContext) {
  const componentTemplateKey = await showAvailableComponentsQuickPick(context);
  if (!componentTemplateKey) {
    return;
  }

  setCurrentComponentTemplateKey(componentTemplateKey);
}

async function createComponent(
  context: vscode.ExtensionContext,
  folderPath: string
) {
  const componentName = await showComponentNameInputBox();
  if (!componentName) {
    return;
  }

  const currentComponentTemplateKey = getCurrentComponentTemplateKey();
  if (!currentComponentTemplateKey) {
    showTemplateNotFoundError(
      TemplateType.component,
      currentComponentTemplateKey
    );
    return;
  }

  const availableComponents = getAvailableComponents(context);

  const currentTemplate = availableComponents[currentComponentTemplateKey];
  if (!currentTemplate) {
    showTemplateNotFoundError(
      TemplateType.component,
      currentComponentTemplateKey
    );
    return;
  }

  const component = new Component(componentName, currentTemplate);
  component.write(folderPath);
}

async function createSegment(folderPath: string) {
  const segmentNames = await showSegmentNamesQuickPick();
  if (!segmentNames) {
    return;
  }

  const segments = getSegmentsFromSegmentNames(segmentNames);

  segments.forEach((segment) => segment.write(folderPath, true));
}

async function createSlice(folderPath: string) {
  const sliceName = await showSliceNameInputBox();
  if (!sliceName) {
    return;
  }

  const segmentNames = await showSegmentNamesQuickPick(['ui']);
  if (!segmentNames) {
    return;
  }

  const segments = getSegmentsFromSegmentNames(segmentNames);

  const slice = new Slice(sliceName);
  slice.addSegments(segments);
  slice.write(folderPath);
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

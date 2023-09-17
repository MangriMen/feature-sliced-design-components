import * as vscode from 'vscode';
import { ComponentOperator } from './componentOperator';
import { components } from './defaultComponents';

interface Command {
  command: string;
  callback: (...args: any[]) => any;
}

const commands: Command[] = [
  {
    command: 'feature-sliced-design-components.createComponent',
    callback: (uri: vscode.Uri) => {
      createComponent(uri.fsPath);
    },
  },
];

async function createComponent(folderPath: string) {
  const componentName = await vscode.window.showInputBox({
    placeHolder: 'Button',
    prompt: 'Enter name of the component',
    ignoreFocusOut: true,
  });

  if (!componentName) {
    return;
  }

  const component = new ComponentOperator(components.defaultComponent);
  component.write(folderPath, componentName);
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

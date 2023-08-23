import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

interface Command {
  command: string;
  callback: (...args: any[]) => any;
}

const commands: Command[] = [
  {
    command: "feature-sliced-design-components.createComponent",
    callback: (uri: vscode.Uri) => {
      createComponent(uri.fsPath);
    },
  },
];

async function createComponent(folderPath: string) {
  const componentName =
    (await vscode.window.showInputBox({
      placeHolder: "Button",
      prompt: "Enter name of the component",
    })) ?? "";

  const rootFolder = path.join(folderPath, componentName);

  const rootIndex = path.join(rootFolder, "index.ts");
  const rootIndexData = `export {default as ${componentName}} from './${componentName}';\nexport type * from './ts';`;

  const rootComponent = path.join(rootFolder, `${componentName}.tsx`);
  const rootComponentData = `import { I${componentName}Props } from './ts';

const ${componentName} = ({ ...props }: I${componentName}Props) => {
  return <div {...props}>{'${componentName}'}</div>;
};
  
export default ${componentName};`;

  const tsFolder = path.join(rootFolder, "ts");

  const tsIndex = path.join(tsFolder, "index.ts");
  const tsIndexData = "export type * from './interfaces';";

  const tsInterfaces = path.join(tsFolder, "interfaces.ts");
  const tsInterfacesData = `export interface I${componentName}Props {}`;

  fs.mkdirSync(rootFolder);
  fs.writeFileSync(rootIndex, rootIndexData);
  fs.writeFileSync(rootComponent, rootComponentData);

  fs.mkdirSync(tsFolder);
  fs.writeFileSync(tsIndex, tsIndexData);
  fs.writeFileSync(tsInterfaces, tsInterfacesData);
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

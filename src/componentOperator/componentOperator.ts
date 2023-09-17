import * as fs from 'fs-extra';
import * as path from 'path';
import { Component } from './ts';
import { getFilesList, setComplexProperty } from './lib';

class ComponentOperator {
  componentNameId: string = 'ComponentName';
  component: Component;

  constructor(componentObject: Component) {
    this.component = componentObject;
  }

  static _fromFilesList(
    filesList: string[],
    parentFolder: string
  ): ComponentOperator {
    const component: Component = {};

    filesList.forEach((file) => {
      const fileKeyPath = file.replace(`${parentFolder}/`, '');
      const fileValue = fs.readFileSync(file).toString('utf-8');

      setComplexProperty(component, fileKeyPath, fileValue, '/');
    });

    return new ComponentOperator(component);
  }

  static _addExportToIndex(parentFolderPath: string, componentName: string) {
    const parentIndex = path.join(parentFolderPath, 'index.ts');
    if (fs.existsSync(parentIndex)) {
      fs.appendFileSync(parentIndex, `export * from './${componentName}';\n`);
    }
  }

  _writeComponent(component: Component, path: string, componentName: string) {
    Object.entries(component).forEach(([key, value]) => {
      const newPath = `${path}/${key}`;

      if (typeof value !== 'string') {
        this._writeComponent(
          component[key] as Component,
          newPath,
          componentName
        );
      } else {
        const filename = newPath.replaceAll(
          this.componentNameId,
          componentName
        );
        const fileContent = (component[key] as string).replaceAll(
          this.componentNameId,
          componentName
        );

        fs.outputFileSync(filename, fileContent, 'utf-8');
      }
    });
  }

  static fromFolder(folder: string): ComponentOperator {
    return this._fromFilesList(getFilesList(folder), folder);
  }

  write(
    parentFolderPath: string,
    componentName: string,
    addToIndex: boolean = true
  ) {
    this._writeComponent(
      this.component,
      `${parentFolderPath}/${componentName}`,
      componentName
    );

    if (addToIndex) {
      ComponentOperator._addExportToIndex(parentFolderPath, componentName);
    }
  }
}

export default ComponentOperator;

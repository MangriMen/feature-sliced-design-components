import * as fs from 'fs-extra';

import { BaseComponent } from '../baseComponent';
import { getFilesList, setComplexProperty } from './lib';
import { replaceComponentName } from './lib/replaceComponentName';
import { FsStructure } from '../fsStructure';

export class Component extends BaseComponent {
  baseStructure: FsStructure;

  constructor(name: string, structure?: FsStructure) {
    super(name, {});
    this.name = name;

    this.baseStructure = {};
    this.baseStructure[this.name] = structure ?? {};
  }

  static _fromFilesList(
    filesList: string[],
    parentFolder: string
  ): FsStructure {
    const component: FsStructure = {};

    filesList.forEach((file) => {
      const fileKeyPath = file.replace(`${parentFolder}/`, '');
      const fileValue = fs.readFileSync(file).toString('utf-8');

      setComplexProperty(component, fileKeyPath, fileValue, '/');
    });

    return component;
  }

  static fromFolder(name: string, folder: string): Component {
    return new Component(
      name,
      this._fromFilesList(getFilesList(folder), folder)
    );
  }

  setName(name: string) {
    this.name = name;
    this.structure[this.name] = {};
  }

  write(path_: string, append: boolean = true) {
    if (!Object.keys(this.structure[this.name]).length) {
      this.structure = replaceComponentName(this.name, this.baseStructure);
    }

    super.write(path_, append);
  }
}

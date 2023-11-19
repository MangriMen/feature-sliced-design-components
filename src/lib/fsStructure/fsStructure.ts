import { writeFsStructure } from './lib';
import { FsStructure } from './ts';

export class FsStructureOperator {
  structure: FsStructure;

  constructor(structure?: FsStructure) {
    this.structure = structure ?? {};
  }

  write(path: string, append: boolean = false) {
    writeFsStructure(this.structure, path, append);
  }
}

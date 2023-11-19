import * as path from 'path';
import * as fs from 'fs-extra';

import { FsStructure, FsStructureOperator } from '../fsStructure';
import { INDEX_FILE_TS } from '../../config';
import { getExportEntry } from '../getExportEntry';

export class BaseComponent extends FsStructureOperator {
  name: string;

  constructor(name: string, structure?: FsStructure) {
    super({});
    this.name = name;

    this.structure[this.name] = structure ?? {};
  }

  write(path_: string, append?: boolean) {
    if (append) {
      const parentIndex = path.join(path_, INDEX_FILE_TS);

      if (fs.existsSync(parentIndex)) {
        const indexEntry = getExportEntry(this.name);

        const entryAlreadyExists = fs
          .readFileSync(parentIndex)
          .toString()
          .includes(indexEntry);

        if (!entryAlreadyExists) {
          new FsStructureOperator({
            [INDEX_FILE_TS]: indexEntry,
          }).write(path_, append);
        }
      }
    }

    super.write(path_, false);
  }
}

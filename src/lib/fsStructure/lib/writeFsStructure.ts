import * as fs from 'fs-extra';
import { FsStructure } from '../ts';

const writeFsStructureFunction = (
  structure: FsStructure,
  path: string,
  writeFileFunction: (
    file: string | fs.PathOrFileDescriptor | any,
    data: string | NodeJS.ArrayBufferView | Uint8Array | any,
    options?: fs.WriteFileOptions
  ) => void
) => {
  Object.entries(structure).forEach(([key, value]) => {
    const newPath = `${path}/${key}`;

    if (typeof value !== 'string') {
      writeFsStructureFunction(
        structure[key] as FsStructure,
        newPath,
        writeFileFunction
      );
    } else {
      writeFileFunction(newPath, structure[key] as string, 'utf-8');
    }
  });
};

export const writeFsStructure = (
  structure: FsStructure,
  path: string,
  append: boolean = false
) => {
  writeFsStructureFunction(
    structure,
    path,
    append ? fs.appendFileSync : fs.outputFileSync
  );
};

import * as fs from 'fs-extra';

export interface FsStructure extends Record<string, string | FsStructure> {}

const writeFsStructureFunction = (structure: FsStructure, path: string) => {
  Object.entries(structure).forEach(([key, value]) => {
    const newPath = `${path}/${key}`;

    if (typeof value !== 'string') {
      writeFsStructureFunction(structure[key] as FsStructure, newPath);
    } else {
      fs.outputFileSync(newPath, structure[key] as string, 'utf-8');
    }
  });
};

export const writeFsStructure = (structure: FsStructure, path: string) => {
  writeFsStructureFunction(structure, path);
};

import * as fs from 'fs-extra';

export const getFilesList = (directory: string): string[] => {
  let results: string[] = [];

  fs.readdirSync(directory).forEach((file: string) => {
    const fileToCheck = `${directory}/${file}`;

    const stat = fs.statSync(fileToCheck);

    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesList(fileToCheck));
    } else {
      results.push(fileToCheck);
    }
  });

  return results;
};

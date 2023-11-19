import { FsStructure } from '../../fsStructure';
import { COMPONENT_NAME_PLACEHOLDER } from '../config';

export const replaceComponentName = (
  componentName: string,
  structure: FsStructure
): FsStructure => {
  const jsonStructure = JSON.stringify(structure).replaceAll(
    COMPONENT_NAME_PLACEHOLDER,
    componentName
  );

  return JSON.parse(jsonStructure);
};

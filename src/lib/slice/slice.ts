import { INDEX_FILE_TS } from '../../config';
import { BaseComponent } from '../baseComponent';
import { FsStructure } from '../fsStructure';
import { getExportEntry } from '../getExportEntry';
import { Segment } from '../segment';

export class Slice extends BaseComponent {
  addSegments(segments: Segment[]) {
    const segmentStructures = segments.reduce<FsStructure>(
      (acc, segment) => ({ ...acc, ...segment.structure }),
      {}
    );

    this.structure[this.name] = { ...segmentStructures };

    const indexEntry = Object.keys(segmentStructures)
      .sort()
      .reduce((acc, folder) => `${acc}${getExportEntry(folder)}\n`, '');

    if (!(this.structure[this.name] as FsStructure)[INDEX_FILE_TS]) {
      (this.structure[this.name] as FsStructure)[INDEX_FILE_TS] = '';
    }

    (this.structure[this.name] as FsStructure)[INDEX_FILE_TS] += indexEntry;
  }
}

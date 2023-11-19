import { DEFAULT_SEGMENTS } from '../../config';
import { Segment } from './segment';

export const getSegmentsFromSegmentNames = (segmentNames: string[]) => {
  return segmentNames.map(
    (segmentName) =>
      new Segment(
        segmentName,
        DEFAULT_SEGMENTS[segmentName as keyof typeof DEFAULT_SEGMENTS]
      )
  );
};

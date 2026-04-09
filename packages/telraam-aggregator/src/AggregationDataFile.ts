import { ParametrizedDataFile } from 'telraam-downloader';
import { z } from 'zod';

import { aggregatedSchema } from './aggregatedSchema';
import { AggregationConfig } from './AggregationConfig';
import { AggregationTimeType } from './AggregationTime';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parametersSchema = z.object({
  segmentId: z.number().int(),
  range: z.nativeEnum(AggregationTimeType),
  step: z.nativeEnum(AggregationTimeType),
  key: z.string(),
});

export const getAggregationDataFile =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <Config extends AggregationConfig>(): ParametrizedDataFile<
      z.infer<typeof parametersSchema>,
      z.infer<typeof aggregatedSchema>
    > =>
    ({ segmentId, range, step, key }) => ({
      path: `${segmentId}/${range}/${step}/${key}.json`,
      type: aggregatedSchema,
    });

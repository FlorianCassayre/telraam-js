import { ParametrizedDataFile } from 'telraam-downloader';
import { z } from 'zod';

import { aggregatedMetaSchema, aggregatedSchema } from './aggregatedSchema';
import { AggregationConfig } from './AggregationConfig';
import { AggregationTimeType } from './AggregationTime';

const parametersSchemaBase = z.object({
  segmentId: z.number().int(),
  range: z.nativeEnum(AggregationTimeType),
  step: z.nativeEnum(AggregationTimeType),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parametersSchema = parametersSchemaBase.extend({
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

export const getAggregationMetaDataFile =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <Config extends AggregationConfig>(): ParametrizedDataFile<
      z.infer<typeof parametersSchemaBase>,
      z.infer<typeof aggregatedMetaSchema>
    > =>
    ({ segmentId, range, step }) => ({
      path: `${segmentId}/${range}/${step}/metadata.json`,
      type: aggregatedMetaSchema,
    });

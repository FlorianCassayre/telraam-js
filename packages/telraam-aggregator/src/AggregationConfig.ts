import { z } from 'zod';

import { AggregationTimeType } from './AggregationTime';

// (range, step)
export const aggregationConfigSchema = z.record(
  z.nativeEnum(AggregationTimeType),
  z.record(z.nativeEnum(AggregationTimeType), z.boolean()),
);

export type AggregationConfig = z.infer<typeof aggregationConfigSchema>;

export const flattenAggregationConfig = (
  config: AggregationConfig,
): { range: AggregationTimeType; step: AggregationTimeType }[] =>
  Object.keys(config)
    .map((range) => range as AggregationTimeType)
    .flatMap((range) =>
      Object.keys(config[range] ?? {})
        .map((step) => step as AggregationTimeType)
        .filter((step) => (config[range] ?? {})[step])
        .map((step) => ({ range, step })),
    );

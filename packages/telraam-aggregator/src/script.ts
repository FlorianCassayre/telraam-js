import { z } from 'zod';

import { aggregate } from './aggregate';
import { AggregationTimeType } from './AggregationTime';

const argsSchema = z.tuple([z.string(), z.string()]);

const parsed = argsSchema.parse(process.argv.slice(2));

const [inputPath, outputPath] = parsed;

void aggregate({
  inputPath,
  outputPath,
  config: {
    [AggregationTimeType.All]: {
      [AggregationTimeType.Week]: true,
      [AggregationTimeType.Day]: true,
    },
    [AggregationTimeType.Day]: { [AggregationTimeType.Hour]: true },
    [AggregationTimeType.Month]: { [AggregationTimeType.Week]: true },
  },
});

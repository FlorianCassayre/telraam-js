import { z } from 'zod';

import { run } from './run';

const numberSchema = z.string().regex(/^\d+$/).transform(Number);

const argsSchema = z.tuple([z.string().min(1), numberSchema]).rest(numberSchema);

const parsed = argsSchema.parse(process.argv.slice(2));

const [outputPath, ...segmentIds] = parsed;

void run({ outputPath, segmentIds });

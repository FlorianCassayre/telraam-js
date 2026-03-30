import { z } from 'zod';

import { getSegmentTimeRange } from './common';

export const measurementsSpeedSchema = z.object({
  data: z.object({
    zero: z.number(),
    ten: z.number(),
    twenty: z.number(),
    thirty: z.number(),
    fourty: z.number(),
    fifty: z.number(),
    sixty: z.number(),
    seventy: z.number(),
    totalTraffic: z.number(),
    total: z.number(),
    zeroPerc: z.string(),
    tenPerc: z.string(),
    twentyPerc: z.string(),
    thirtyPerc: z.string(),
    fourtyPerc: z.string(),
    fiftyPerc: z.string(),
    sixtyPerc: z.string(),
    seventyPerc: z.string(),
  }),
  labels: z.array(z.string()),
});

export const measurementsSpeedGetRoute = getSegmentTimeRange({
  path: '/measurements-speed',
  schema: measurementsSpeedSchema,
});

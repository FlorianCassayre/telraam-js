import { makeEndpoint } from '@zodios/core';
import { z } from 'zod';

import { dateIso, idSchema } from './common';

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
    zeroPerc: z.string().optional(),
    tenPerc: z.string().optional(),
    twentyPerc: z.string().optional(),
    thirtyPerc: z.string().optional(),
    fourtyPerc: z.string().optional(),
    fiftyPerc: z.string().optional(),
    sixtyPerc: z.string().optional(),
    seventyPerc: z.string().optional(),
  }),
  labels: z.array(z.string()),
});

export const measurementsSpeedGetRoute = makeEndpoint({
  method: 'get',
  path: '/measurements-speed/segments/:id/:from/:to',
  alias: 'getMeasurementsSpeed',
  description: 'Distribution of car vehicle speeds. Corresponds to the "Speed cars".',
  parameters: [
    { name: 'id', type: 'Path', schema: idSchema },
    { name: 'from', type: 'Path', schema: dateIso },
    { name: 'to', type: 'Path', schema: dateIso },
  ],
  response: measurementsSpeedSchema,
});

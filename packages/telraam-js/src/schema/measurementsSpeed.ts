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

export const measurementsSpeedGetRoute = makeEndpoint({
  method: 'get',
  path: '/measurements-speed/segments/:id/:from/:to',
  alias: 'getMeasurementsSpeed',
  parameters: [
    { name: 'id', type: 'Path', schema: idSchema },
    { name: 'from', type: 'Path', schema: dateIso },
    { name: 'to', type: 'Path', schema: dateIso },
  ],
  response: measurementsSpeedSchema,
});

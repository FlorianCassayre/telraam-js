import { makeEndpoint } from '@zodios/core';
import { z } from 'zod';

import { dateIso, idSchema } from './common';

export const measurementsHourBarchartPctUpSchema = z.object({
  labels: z.array(z.string()),
  dates: z.array(z.unknown()),
  data: z.object({
    pedestrian: z.array(z.number()),
    bike: z.array(z.number()),
    car: z.array(z.number()),
    heavy: z.array(z.number()),
    night: z.array(z.number()),
    speed_V85: z.array(z.number()),
    pedestrianUncertain: z.array(z.number()),
    bikeUncertain: z.array(z.number()),
    carUncertain: z.array(z.number()),
    heavyUncertain: z.array(z.number()),
    nightUncertain: z.array(z.number()),
    speed_V85Uncertain: z.array(z.number()),
    pctUp: z.array(z.number()),
  }),
  dayticks: z.number(),
});

export const measurementsHourBarchartPctUpGetRoute = makeEndpoint({
  method: 'get',
  path: '/measurements-hour-barchart-pct-up/segments/:id/:from/:to',
  alias: 'getMeasurementsHourBarchartPctUp',
  description: 'Number of vehicles by type per hour. Corresponds to the "Overview in detail".',
  parameters: [
    { name: 'id', type: 'Path', schema: idSchema },
    { name: 'from', type: 'Path', schema: dateIso },
    { name: 'to', type: 'Path', schema: dateIso },
  ],
  response: measurementsHourBarchartPctUpSchema,
});

import { z } from 'zod';

import { getSegmentTimeRange } from './common';

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

export const measurementsHourBarchartPctUpGetRoute = getSegmentTimeRange({
  path: '/measurements-hour-barchart-pct-up',
  schema: measurementsHourBarchartPctUpSchema,
});

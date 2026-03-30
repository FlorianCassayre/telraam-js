import { z } from 'zod';

import { getSegmentTimeRange } from './common';

export const measurements24HourChartSchema = z.object({
  labels: z.array(z.string()),
  dates: z.array(z.string()),
  data: z.object({
    pedestrian: z.array(z.number()),
    bike: z.array(z.number()),
    car: z.array(z.number()),
    heavy: z.array(z.number()),
    night: z.array(z.number()),
    speed_v85: z.array(z.number()),
    pedestrianWeekdays: z.array(z.number()),
    bikeWeekdays: z.array(z.number()),
    carWeekdays: z.array(z.number()),
    heavyWeekdays: z.array(z.number()),
    nightWeekdays: z.array(z.number()),
    speed_v85Weekdays: z.array(z.number()),
    pedestrianWeekend: z.array(z.number()),
    bikeWeekend: z.array(z.number()),
    carWeekend: z.array(z.number()),
    heavyWeekend: z.array(z.number()),
    nightWeekend: z.array(z.number()),
    speed_v85Weekend: z.array(z.number()),
  }),
});

export const measurements24HourChartGetRoute = getSegmentTimeRange({
  path: '/measurements-24-hour-chart',
  schema: measurements24HourChartSchema,
});

import { z } from 'zod';

import { getSegmentTimeRange } from './common';

export const measurements24HourChartDirectionSchema = z.object({
  labels: z.array(z.string()),
  dates: z.array(z.string()),
  data: z.object({
    pedestrian_rgt: z.array(z.number()),
    bike_rgt: z.array(z.number()),
    car_rgt: z.array(z.number()),
    heavy_rgt: z.array(z.number()),
    night_rgt: z.array(z.number()),
    pedestrian_lft: z.array(z.number()),
    bike_lft: z.array(z.number()),
    car_lft: z.array(z.number()),
    heavy_lft: z.array(z.number()),
    night_lft: z.array(z.number()),
  }),
});

export const measurements24HourChartDirectionGetRoute = getSegmentTimeRange({
  path: '/measurements-24-hour-chart-direction',
  schema: measurements24HourChartDirectionSchema,
});

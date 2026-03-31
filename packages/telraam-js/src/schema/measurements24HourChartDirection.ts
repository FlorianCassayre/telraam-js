import { makeEndpoint } from '@zodios/core';
import { z } from 'zod';

import { dateIso, idSchema } from './common';

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

export const measurements24HourChartDirectionGetRoute = makeEndpoint({
  method: 'get',
  path: '/measurements-24-hour-chart-direction/segments/:id/:from/:to',
  alias: 'getMeasurements24HourChartDirection',
  parameters: [
    { name: 'id', type: 'Path', schema: idSchema },
    { name: 'from', type: 'Path', schema: dateIso },
    { name: 'to', type: 'Path', schema: dateIso },
  ],
  response: measurements24HourChartDirectionSchema,
});

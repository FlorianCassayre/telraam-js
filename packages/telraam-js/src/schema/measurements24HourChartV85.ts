import { makeEndpoint } from '@zodios/core';
import { z } from 'zod';

import { dateIso, idSchema } from './common';

export const measurements24HourChartV85Schema = z.object({
  labels: z.array(z.string()),
  dates: z.array(z.string()),
  data: z.object({
    speed_v85: z.array(z.number()),
    speed_histogram_opacity: z.array(z.number()),
  }),
});

export const measurements24HourChartV85GetRoute = makeEndpoint({
  method: 'get',
  path: '/measurements-24-hour-chart-v85/segments/:id/:from/:to',
  alias: 'getMeasurements24HourChartV85',
  description: 'Average speed of car vehicles per hour in 24 hours. Corresponds to the "Speed cars V85".',
  parameters: [
    { name: 'id', type: 'Path', schema: idSchema },
    { name: 'from', type: 'Path', schema: dateIso },
    { name: 'to', type: 'Path', schema: dateIso },
  ],
  response: measurements24HourChartV85Schema,
});

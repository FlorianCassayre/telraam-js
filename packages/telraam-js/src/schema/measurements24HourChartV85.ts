import { z } from 'zod';

import { getSegmentTimeRange } from './common';

export const measurements24HourChartV85Schema = z.object({
  labels: z.array(z.string()),
  dates: z.array(z.string()),
  data: z.object({
    speed_v85: z.array(z.number()),
    speed_histogram_opacity: z.array(z.number()),
  }),
});

export const measurements24HourChartV85GetRoute = getSegmentTimeRange({
  path: '/measurements-24-hour-chart-v85',
  schema: measurements24HourChartV85Schema,
});

import {
  measurements24HourChartDirectionSchema,
  measurements24HourChartV85Schema,
  measurementsSpeedSchema,
} from 'telraam-js';
import { z } from 'zod';

import { ParametrizedDataFile } from './ParametrizedDataFile';

export const dailyFileSchema = z.object({
  measurements24HourChartDirection: measurements24HourChartDirectionSchema.shape.data,
  measurementsSpeed: measurementsSpeedSchema.shape.data,
  measurements24HourChartV85: measurements24HourChartV85Schema.shape.data,
});

export type DailyFile = z.infer<typeof dailyFileSchema>;

export const dailyDataFile: ParametrizedDataFile<{ segmentId: number; day: string }, DailyFile> = ({
  segmentId,
  day,
}) => ({
  path: `${segmentId}/${day}.json`,
  type: dailyFileSchema,
});

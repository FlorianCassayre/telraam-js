import { useQuery } from '@tanstack/react-query';
import {
  measurements24HourChartDirectionSchema,
  measurements24HourChartV85Schema,
  measurementsSpeedSchema,
} from 'telraam-js';
import { z } from 'zod';

interface TelraamDayData {
  measurements24HourChartDirection: z.infer<typeof measurements24HourChartDirectionSchema>['data'];
  measurementsSpeed: z.infer<typeof measurementsSpeedSchema>['data'];
  measurements24HourChartV85: z.infer<typeof measurements24HourChartV85Schema>['data'];
}

export const useTelraamDayData = (date: string) =>
  useQuery({
    queryKey: ['telraam', date],
    queryFn: () => fetch(`/data/${date}.json`).then<TelraamDayData>((r) => r.json()),
  });

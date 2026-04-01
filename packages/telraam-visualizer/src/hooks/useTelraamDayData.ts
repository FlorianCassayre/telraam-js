import { useQuery } from '@tanstack/react-query';
import { measurements24HourChartDirectionSchema } from 'telraam-js/src/schema/measurements24HourChartDirection';
import { measurements24HourChartV85Schema } from 'telraam-js/src/schema/measurements24HourChartV85';
import { measurementsSpeedSchema } from 'telraam-js/src/schema/measurementsSpeed';
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

import fs from 'node:fs/promises';
import path from 'node:path';

import { measurements24HourChartDirectionSchema, segmentSchema, telraamApi } from 'telraam-js';
import { z } from 'zod';

import { dailyDataFile, DailyFile, dailyFileSchema } from './DailyFile';
import { writeDataFile } from './ParametrizedDataFile';

const getTemporalData = (payload: { params: { id: number; from: string; to: string } }) =>
  Promise.all([
    telraamApi.getMeasurements24HourChartDirection(payload),
    telraamApi.getMeasurementsSpeed(payload),
    telraamApi.getMeasurements24HourChartV85(payload),
  ] as const).then(([measurements24HourChartDirection, measurementsSpeed, measurements24HourChartV85]) => ({
    measurements24HourChartDirection,
    measurementsSpeed,
    measurements24HourChartV85,
  }));

type Config = {
  outputPath: string;
  segmentIds: number[];
};

const formatDate = (d: Date): string => d.toISOString().split('T')[0];

const parseDate = (s: string): Date => new Date(s);

const addDaysStr = (date: string, days: number): string => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const fileExists = async (p: string): Promise<boolean> => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const extractRange = (segment: z.infer<typeof segmentSchema>) => {
  const props = segment.features[0].properties;
  const extractDate = (s: string) => s.split('T')[0];
  return {
    from: extractDate(props.first_data_package),
    to: extractDate(props.last_data_package),
  };
};

export const run = async ({ outputPath, segmentIds }: Config) => {
  for (const segmentId of segmentIds) {
    console.log(`Fetching segment ${segmentId}...`);

    // 1. Fetch segment info
    const segmentRaw = await telraamApi.getSegment({
      params: { id: segmentId },
    });

    const segment = segmentSchema.parse(segmentRaw);

    const { from, to } = extractRange(segment);

    const fromDate = formatDate(parseDate(from));
    const toDate = formatDate(parseDate(to));

    // 2 & 3. Find first missing date by peeking sequentially
    let current = fromDate;
    let firstMissing: string = toDate; // By default, the last date

    while (current <= toDate) {
      const dataFile = dailyDataFile({ segmentId, day: current });

      const expectedPath = path.join(outputPath, dataFile.path);
      if (!(await fileExists(expectedPath))) {
        firstMissing = current;
        break;
      }
      current = addDaysStr(current, 1);
    }

    // 4. Start one day before (in case the previous day had partial data)
    let start = addDaysStr(firstMissing, -1);
    if (start < fromDate) {
      start = fromDate;
    }

    console.log(`Sync from ${start} -> ${to}`);

    // 5. Sequential processing
    let day = start;

    while (day <= toDate) {
      const payload = {
        params: {
          id: segmentId,
          from: day,
          to: day,
        },
      };

      console.log(`Fetching date ${day}...`);
      const result = await getTemporalData(payload);

      const normalized = {
        measurements24HourChartDirection: !Array.isArray(result.measurements24HourChartDirection.data)
          ? result.measurements24HourChartDirection.data
          : (Object.fromEntries(
              Object.keys(measurements24HourChartDirectionSchema.shape.data.options[0].shape).map((k) => [
                k,
                Array.from({ length: 24 }, () => 0),
              ]),
            ) as z.infer<typeof dailyFileSchema>['measurements24HourChartDirection']),
        measurementsSpeed: result.measurementsSpeed.data,
        measurements24HourChartV85: result.measurements24HourChartV85.data,
      } satisfies DailyFile;

      const changed = writeDataFile(outputPath, dailyDataFile({ segmentId, day }), normalized);

      if (changed) {
        console.log(`${segmentId}/${day}: saved`);
      } else {
        console.log(`${segmentId}/${day}: unchanged`);
      }

      day = addDaysStr(day, 1);
    }
  }
};

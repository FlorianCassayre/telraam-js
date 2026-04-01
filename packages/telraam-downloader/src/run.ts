import fs from 'node:fs/promises';
import path from 'node:path';

import { segmentSchema } from 'telraam-js/src/schema/segment';
import { telraamApi } from 'telraam-js/src/telraamApi';
import { z } from 'zod';

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

const readExistingDates = async (dir: string): Promise<Set<string>> => {
  try {
    const files = await fs.readdir(dir);
    return new Set(files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')));
  } catch {
    return new Set();
  }
};

const writeJson = async (filePath: string, data: unknown) => {
  await fs.writeFile(filePath, JSON.stringify(data));
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
    const segmentDir = path.join(outputPath, String(segmentId));
    await fs.mkdir(segmentDir, { recursive: true });

    console.log(`Fetching segment ${segmentId}...`);

    // 1. Fetch segment info
    const segmentRaw = await telraamApi.getSegment({
      params: { id: segmentId },
    });

    const segment = segmentSchema.parse(segmentRaw);

    const { from, to } = extractRange(segment);

    const fromDate = formatDate(parseDate(from));
    const toDate = formatDate(parseDate(to));

    // 2. Read existing files
    const existingDates = await readExistingDates(segmentDir);

    // 3. Find first missing date
    let current = fromDate;
    let firstMissing: string | null = null;

    while (current <= toDate) {
      const key = current;
      if (!existingDates.has(key)) {
        firstMissing = current;
        break;
      }
      current = addDaysStr(current, 1);
    }

    if (!firstMissing) {
      console.log('Nothing to sync');
      continue;
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
      const filePath = path.join(segmentDir, `${day}.json`);

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
        measurements24HourChartDirection: result.measurements24HourChartDirection.data,
        measurementsSpeed: result.measurementsSpeed.data,
        measurements24HourChartV85: result.measurements24HourChartV85.data,
      };

      let changed = true;

      if (await fileExists(filePath)) {
        const existing = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        changed = JSON.stringify(existing) !== JSON.stringify(normalized);
      }

      if (changed) {
        await writeJson(filePath, normalized);
        console.log(`${segmentId}/${day}: saved`);
      } else {
        console.log(`${segmentId}/${day}: unchanged`);
      }

      day = addDaysStr(day, 1);
    }
  }
};

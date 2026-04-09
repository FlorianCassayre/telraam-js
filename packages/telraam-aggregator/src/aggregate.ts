import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { DailyFile, writeDataFile } from 'telraam-downloader';
import { z } from 'zod';

import { aggregatedSchema } from './aggregatedSchema';
import { AggregationConfig, flattenAggregationConfig } from './AggregationConfig';
import { getAggregationDataFile, getAggregationMetaDataFile } from './AggregationDataFile';
import { getAggregationKey } from './AggregationTime';
import { concatenateAggregations, mergeAggregations } from './merge';
import { groupReduce, sortValues, stringIntegerSchema } from './utils';

const pickIndex = <T extends Record<string, readonly unknown[]>>(obj: T, index: number): T => {
  const result = {} as T;

  for (const key in obj) {
    result[key] = [obj[key][index]] as unknown as T[typeof key];
  }

  return result;
};

const getHours = () => {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i.toString().padStart(2, '0'));
  }
  return hours;
};

const dailyFileToHourly = (dailyFile: DailyFile) =>
  getHours().map((hour, i) => {
    const object = {
      measurements24HourChartDirection: pickIndex(dailyFile.measurements24HourChartDirection, i),
      //measurementsSpeed: dailyFile.measurementsSpeed, // TODO
      measurements24HourChartV85: pickIndex(dailyFile.measurements24HourChartV85, i),
    } satisfies z.infer<typeof aggregatedSchema>['data'];
    return [hour, object] as const;
  });

interface Params {
  inputPath: string;
  outputPath: string;
  config: AggregationConfig;
}

const aggregateSegment = ({
  inputPath,
  outputPath,
  config,
  segmentId,
}: Params & {
  segmentId: number;
}) => {
  const segmentInputPath = join(inputPath, String(segmentId)); // TODO

  const files = readdirSync(segmentInputPath, { withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => f.name);
  // TODO verify name

  const contents = files.map(
    (name) =>
      [
        name.replace(/\.json$/, ''),
        JSON.parse(readFileSync(join(segmentInputPath, name), 'utf-8')) as DailyFile,
      ] as const,
  );

  flattenAggregationConfig(config).forEach(({ range, step }) => {
    const keyedData = contents
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, content]) => content.measurements24HourChartDirection.bike_lft.length === 24)
      .flatMap(([filename, content]) =>
        dailyFileToHourly(content).map(([time, hourlyFile]) => ({
          range: getAggregationKey(filename, time, range),
          step: getAggregationKey(filename, time, step),
          data: hourlyFile,
        })),
      );
    const reducedFiles = groupReduce(
      keyedData,
      (o) => o.range,
      (data) => {
        const byStep = groupReduce(
          data,
          (o) => o.step,
          (data) => mergeAggregations(data.map((o) => o.data)),
        );
        const [stepLabels, steppedData] = sortValues(byStep);
        return {
          labels: stepLabels,
          data: concatenateAggregations(steppedData),
        } satisfies z.infer<typeof aggregatedSchema>;
      },
    );

    Object.entries(reducedFiles).forEach(([rangeKey, contents]) => {
      const dataFile = getAggregationDataFile()({ segmentId, range, step, key: rangeKey });

      if (writeDataFile(outputPath, dataFile, contents)) {
        console.log(`Wrote: ${dataFile.path}`);
      }
    });

    const metaDataFile = getAggregationMetaDataFile()({ segmentId, range, step });
    if (writeDataFile(outputPath, metaDataFile, { keys: Object.keys(reducedFiles) })) {
      console.log(`Wrote: ${metaDataFile.path}`);
    }
  });
};

export const aggregate = ({ inputPath, outputPath, config }: Params) => {
  if (!existsSync(inputPath) || !statSync(inputPath).isDirectory()) {
    console.error(`Invalid inputPath: ${inputPath} is not a directory`);
    return;
  }

  mkdirSync(dirname(outputPath), { recursive: true });

  const segments = readdirSync(inputPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .map((name) => stringIntegerSchema.parse(name));

  segments.forEach((segmentId) => aggregateSegment({ inputPath, outputPath, config, segmentId }));
};

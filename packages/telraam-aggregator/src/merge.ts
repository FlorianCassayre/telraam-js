import { z } from 'zod';

import { aggregatedSchema } from './aggregatedSchema';

type Aggregation = z.infer<typeof aggregatedSchema>['data'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mergeWithAggregation = <T extends Record<string, any>>(
  items: T[],
  aggregate: (values: number[], key: keyof T) => number,
): T => {
  if (items.length === 0) {
    throw new Error();
  }

  const result: T = { ...items[0] };

  const keys = Object.keys(items[0]) as (keyof T)[];

  for (const key of keys) {
    const firstValue = items[0][key];

    if (Array.isArray(firstValue) && typeof firstValue[0] === 'number') {
      const length = firstValue.length;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = Array.from({ length }, (_, i) => {
        const valuesAtIndex = items.map((item) => {
          const arr = item[key] as number[];
          if (arr.length !== length) {
            throw new Error();
          }
          arr.forEach((value) => {
            if (Number.isNaN(value)) {
              throw new Error();
            }
          });
          return arr[i];
        });

        const value = aggregate(valuesAtIndex, key);
        if (Number.isNaN(value)) {
          throw new Error();
        }
        return value;
      });
    }
  }

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const concatenateWithAggregations = <T extends Record<string, any>>(items: T[]): T => {
  if (items.length === 0) {
    throw new Error();
  }

  const result: T = { ...items[0] };
  const keys = Object.keys(items[0]) as (keyof T)[];

  for (const key of keys) {
    const firstValue = items[0][key];

    if (Array.isArray(firstValue)) {
      // Concatenate arrays for this key
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = ([] as any[]).concat(
        ...items.map((item) => {
          const arr = item[key];
          if (!Array.isArray(arr)) {
            throw new Error(`Expected array for key "${String(key)}"`);
          }
          return arr;
        }),
      );
    } else {
      // For non-array fields, just take the first one
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = firstValue;
    }
  }

  return result;
};

/*const speeds = {
  zero: null,
  ten: null,
  twenty: null,
  thirty: null,
  fourty: null,
  fifty: null,
  sixty: null,
  seventy: null,
  totalTraffic: null,
} satisfies Omit<{ [K in keyof Aggregation['measurementsSpeed'] as
  Aggregation['measurementsSpeed'][K] extends number[] ? K : never]: number }, 'total'>;*/

export const mergeAggregations = (aggregations: Aggregation[]): Aggregation => {
  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  return {
    measurements24HourChartDirection: mergeWithAggregation(
      aggregations.map((o) => o.measurements24HourChartDirection),
      sum,
    ),
    //measurementsSpeed: aggregations[0].measurementsSpeed, // TODO FIXME
    measurements24HourChartV85: mergeWithAggregation(
      aggregations.map((o) => o.measurements24HourChartV85),
      sum,
    ),
  };
};

export const concatenateAggregations = (aggregations: Aggregation[]): Aggregation => {
  return {
    measurements24HourChartDirection: concatenateWithAggregations(
      aggregations.map((o) => o.measurements24HourChartDirection),
    ),
    // TODO
    measurements24HourChartV85: concatenateWithAggregations(aggregations.map((o) => o.measurements24HourChartV85)),
  };
};

import { z } from 'zod';

export const groupReduce = <T, V>(
  items: readonly T[],
  getKey: (item: T) => string,
  reducer: (elements: T[]) => V,
): Record<string, V> => {
  const groups = {} as Record<string, T[]>;

  for (const item of items) {
    const key = getKey(item);
    if (!(key in groups)) {
      groups[key] = [];
    }
    groups[key].push(item);
  }

  const result = {} as Record<string, V>;
  for (const key in groups) {
    result[key] = reducer(groups[key]);
  }

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unzip = <T extends any[]>(arr: T[]): { [K in keyof T]: T[K][] } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (arr.length === 0) return [] as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = Array.from({ length: arr[0].length }, () => []);
  for (const tuple of arr) {
    tuple.forEach((item, index) => {
      result[index].push(item);
    });
  }
  return result as { [K in keyof T]: T[K][] };
};

export const sortValues = <T>(record: Record<string, T>): [string[], T[]] =>
  unzip(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));

export const stringIntegerSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }
  return val;
}, z.number().int());

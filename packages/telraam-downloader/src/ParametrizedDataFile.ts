import { existsSync } from 'fs';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { z } from 'zod';

export type ParametrizedDataFile<In, Out extends object> = (parameters: In) => DataFile<Out>;

export interface DataFile<Out extends object> {
  path: string;
  type: z.ZodType<Out>;
}

const writeJsonSync = (filePath: string, data: unknown) => writeFileSync(filePath, JSON.stringify(data));

export const writeDataFile = <Out extends object>(
  parentPath: string,
  { path: relativePath, type }: DataFile<Out>,
  data: Out,
): boolean => {
  type.parse(data);

  const fullPath = join(parentPath, relativePath);

  if (existsSync(fullPath)) {
    const existing = JSON.parse(readFileSync(fullPath, 'utf-8'));
    const isUnchanged = JSON.stringify(existing) === JSON.stringify(data);

    if (isUnchanged) {
      return false;
    }
  }

  mkdirSync(dirname(fullPath), { recursive: true });
  writeJsonSync(fullPath, data);

  return true; // File was updated
};

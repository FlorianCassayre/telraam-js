import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { ZodObject, ZodType } from 'zod';

import { z } from '../z';

interface GetParameters {
  path: string;
  params: ZodObject;
  schema: ZodType;
}

export const get = ({ path, params, schema }: GetParameters): RouteConfig => ({
  method: 'get',
  path,
  request: {
    params,
  },
  responses: {
    200: {
      description: 'Response',
      content: {
        'application/json': {
          schema,
        },
      },
    },
  },
});

const dateIso = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
  .refine((str) => {
    const [y, m, d] = str.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  }, 'Invalid calendar date');

export const getSegmentTimeRange = ({ path, ...rest }: Omit<GetParameters, 'params'>): RouteConfig =>
  get({
    path: `${path}/segments/{id}/{from}/{to}`,
    params: z.object({ id: z.int(), from: dateIso, to: dateIso }),
    ...rest,
  });

import { makeEndpoint } from '@zodios/core';
import { z } from 'zod';

import { idSchema } from './common';

export const segmentSchema = z.object({
  status_code: z.number(),
  message: z.string(),
  type: z.string(),
  features: z.array(
    z.object({
      type: z.string(),
      geometry: z.object({
        type: z.string(),
        coordinates: z.array(z.array(z.array(z.number()))),
      }),
      properties: z.object({
        oidn: z.number(),
        first_data_package: z.string(),
        last_data_package: z.string(),
        timezone: z.string(),
        instance_ids: z.object({
          10671: z.object({
            mac: z.number(),
            manual: z.boolean(),
            status: z.string(),
            private: z.boolean(),
            user_id: z.number(),
            time_end: z.null(),
            cars_left: z.boolean(),
            direction: z.boolean(),
            bikes_left: z.boolean(),
            cars_right: z.boolean(),
            time_added: z.string(),
            bikes_right: z.boolean(),
            status_detailed: z.string(),
            hardware_version: z.number(),
            pedestrians_left: z.boolean(),
            last_data_package: z.string(),
            pedestrians_right: z.boolean(),
            first_data_package: z.string(),
            is_calibration_done: z.string(),
          }),
        }),
      }),
    }),
  ),
});

export const segmentGetRoute = makeEndpoint({
  method: 'get',
  path: '/segments/id/:id',
  alias: 'getSegment',
  parameters: [{ name: 'id', type: 'Path', schema: idSchema }] as const,
  response: segmentSchema,
});

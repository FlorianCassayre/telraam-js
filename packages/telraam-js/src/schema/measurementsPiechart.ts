import { z } from 'zod';

import { getSegmentTimeRange } from './common';

export const measurementsPiechartSchema = z.object({
  pedestrian: z.number(),
  bike: z.number(),
  car: z.number(),
  heavy: z.number(),
  night: z.number(),
  mode_bicycle: z.number(),
  mode_motorcycle: z.number(),
  mode_bus: z.number(),
  mode_car: z.number(),
  mode_lighttruck: z.number(),
  mode_pedestrian: z.number(),
  mode_stroller: z.number(),
  mode_tractor: z.number(),
  mode_trailer: z.number(),
  mode_truck: z.number(),
  total10modes: z.number(),
  pedestrianPerc: z.string(),
  bikePerc: z.string(),
  carPerc: z.string(),
  heavyPerc: z.string(),
  pedestrianPercWNight: z.string(),
  bikePercWNight: z.string(),
  carPercWNight: z.string(),
  heavyPercWNight: z.string(),
  nightPercWNight: z.string(),
  piedata: z.array(z.number()),
  piedatanight: z.array(z.number()),
  piedata10modes: z.array(z.number()),
});

export const measurementsPiechartGetRoute = getSegmentTimeRange({
  path: '/measurements-piechart',
  schema: measurementsPiechartSchema,
});

import { makeEndpoint } from '@zodios/core';
import { z } from 'zod';

import { dateIso, idSchema } from './common';

export const measurementsDayBarchartSchema = z.object({
  labels: z.array(z.string()),
  dates: z.array(z.string()),
  data: z.object({
    pedestrian: z.array(z.number()),
    bike: z.array(z.number()),
    car: z.array(z.number()),
    heavy: z.array(z.number()),
    night: z.array(z.number()),
    mode_bicycle: z.array(z.number()),
    mode_bus: z.array(z.number()),
    mode_car: z.array(z.number()),
    mode_lighttruck: z.array(z.number()),
    mode_motorcycle: z.array(z.number()),
    mode_pedestrian: z.array(z.number()),
    mode_stroller: z.array(z.number()),
    mode_tractor: z.array(z.number()),
    mode_trailer: z.array(z.number()),
    mode_truck: z.array(z.number()),
    pedestrianAvg: z.array(z.number()),
    bikeAvg: z.array(z.number()),
    carAvg: z.array(z.number()),
    heavyAvg: z.array(z.number()),
    pedestrianPctOfTypical: z.array(z.number()),
    bikePctOfTypical: z.array(z.number()),
    carPctOfTypical: z.array(z.number()),
    heavyPctOfTypical: z.array(z.number()),
    speedZero: z.array(z.number()),
    speedTen: z.array(z.number()),
    speedTwenty: z.array(z.number()),
    speedThirty: z.array(z.number()),
    speedFourty: z.array(z.number()),
    speedFifty: z.array(z.number()),
    speedSixty: z.array(z.number()),
    speedSeventy: z.array(z.number()),
    speedZeroDelta: z.array(z.number()),
    speedTenDelta: z.array(z.number()),
    speedTwentyDelta: z.array(z.number()),
    speedThirtyDelta: z.array(z.number()),
    speedFourtyDelta: z.array(z.number()),
    speedFiftyDelta: z.array(z.number()),
    speedSixtyDelta: z.array(z.number()),
    speedSeventyDelta: z.array(z.number()),
  }),
});

export const measurementsDayBarchartGetRoute = makeEndpoint({
  method: 'get',
  path: '/measurements-day-barchart/segments/:id/:from/:to',
  alias: 'getMeasurementsDayBarchart',
  parameters: [
    { name: 'id', type: 'Path', schema: idSchema },
    { name: 'from', type: 'Path', schema: dateIso },
    { name: 'to', type: 'Path', schema: dateIso },
  ],
  response: measurementsDayBarchartSchema,
});

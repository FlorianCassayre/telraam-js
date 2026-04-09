import { measurements24HourChartDirectionSchema, measurements24HourChartV85Schema } from 'telraam-js';
import { z, ZodRawShape, ZodTypeAny } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arrayifySchema = <T extends ZodRawShape>(schema: z.ZodObject<T>) => {
  const newShape = Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => [key, z.array(value as ZodTypeAny)]),
  ) as {
    [K in keyof T]: z.ZodArray<T[K]>;
  };
  return z.object(newShape);
};

export const aggregatedSchema = z.object({
  labels: z.array(z.string()),
  data: z.object({
    measurements24HourChartDirection: measurements24HourChartDirectionSchema.shape.data,
    //measurementsSpeed: arrayifySchema(measurementsSpeedSchema.shape.data),
    measurements24HourChartV85: measurements24HourChartV85Schema.shape.data,
  }),
});

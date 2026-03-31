import { Zodios } from '@zodios/core';

import { measurements24HourChartGetRoute } from './schema/measurements24HourChart';
import { measurements24HourChartDirectionGetRoute } from './schema/measurements24HourChartDirection';
import { measurements24HourChartV85GetRoute } from './schema/measurements24HourChartV85';
import { measurementsDayBarchartGetRoute } from './schema/measurementsDayBarchart';
import { measurementsHourBarchartPctUpGetRoute } from './schema/measurementsHourBarchartPctUp';
import { measurementsPiechartGetRoute } from './schema/measurementsPiechart';
import { measurementsSpeedGetRoute } from './schema/measurementsSpeed';
import { segmentGetRoute } from './schema/segment';

export const telraamApi = new Zodios('https://telraam.net/api', [
  measurements24HourChartGetRoute,
  measurements24HourChartDirectionGetRoute,
  measurements24HourChartV85GetRoute,
  measurementsDayBarchartGetRoute,
  measurementsHourBarchartPctUpGetRoute,
  measurementsPiechartGetRoute,
  measurementsSpeedGetRoute,
  segmentGetRoute,
] as const);

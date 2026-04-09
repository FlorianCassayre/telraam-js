import { LineChart } from '@mui/x-charts';
import React from 'react';
import { AggregationTimeType, getAggregationDataFile } from 'telraam-aggregator';

import { useTelraamData } from '../hooks/useTelraamData';

export const TelraamStackedLinesChart = () => {
  const { data: result } = useTelraamData(
    getAggregationDataFile()({
      segmentId: 9000007982,
      range: AggregationTimeType.All,
      step: AggregationTimeType.Week,
      key: AggregationTimeType.All,
    }),
  );

  if (!result) {
    return null;
  }

  const data = result.data.measurements24HourChartDirection;

  type Aggregated = Record<string, number[]>;

  const aggregateByTransport = (input: typeof data): Aggregated => {
    const result: Aggregated = {};
    Object.entries(input).forEach(([key, arr]) => {
      const transport = key.split('_')[0];
      if (!result[transport]) {
        result[transport] = Array(arr.length).fill(0);
      }
      result[transport] = result[transport].map((v, i) => v + arr[i]);
    });
    return result;
  };

  const aggregated = aggregateByTransport(data);

  const dataset = aggregated[Object.keys(aggregated)[0]].map((_, i) => {
    const row: Record<string, number | string> = { index: i }; // x-axis key
    Object.entries(aggregated).forEach(([key, values]) => {
      row[key] = values[i];
    });
    return row;
  });

  const keyToLabel: Record<string, string> = {
    pedestrian: 'Pedestrian',
    bike: 'Bicycle',
    car: 'Car',
    heavy: 'Heavy Vehicle',
    //night: 'Night Traffic',
  };

  const colors: Record<string, string> = {
    pedestrian: '#1976d2',
    bike: '#388e3c',
    car: '#f57c00',
    heavy: '#d32f2f',
    //night: '#7b1fa2',
  };

  return (
    <LineChart
      xAxis={[{ dataKey: 'index', valueFormatter: (v: number) => `T${v + 1}` }]}
      yAxis={[{ width: 50 }]}
      series={Object.keys(keyToLabel).map((key) => ({
        dataKey: key,
        label: keyToLabel[key],
        color: colors[key],
        //showPoints: false,
        area: true,
        showMark: false,
        stack: 'total',
      }))}
      dataset={dataset}
      height={400}
      width={600}
    />
  );
};

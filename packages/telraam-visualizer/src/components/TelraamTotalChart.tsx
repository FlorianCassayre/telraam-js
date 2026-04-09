import { Box } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts';
import React, { useMemo } from 'react';
import { AggregationTimeType, getAggregationDataFile } from 'telraam-aggregator';

import { useTelraamData } from '../hooks/useTelraamData';

export const TelraamTotalChart = () => {
  const { data: totalData } = useTelraamData(
    getAggregationDataFile()({
      segmentId: 9000007982,
      range: AggregationTimeType.All,
      step: AggregationTimeType.Week,
      key: AggregationTimeType.All,
    }),
  );

  const total = useMemo(() => {
    if (!totalData) {
      return null;
    }
    const direction = totalData.data.measurements24HourChartDirection;
    const arrays = [direction.bike_lft, direction.bike_rgt];
    const result: number[] = [];
    for (let i = 1; i < arrays[0].length - 1; i++) {
      // Skip the first and last, which are possibly biased
      result.push(arrays.map((a) => a[i]).reduce((a, b) => a + b, 0));
    }
    return result;
  }, [totalData]);

  if (!total) {
    return null;
  }

  return (
    <Box sx={{ width: '300px' }}>
      <SparkLineChart data={total} height={100} />
    </Box>
  );
};

import { Box } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { AggregationTimeType, getAggregationDataFile, getAggregationMetaDataFile } from 'telraam-aggregator';

import { useTelraamData } from '../hooks/useTelraamData';

const generateHourLabels = () =>
  Array.from({ length: 24 }, (_, i) => {
    const start = `${String(i).padStart(2, '0')}:00`;
    const end = `${String(i).padStart(2, '0')}:59`;
    return `${start} - ${end}`;
  });

const hourLabels = generateHourLabels();

const aggregationParameters = {
  segmentId: 9000007982,
  range: AggregationTimeType.Day,
  step: AggregationTimeType.Hour,
};

const DATE_FORMAT = 'YYYY-MM-DD';

interface TelraamDayDashboardContentProps {
  dates: string[];
}

export const TelraamDayDashboardContent: React.FC<TelraamDayDashboardContentProps> = ({ dates }) => {
  const [date, setDate] = useState<Dayjs | null>(dates.length > 0 ? dayjs(dates[dates.length - 1]) : null);

  const formattedDate = date ? date.format(DATE_FORMAT) : '';
  const { data: response, isLoading } = useTelraamData(
    getAggregationDataFile()({
      ...aggregationParameters,
      key: formattedDate,
    }),
  );

  if (isLoading || !response) return <div>Loading...</div>;

  const { data } = response;

  const dir = data.measurements24HourChartDirection;
  const v85 = data.measurements24HourChartV85;

  return (
    <Box p={2} display="flex" flexDirection="column" gap={4}>
      <DatePicker
        label="Select day"
        value={date}
        onChange={(newValue) => setDate(newValue)}
        format={DATE_FORMAT}
        shouldDisableDate={(day) => !data || !dates.includes(day.format(DATE_FORMAT))}
        slotProps={{ textField: { sx: { maxWidth: 200 } } }}
      />
      {/* All vehicle types */}
      <LineChart
        height={300}
        xAxis={[{ data: hourLabels, scaleType: 'point' }]}
        series={[
          { data: dir.pedestrian_rgt, label: 'Pedestrians →' },
          { data: dir.pedestrian_lft, label: 'Pedestrians ←' },
          { data: dir.bike_rgt, label: 'Bikes →' },
          { data: dir.bike_lft, label: 'Bikes ←' },
          { data: dir.car_rgt, label: 'Cars →' },
          { data: dir.car_lft, label: 'Cars ←' },
          { data: dir.heavy_rgt, label: 'Heavy →' },
          { data: dir.heavy_lft, label: 'Heavy ←' },
        ]}
      />

      {/* V85 as bar chart */}
      <BarChart
        height={300}
        xAxis={[{ data: hourLabels, scaleType: 'band' }]}
        series={[{ data: v85.speed_v85, label: 'V85 Speed' }]}
      />
    </Box>
  );
};

export const TelraamDayDashboard: React.FC = () => {
  const { data } = useTelraamData(getAggregationMetaDataFile()(aggregationParameters));

  return !!data ? <TelraamDayDashboardContent dates={data.keys} /> : null;
};

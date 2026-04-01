import { Box } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';

import { useTelraamDayData } from '../hooks/useTelraamDayData';

const generateHourLabels = () =>
  Array.from({ length: 24 }, (_, i) => {
    const start = `${String(i).padStart(2, '0')}:00`;
    const end = `${String(i).padStart(2, '0')}:59`;
    return `${start} - ${end}`;
  });

const generateSpeedLabels = (step: number, max: number) => {
  const labels: string[] = [];
  for (let i = 0; i < max; i += step) {
    labels.push(`${i}-${i + step}`);
  }
  labels.push(`${max}+`);
  return labels;
};

const hourLabels = generateHourLabels();
const speedLabels = generateSpeedLabels(10, 70);

export const TelraamDayDashboard: React.FC = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs('2026-03-31'));

  const formattedDate = date ? date.format('YYYY-MM-DD') : '';
  const { data, isLoading } = useTelraamDayData(formattedDate);

  if (isLoading || !data) return <div>Loading...</div>;

  const dir = data.measurements24HourChartDirection;
  const speed = data.measurementsSpeed;
  const v85 = data.measurements24HourChartV85;

  const speedPercValues = [
    speed.zeroPerc,
    speed.tenPerc,
    speed.twentyPerc,
    speed.thirtyPerc,
    speed.fourtyPerc,
    speed.fiftyPerc,
    speed.sixtyPerc,
    speed.seventyPerc,
  ].map((r) => (r !== undefined ? parseFloat(r) : 0));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={2} display="flex" flexDirection="column" gap={4}>
        <DatePicker
          label="Select day"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          format="YYYY-MM-DD"
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

        {/* Speed distribution (percentages) */}
        <BarChart
          height={300}
          xAxis={[{ scaleType: 'band', data: speedLabels }]}
          series={[
            {
              data: speedPercValues,
              label: 'Speed distribution (%)',
            },
          ]}
        />
      </Box>
    </LocalizationProvider>
  );
};

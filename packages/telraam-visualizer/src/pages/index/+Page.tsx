import React from 'react';

import { TelraamDayDashboard } from '../../components/TelraamDayDashboard';
import { TelraamStackedLinesChart } from '../../components/TelraamStackedLinesChart';
import { TelraamTotalChart } from '../../components/TelraamTotalChart';

export const Page: React.FC = () => (
  <div>
    <TelraamStackedLinesChart />
    <TelraamDayDashboard />
    <TelraamTotalChart />
  </div>
);

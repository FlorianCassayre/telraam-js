export enum AggregationTimeType {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  All = 'all',
}

export const getAggregationKey = (date: string, hour: string, type: AggregationTimeType): string => {
  switch (type) {
    case AggregationTimeType.Hour:
      return `${date}T${hour}`;
    case AggregationTimeType.Day:
      return date;
    case AggregationTimeType.Week:
      const d = new Date(date + 'T00:00:00Z');
      const day = d.getUTCDay();
      d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
      return d.toISOString().split('T')[0];
    case AggregationTimeType.Month:
      return date.split('-').slice(0, 2).join('-');
    case AggregationTimeType.Year:
      return date.split('-')[0];
    case AggregationTimeType.All:
      return 'all';
  }
};

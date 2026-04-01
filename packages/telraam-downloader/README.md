telraam-downloader
===

## Usage

```shell
pnpm download <path> <segment_id_1> [...segment_id_i]
```

## Endpoints

The following endpoint expose temporal data, aggregated in different ways:

| Endpoint                           | Remarks                                                                                   | Non-overlapping    |
|------------------------------------|-------------------------------------------------------------------------------------------|--------------------|
| `measurementsDayBarchart`          | An aggregated version of `measurementsHourBarchartPctUp`                                  | :x:                |
| `measurementsHourBarchartPctUp`    | An efficient version of `measurements24HourChartDirection` if you don't need th direction | :x:                |
| `measurements24HourChart`          | An aggregated version of `measurementsHourBarchartPctUp`                                  | :x:                |
| `measurementsSpeed`                | Provides the speed distribution, requires one call per day                                | :white_check_mark: |
| `measurements24HourChartV85`       | Provides the 85% CI of the speed distribution, requires one call per day                  | :white_check_mark: |
| `measurements24HourChartDirection` | The most detailed, requires one call per day                                              | :white_check_mark: |
| `measurementsPiechart`             | An aggregated version of `measurementsHourBarchartPctUp`                                  | :x:                |

Ultimately, only three of them provide non-overlapping data, but require making one call per desired day.

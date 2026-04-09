import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { DataFile } from 'telraam-downloader';

const ROOT_PATH = 'data';

export const useTelraamData = <Out extends object>(
  dataFile: DataFile<Out>,
  queryOptions?: Omit<UseQueryOptions<Out>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<Out>({
    queryKey: [dataFile.path, dataFile],
    queryFn: () =>
      fetch(`${ROOT_PATH}/${dataFile.path}`)
        .then((r) => r.json())
        .then((r) => dataFile.type.parse(r)),
    ...queryOptions,
  });

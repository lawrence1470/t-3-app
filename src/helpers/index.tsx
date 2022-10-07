import { UseQueryResult } from 'react-query/types/react/types';

import {QueryClient, QueryClientProvider, QueryObserverSuccessResult, useQuery} from 'react-query';

export const isFetchedWithSuccess = <TData, TError = unknown>(
  query: UseQueryResult<TData, TError>
): query is QueryObserverSuccessResult<TData, TError> => {
  return !query.isError && !query.isLoading && query.data !== undefined;
};

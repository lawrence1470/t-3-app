import {UseQueryResult} from 'react-query/types/react/types';
import {QueryObserverSuccessResult} from 'react-query';

export const isFetchedWithSuccess = <TData, TError = unknown>(
  query: UseQueryResult<TData, TError>
): query is QueryObserverSuccessResult<TData, TError> => {
  return !query.isError && !query.isLoading && query.data !== undefined;
};

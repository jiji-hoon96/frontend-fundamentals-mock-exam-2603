import { queryOptions } from '@tanstack/react-query';
import { getReservations } from 'pages/remotes';

export const useGetReservationsQuery = (date: string) => {
  return queryOptions({
    queryFn: () => getReservations(date),
    queryKey: ['reservations', date],
  });
};

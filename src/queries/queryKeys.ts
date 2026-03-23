import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getRooms, getReservations, getMyReservations } from 'pages/remotes';

export const roomKeys = createQueryKeys('rooms', {
  list: {
    queryKey: null,
    queryFn: getRooms,
  },
});

export const reservationKeys = createQueryKeys('reservations', {
  list: (date: string) => ({
    queryKey: [date],
    queryFn: () => getReservations(date),
  }),
  my: {
    queryKey: null,
    queryFn: getMyReservations,
  },
});

import { createQueryKeys } from '@lukemorales/query-key-factory';
import * as remotes from 'pages/remotes';

export const roomKeys = createQueryKeys('rooms', {
  list: {
    queryKey: null,
    queryFn: () => remotes.getRooms(),
  },
});

export const reservationKeys = createQueryKeys('reservations', {
  list: (date: string) => ({
    queryKey: [date],
    queryFn: () => remotes.getReservations(date),
  }),
  my: {
    queryKey: null,
    queryFn: () => remotes.getMyReservations(),
  },
});

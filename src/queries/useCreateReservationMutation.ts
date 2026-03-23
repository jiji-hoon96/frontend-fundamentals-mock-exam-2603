import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'pages/remotes';
import { reservationKeys } from './queryKeys';

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys._def });
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'pages/remotes';

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReservation,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });
};

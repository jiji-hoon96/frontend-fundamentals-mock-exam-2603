import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'pages/remotes';

export const useDeleteReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });
};

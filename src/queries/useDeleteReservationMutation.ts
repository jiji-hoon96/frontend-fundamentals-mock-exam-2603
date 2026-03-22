import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelReservation } from "pages/remotes";

const queryClient = useQueryClient();

export const useDeleteReservationMutation = () => {
	return useMutation({
		mutationFn: (id: string) => cancelReservation(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reservations"] });
			queryClient.invalidateQueries({ queryKey: ["myReservations"] });
		},
	});
};

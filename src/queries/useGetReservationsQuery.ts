import { useQuery } from "@tanstack/react-query";
import { getReservations } from "pages/remotes";

export const useGetReservationsQuery = (date: string) => {
	return useQuery({
		queryFn: () => getReservations(date),
		queryKey: ["reservations", date],
		enabled: !!date,
	});
};

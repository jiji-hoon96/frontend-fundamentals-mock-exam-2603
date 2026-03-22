import { queryOptions } from "@tanstack/react-query";
import { getMyReservations } from "pages/remotes";

export const useGetMyReservationQuery = () => {
	return queryOptions({
		queryFn: getMyReservations,
		queryKey: ["myReservations"],
	});
};

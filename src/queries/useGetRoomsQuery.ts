import { queryOptions } from "@tanstack/react-query";
import { getRooms } from "pages/remotes";

export const useGetRoomsQuery = () => {
	return queryOptions({
		queryFn: getRooms,
		queryKey: ["rooms"],
	});
};

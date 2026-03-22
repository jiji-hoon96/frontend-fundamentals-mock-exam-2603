import { http } from "pages/http";

interface GetRoomsResponse {
	id: string;
	name: string;
	floor: number;
	capacity: number;
	equipment: string[];
}

interface GetReservationsResponse {
	id: string;
	roomId: string;
	date: string;
	start: string;
	end: string;
	attendees: number;
	equipment: string[];
}

interface PostReservationRequest {
	roomId: string;
	date: string;
	start: string;
	end: string;
	attendees: number;
	equipment: string[];
}

interface GetMyReservationsResponse {
	id: string;
	roomId: string;
	date: string;
	start: string;
	end: string;
	attendees: number;
	equipment: string[];
}

export function getRooms() {
	return http.get<GetRoomsResponse[]>("/api/rooms");
}

export function getReservations(date: string) {
	return http.get<GetReservationsResponse[]>(`/api/reservations?date=${date}`);
}

export function createReservation(data: PostReservationRequest) {
	return http.post<
		typeof data,
		{ ok: boolean; reservation?: unknown; code?: string; message?: string }
	>("/api/reservations", data);
}

export function getMyReservations() {
	return http.get<GetMyReservationsResponse[]>("/api/my-reservations");
}

export function cancelReservation(id: string) {
	return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}

import { http } from 'pages/http';
import type { Room, Reservation } from 'models/reservation';
import type { Equipment } from 'models/equipment';

interface PostReservationRequest {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}

export function getRooms() {
  return http.get<Room[]>('/api/rooms');
}

export function getReservations(date: string) {
  return http.get<Reservation[]>(`/api/reservations?date=${date}`);
}

export function createReservation(data: PostReservationRequest) {
  return http.post<typeof data, { ok: boolean; reservation?: unknown; code?: string; message?: string }>(
    '/api/reservations',
    data
  );
}

export function getMyReservations() {
  return http.get<Reservation[]>('/api/my-reservations');
}

export function cancelReservation(id: string) {
  return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}

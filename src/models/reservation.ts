import type { Equipment } from "./equipment";

export interface Room {
	id: string;
	name: string;
	floor: number;
	capacity: number;
	equipment: Equipment[];
}

export interface Reservation {
	id: string;
	roomId: string;
	date: string;
	start: string;
	end: string;
	attendees: number;
	equipment: Equipment[];
}

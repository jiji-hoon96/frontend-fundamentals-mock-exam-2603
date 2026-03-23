import { Equipment } from './equipment';
import { Reservation, Room } from './reservation';

const isEnoughCapacity = (room: Room, attendees: number) => room.capacity >= attendees;
const hasRequiredEquipment = (room: Room, equipment: Equipment[]) => equipment.every(eq => room.equipment.includes(eq));
const isOnPreferredFloor = (room: Room, parsedFloor: number | null) =>
  parsedFloor === null || room.floor === parsedFloor;
const hasNoTimeConflict = (room: Room, reservations: Reservation[], date: string, start: string, end: string) =>
  !reservations.some(r => r.roomId === room.id && r.date === date && r.start < end && r.end > start);

interface Params {
  attendees: number;
  equipment: Equipment[];
  floor: number | null;
  date: string;
  startTime: string;
  endTime: string;
}

export function filterAvailableRooms(rooms: Room[], reservations: Reservation[], params: Params): Room[] {
  const { attendees, equipment, floor, date, startTime, endTime } = params;

  return rooms
    .filter(
      room =>
        isEnoughCapacity(room, attendees) &&
        hasRequiredEquipment(room, equipment) &&
        isOnPreferredFloor(room, floor) &&
        hasNoTimeConflict(room, reservations, date, startTime, endTime)
    )
    .sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });
}

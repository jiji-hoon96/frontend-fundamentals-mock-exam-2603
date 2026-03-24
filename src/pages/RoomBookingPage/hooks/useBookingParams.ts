import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALL_EQUIPMENT, type Equipment } from 'models/equipment';
import { formatYYYYMMDD } from 'utils/formatYYYYMMDD';

export interface BookingParams {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: string;
}

export function useBookingParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo<BookingParams>(() => {
    const equipmentRaw = searchParams.get('equipment')?.split(',').filter(Boolean) ?? [];

    return {
      date: searchParams.get('date') || formatYYYYMMDD(new Date()),
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || '',
      attendees: Number(searchParams.get('attendees')) || 1,
      equipment: equipmentRaw.filter(e => ALL_EQUIPMENT.includes(e as Equipment)) as Equipment[],
      preferredFloor: searchParams.get('floor') || '',
    };
  }, [searchParams]);

  const updateParam = useCallback(
    <K extends keyof BookingParams>(key: K, value: BookingParams[K]) => {
      setSearchParams(
        prev => {
          const currentParams = new URLSearchParams(prev);
          const equipmentRaw = currentParams.get('equipment')?.split(',').filter(Boolean) ?? [];

          const merged: BookingParams = {
            date: currentParams.get('date') || formatYYYYMMDD(new Date()),
            startTime: currentParams.get('startTime') || '',
            endTime: currentParams.get('endTime') || '',
            attendees: Number(currentParams.get('attendees')) || 1,
            equipment: equipmentRaw.filter(e => ALL_EQUIPMENT.includes(e as Equipment)) as Equipment[],
            preferredFloor: currentParams.get('floor') || '',
            [key]: value,
          };

          const result: Record<string, string> = {};
          if (merged.date) result.date = merged.date;
          if (merged.startTime) result.startTime = merged.startTime;
          if (merged.endTime) result.endTime = merged.endTime;
          if (merged.attendees > 1) result.attendees = String(merged.attendees);
          if (merged.equipment.length) result.equipment = merged.equipment.join(',');
          if (merged.preferredFloor) result.floor = merged.preferredFloor;

          return result;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return { params, updateParam };
}

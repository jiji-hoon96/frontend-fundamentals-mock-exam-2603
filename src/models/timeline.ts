const TIMELINE_START = 9;
const TIMELINE_END = 20;

const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

export const TIMELINE_HOURS = Array.from(
  { length: TIMELINE_END - TIMELINE_START + 1 },
  (_, i) => `${String(TIMELINE_START + i).padStart(2, '0')}:00`
);

export const TIME_SLOTS = Array.from({ length: (TIMELINE_END - TIMELINE_START) * 2 + 1 }, (_, i) => {
  const hour = TIMELINE_START + Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

export const SELECTABLE_START_TIMES = TIME_SLOTS.slice(0, -1);
export const SELECTABLE_END_TIMES = TIME_SLOTS.slice(1);

function getTimelineOffset(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return (hour - TIMELINE_START) * 60 + minute;
}

export function getTimelinePercent(time: string): number {
  return (getTimelineOffset(time) / TOTAL_MINUTES) * 100;
}

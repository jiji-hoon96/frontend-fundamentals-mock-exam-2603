export const EQUIPMENT_LABELS = {
	tv: "TV",
	whiteboard: "화이트보드",
	video: "화상장비",
	speaker: "스피커",
} as const;

export type Equipment = keyof typeof EQUIPMENT_LABELS;

export const ALL_EQUIPMENT: Equipment[] = Object.keys(EQUIPMENT_LABELS) as Equipment[];

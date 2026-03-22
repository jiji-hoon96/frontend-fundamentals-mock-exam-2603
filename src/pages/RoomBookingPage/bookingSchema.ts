import { z } from 'zod';

export const bookingSchema = z
  .object({
    date: z.string().min(1),
    startTime: z.string(),
    endTime: z.string(),
    attendees: z.number().min(1, '참석 인원은 1명 이상이어야 합니다.'),
    equipment: z.array(z.enum(['tv', 'whiteboard', 'video', 'speaker'])),
    preferredFloor: z.string(),
  })
  .refine(data => !data.startTime || !data.endTime || data.endTime > data.startTime, {
    message: '종료 시간은 시작 시간보다 늦어야 합니다.',
    path: ['endTime'],
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;

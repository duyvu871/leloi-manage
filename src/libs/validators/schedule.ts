import { z } from 'zod';

export const ScheduleSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/, 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng giờ bắt đầu không hợp lệ (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng giờ kết thúc không hợp lệ (HH:MM)'),
  maxAppointments: z.number().int().positive('Số lượng đăng ký tối đa phải lớn hơn 0'),
  currentAppointments: z.number().int().nonnegative().default(0),
  location: z.string().min(1, 'Địa điểm không được để trống'),
  notes: z.string().optional(),
});

export type ScheduleFormValues = z.infer<typeof ScheduleSchema>;
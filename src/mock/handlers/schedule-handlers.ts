import { Schedule, Appointment } from '@type/schedule';
import { mockSchedules } from '../data/schedules';

// Mảng lưu trữ dữ liệu lịch hẹn và đăng ký
let scheduleData = [...mockSchedules];
let appointmentData: Appointment[] = [];

// Hàm lấy danh sách lịch hẹn
export const getSchedules = () => {
  return scheduleData;
};

// Hàm lấy thông tin lịch hẹn theo ID
export const getScheduleById = (id: string) => {
  const schedule = scheduleData.find((s) => s.id === id);
  if (!schedule) {
    throw new Error('Không tìm thấy lịch hẹn');
  }
  return schedule;
};

// Hàm tạo lịch hẹn mới
export const createSchedule = (schedule: Omit<Schedule, 'id' | 'currentAppointments'>) => {
  const newSchedule: Schedule = {
    id: Math.random().toString(36).substr(2, 9),
    currentAppointments: 0,
    ...schedule,
  };
  scheduleData.push(newSchedule);
  return newSchedule;
};

// Hàm cập nhật thông tin lịch hẹn
export const updateSchedule = (id: string, schedule: Partial<Schedule>) => {
  const index = scheduleData.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy lịch hẹn');
  }
  scheduleData[index] = { ...scheduleData[index], ...schedule };
  return scheduleData[index];
};

// Hàm xóa lịch hẹn
export const deleteSchedule = (id: string) => {
  const index = scheduleData.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy lịch hẹn');
  }
  scheduleData = scheduleData.filter((s) => s.id !== id);
  // Xóa tất cả các đăng ký liên quan
  appointmentData = appointmentData.filter((a) => a.scheduleId !== id);
  return true;
};

// Hàm đăng ký lịch hẹn cho học sinh
export const createAppointment = (scheduleId: string, studentId: string) => {
  const schedule = getScheduleById(scheduleId);
  
  // Kiểm tra số lượng đăng ký
  if (schedule.currentAppointments >= schedule.maxAppointments) {
    throw new Error('Lịch hẹn đã đầy');
  }

  // Kiểm tra học sinh đã đăng ký lịch hẹn này chưa
  const existingAppointment = appointmentData.find(
    (a) => a.scheduleId === scheduleId && a.studentId === studentId
  );
  if (existingAppointment) {
    throw new Error('Học sinh đã đăng ký lịch hẹn này');
  }

  const newAppointment: Appointment = {
    id: Math.random().toString(36).substr(2, 9),
    scheduleId,
    studentId,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  appointmentData.push(newAppointment);
  
  // Cập nhật số lượng đăng ký hiện tại
  updateSchedule(scheduleId, {
    currentAppointments: schedule.currentAppointments + 1,
  });

  return newAppointment;
};

// Hàm cập nhật trạng thái đăng ký
export const updateAppointmentStatus = (
  id: string,
  status: Appointment['status']
) => {
  const index = appointmentData.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy đăng ký');
  }

  appointmentData[index] = {
    ...appointmentData[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  return appointmentData[index];
};

// Hàm lấy danh sách đăng ký của một lịch hẹn
export const getScheduleAppointments = (scheduleId: string) => {
  return appointmentData.filter((a) => a.scheduleId === scheduleId);
};

// Hàm lấy danh sách đăng ký của một học sinh
export const getStudentAppointments = (studentId: string) => {
  return appointmentData.filter((a) => a.studentId === studentId);
};

// Hàm kiểm tra xem một khung thời gian có còn trống hay không
export const checkScheduleAvailability = (scheduleId: string) => {
  const schedule = getScheduleById(scheduleId);
  return schedule.currentAppointments < schedule.maxAppointments;
};
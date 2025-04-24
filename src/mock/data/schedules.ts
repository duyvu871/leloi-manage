import { Schedule, Appointment } from '@type/schedule';

export const mockSchedules: Schedule[] = [
	{
		id: 'SCH001',
		date: '2024-04-15',
		startTime: '08:00',
		endTime: '11:30',
		maxAppointments: 30,
		currentAppointments: 15,
		location: 'Phòng họp 1 - Trường THCS Lê Lợi',
		notes: 'Buổi thi sáng đợt 1',
	},
	{
		id: 'SCH002',
		date: '2024-04-15',
		startTime: '13:30',
		endTime: '17:00',
		maxAppointments: 30,
		currentAppointments: 20,
		location: 'Phòng họp 1 - Trường THCS Lê Lợi',
		notes: 'Buổi thi chiều đợt 1',
	},
	{
		id: 'SCH003',
		date: '2024-04-16',
		startTime: '08:00',
		endTime: '11:30',
		maxAppointments: 30,
		currentAppointments: 10,
		location: 'Phòng họp 2 - Trường THCS Lê Lợi',
		notes: 'Buổi thi sáng đợt 2',
	},
];

export const mockAppointments: Appointment[] = [
	{
		id: 'APT001',
		scheduleId: 'SCH001',
		studentId: 'STD001',
		status: 'scheduled',
		createdAt: '2024-03-20T08:00:00Z',
		updatedAt: '2024-03-20T08:00:00Z',
	},
	{
		id: 'APT002',
		scheduleId: 'SCH001',
		studentId: 'STD002',
		status: 'cancelled',
		createdAt: '2024-03-20T09:15:00Z',
		updatedAt: '2024-03-21T14:30:00Z',
	},
	{
		id: 'APT003',
		scheduleId: 'SCH002',
		studentId: 'STD003',
		status: 'completed',
		createdAt: '2024-03-20T10:30:00Z',
		updatedAt: '2024-03-22T16:45:00Z',
	},
	{
		id: 'APT004',
		scheduleId: 'SCH002',
		studentId: 'STD004',
		status: 'scheduled',
		createdAt: '2024-03-21T11:00:00Z',
		updatedAt: '2024-03-21T11:00:00Z',
	},
	{
		id: 'APT005',
		scheduleId: 'SCH003',
		studentId: 'STD005',
		status: 'scheduled',
		createdAt: '2024-03-22T13:45:00Z',
		updatedAt: '2024-03-22T13:45:00Z',
	},
];

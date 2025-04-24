export interface Schedule {
	id: string;
	date: string;
	startTime: string;
	endTime: string;
	maxAppointments: number;
	currentAppointments: number;
	location: string;
	notes?: string;
}

export interface Appointment {
	id: string;
	scheduleId: string;
	studentId: string;
	status: 'scheduled' | 'completed' | 'cancelled';
	createdAt: string;
	updatedAt: string;
}

import { Application, ApplicationStatus } from '@type/application';
import { Document } from '@type/document';

export const mockDocuments: Document[] = [
	{
		id: 'DOC001',
		studentId: 'STD001',
		type: 'transcript',
		fileName: 'hoc_ba_ki_1.pdf',
		fileUrl: '/documents/hoc_ba_ki_1.pdf',
		uploadedAt: '2024-03-15T08:30:00Z',
		extractedData: {
			subjects: [
				{ name: 'Toán', score: 9.0, evaluation: 'Hoàn thành tốt' },
				{ name: 'Tiếng Việt', score: 8.5, evaluation: 'Hoàn thành tốt' },
				{ name: 'Tiếng Anh', score: 8.0, evaluation: 'Hoàn thành tốt' },
			],
			behavior: 'Tốt',
			attendanceRate: '95%',
			teacherComments: 'Học sinh chăm chỉ, có tinh thần học tập tốt',
		},
	},
	{
		id: 'DOC002',
		studentId: 'STD002',
		type: 'certificate',
		fileName: 'chung_nhan_hoc_tap.pdf',
		fileUrl: '/documents/chung_nhan_hoc_tap.pdf',
		uploadedAt: '2024-03-16T09:15:00Z',
	},
];

export const mockApplications: Application[] = [
	{
		id: 'APP001',
		studentId: 'STD001',
		parentId: 'PAR001',
		status: 'eligible',
		lastUpdated: '2024-03-17T10:00:00Z',
		examInfo: {
			sbd: 'TS001',
			room: 'P201',
			date: '2024-04-15',
			time: '08:00',
		},
		documents: [mockDocuments[0]],
	},
	{
		id: 'APP002',
		studentId: 'STD002',
		parentId: 'PAR002',
		status: 'pending',
		lastUpdated: '2024-03-16T14:30:00Z',
		documents: [mockDocuments[1]],
	},
	{
		id: 'APP003',
		studentId: 'STD003',
		parentId: 'PAR003',
		status: 'ineligible',
		reason: 'Thiếu giấy tờ cần thiết',
		lastUpdated: '2024-03-15T16:45:00Z',
		documents: [],
	},
	{
		id: 'APP004',
		studentId: 'STD004',
		parentId: 'PAR004',
		status: 'confirmed',
		lastUpdated: '2024-03-18T11:20:00Z',
		examInfo: {
			sbd: 'TS004',
			room: 'P202',
			date: '2024-04-15',
			time: '08:00',
		},
		documents: [],
	},
	{
		id: 'APP005',
		studentId: 'STD005',
		parentId: 'PAR005',
		status: 'pending',
		lastUpdated: '2024-03-19T09:10:00Z',
		documents: [],
	},
];

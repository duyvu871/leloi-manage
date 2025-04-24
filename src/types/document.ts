export interface Document {
	id: string;
	studentId: string;
	type: 'transcript' | 'certificate' | 'other';
	fileName: string;
	fileUrl: string;
	uploadedAt: string;
	extractedData?: any;
}

export interface TranscriptData {
	subjects: {
		name: string;
		score: number;
		evaluation?: string;
	}[];
	behavior: string;
	attendanceRate: string;
	teacherComments?: string;
}

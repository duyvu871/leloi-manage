import { Document } from '@type/document';

export type ApplicationStatus = 'pending' | 'eligible' | 'ineligible' | 'confirmed';

export interface Application {
	id: string;
	studentId: string;
	parentId: string;
	status: ApplicationStatus;
	reason?: string;
	lastUpdated: string;
	examInfo?: {
		sbd: string;
		room: string;
		date: string;
		time: string;
	};
	documents: Document[];
}

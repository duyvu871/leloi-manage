export interface Parent {
	id: string;
	name: string;
	phone: string;
	email: string;
	relationship: 'father' | 'mother' | 'guardian' | 'other';
}

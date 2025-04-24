export interface Student {
	id: string;
	name: string;
	dob: string;
	gender: 'male' | 'female';
	address: string;
	currentSchool: {
		name: string;
		address: string;
	};
}

// schemas/registration/schema.ts
import { z } from "zod";
import { phoneRegex } from "@/utils/regex";

const pointMessage = {
	required_error: 'Điểm không được để trống',
	invalid_type_error: 'Điểm phải là số',
}

interface GradeSchema {
	grade: z.ZodNumber;
	math: z.ZodNumber;
	vietnamese: z.ZodNumber;
	english?: z.ZodNumber | z.ZodUndefined;
	science?: z.ZodNumber | z.ZodUndefined;
	history?: z.ZodNumber | z.ZodUndefined;
	award: z.ZodOptional<z.ZodString>;
}

const createGradeValidation = (grade: number) => {
	const base: GradeSchema = {
		grade: z.number().int().min(grade).max(grade),
		math: z.number(pointMessage).min(0).max(10),
		vietnamese: z.number(pointMessage).min(0).max(10),
		award: z.string().optional(),
	};

	if (grade >= 3) {
		base['english'] = z.number(pointMessage).min(0).max(10);
	}
	if (grade >= 4) {
		base['science'] = z.number(pointMessage).min(0).max(10);
		base['history'] = z.number(pointMessage).min(0).max(10);
	}

	return z.object(base as unknown as z.ZodRawShape);
};

const gradeSchemas = {
	1: createGradeValidation(1),
	2: createGradeValidation(2),
	3: createGradeValidation(3),
	4: createGradeValidation(4),
	5: createGradeValidation(5),
} as const;

const academicRecords = z.object({
	grades: z.array(z.any()).superRefine((grades, ctx) => {
		if (grades.length !== 5) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_small,
				minimum: 5,
				type: "array",
				message: "Cần nhập đủ điểm cho 5 lớp (1 đến 5)",
				inclusive: true, // Include the minimum value in the validation
			});
			return;
		}

		const seenGrades = new Set<number>();

		grades.forEach((item, index) => {
			const grade = item.grade;
			if (typeof grade !== 'number' || !(grade in gradeSchemas)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Lớp ${grade} không hợp lệ`,
					path: [index, 'grade'],
				});
				return;
			}

			if (seenGrades.has(grade)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Lớp ${grade} bị trùng lặp`,
					path: [index, 'grade'],
				});
				return;
			}
			seenGrades.add(grade);

			const result = gradeSchemas[grade as keyof typeof gradeSchemas].safeParse(item);
			if (!result.success) {
				for (const issue of result.error.issues) {
					ctx.addIssue({
						...issue,
						path: [index, ...(issue.path || [])],
					});
				}
			}
		});
	}),
	award: z.string().optional(),
});


// Define the Zod schema for form validation
export const registrationSchema = z.object({
	// A. Student Information
	studentInfo: z.object({
		educationDepartment: z.string().min(1, { message: 'Phòng GDĐT không được để trống' }),
		primarySchool: z.string().min(1, { message: 'Trường tiểu học không được để trống' }),
		grade: z.string().min(1, { message: 'Lớp không được để trống' }),
		gender: z.enum(['male', 'female'], { message: 'Vui lòng chọn giới tính' }),
		fullName: z.string().min(1, { message: 'Họ và tên học sinh không được để trống' }),
		dateOfBirth: z.date({
			required_error: 'Ngày sinh không được để trống',
			invalid_type_error: 'Ngày sinh không hợp lệ',
		}),
		placeOfBirth: z.string().min(1, { message: 'Nơi sinh không được để trống' }),
		ethnicity: z.string().min(1, { message: 'Dân tộc không được để trống' }),
	}),

	// B. Residence Information
	residenceInfo: z.object({
		permanentAddress: z.string().min(1, { message: 'Địa chỉ thường trú không được để trống' }),
		temporaryAddress: z.string().optional(),
		currentAddress: z.string().min(1, { message: 'Địa chỉ hiện tại không được để trống' }),
	}),

	// C. Parent Information
	parentInfo: z
		.object({
			// Father
			fatherName: z.string().optional().refine(val => !val || val.length > 0, { message: 'Tên cha không được để trống nếu được nhập' }),
			fatherBirthYear: z.number().int().positive({ message: 'Năm sinh của cha phải là số dương' }).optional(),
			fatherPhone: z.string().optional().refine(val => !val || phoneRegex.test(val), { message: 'Số điện thoại của cha không hợp lệ' }),
			fatherIdCard: z.string().optional().refine(val => !val || /^\d{9,12}$/.test(val), { message: 'Số CMND/CCCD của cha không hợp lệ' }),
			fatherOccupation: z.string().optional().refine(val => !val || val.length > 0, { message: 'Nghề nghiệp của cha không được để trống nếu được nhập' }),
			fatherWorkplace: z.string().optional().refine(val => !val || val.length > 0, { message: 'Nơi làm việc của cha không được để trống nếu được nhập' }),

			// Mother
			motherName: z.string().optional().refine(val => !val || val.length > 0, { message: 'Tên mẹ không được để trống nếu được nhập' }),
			motherBirthYear: z.number().int().positive({ message: 'Năm sinh của mẹ phải là số dương' }).optional(),
			motherPhone: z.string().optional().refine(val => !val || phoneRegex.test(val), { message: 'Số điện thoại của mẹ không hợp lệ' }),
			motherIdCard: z.string().optional().refine(val => !val || /^\d{9,12}$/.test(val), { message: 'Số CMND/CCCD của mẹ không hợp lệ' }),
			motherOccupation: z.string().optional().refine(val => !val || val.length > 0, { message: 'Nghề nghiệp của mẹ không được để trống nếu được nhập' }),
			motherWorkplace: z.string().optional().refine(val => !val || val.length > 0, { message: 'Nơi làm việc của mẹ không được để trống nếu được nhập' }),

			// Guardian
			guardianName: z.string().optional().refine(val => !val || val.length > 0, { message: 'Tên người giám hộ không được để trống nếu được nhập' }),
			guardianBirthYear: z.number().int().positive({ message: 'Năm sinh của người giám hộ phải là số dương' }).optional(),
			guardianPhone: z.string().optional().refine(val => !val || phoneRegex.test(val), { message: 'Số điện thoại của người giám hộ không hợp lệ' }),
			guardianIdCard: z.string().optional().refine(val => !val || /^\d{9,12}$/.test(val), { message: 'Số CMND/CCCD của người giám hộ không hợp lệ' }),
			guardianOccupation: z.string().optional().refine(val => !val || val.length > 0, { message: 'Nghề nghiệp của người giám hộ không được để trống nếu được nhập' }),
			guardianWorkplace: z.string().optional().refine(val => !val || val.length > 0, { message: 'Nơi làm việc của người giám hộ không được để trống nếu được nhập' }),
			guardianRelationship: z.string().optional().refine(val => !val || val.length > 0, { message: 'Mối quan hệ với học sinh không được để trống nếu được nhập' }),
		})
		.refine(
			(data) => {
				// Require at least father, mother, or guardian information
				const hasFather = !!data.fatherName;
				const hasMother = !!data.motherName;
				const hasGuardian = !!data.guardianName;
				return hasFather || hasMother || hasGuardian;
			},
			{
				message: 'Vui lòng cung cấp thông tin của ít nhất một người (cha, mẹ hoặc người giám hộ)',
				path: ['fatherName'],
			}
		),

	academicRecords: academicRecords,
	// D. Priority Points (if any)
	priorityPoint: z.object({
		type: z.enum(['none', 'type1', 'type2', 'type3'], { 
			message: 'Vui lòng chọn loại ưu tiên hợp lệ' 
		}),
		points: z.number().optional(),
	}).optional(),

	// E. Competition Results (if any) - replaced BonusPoints
	competitionResults: z.array(
		z.object({
			competitionId: z.string().min(1, { message: 'Vui lòng chọn cuộc thi' }),
			level: z.enum(['city', 'national'], { 
				message: 'Vui lòng chọn cấp thi đấu'
			}),
			achievement: z.enum(['none', 'first', 'second', 'third'], { 
				message: 'Vui lòng chọn thành tích'
			}),
			points: z.number().optional(),
			year: z.number().int()
				.min(2005, { message: 'Năm không hợp lệ, tối thiểu là 2005' })
				.max(new Date().getFullYear(), { message: 'Năm không được lớn hơn năm hiện tại' }),
		})
	).optional(),

	// F. Commitment
	commitment: z.object({
		relationship: z.string().min(1, { message: 'Mối quan hệ với học sinh không được để trống' }),
		signatureDate: z.date({
			required_error: 'Ngày ký không được để trống',
			invalid_type_error: 'Ngày ký không hợp lệ',
		}),
		guardianName: z.string().min(1, { message: 'Tên người giám hộ không được để trống' }),
		applicantName: z.string().min(1, { message: 'Tên người đăng ký không được để trống' }),
	}),

	// G. Additional Information
	additionalInfo: z.object({
		fileId: z.string().optional().refine(val => !val || val.length > 0, { message: 'Mã hồ sơ không được để trống nếu được nhập' }),
		studentCode: z.string().optional().refine(val => !val || val.length > 0, { message: 'Mã học sinh không được để trống nếu được nhập' }),
		identificationNumber: z.string().optional().refine(val => !val || /^\d{9,12}$/.test(val), { message: 'Số CMND/CCCD không hợp lệ' }),
	}).optional(),
});

// Server-side schema for API validation - converts dates to strings for API transmission
// export const registrationApiSchema = registrationSchema.transform((data) => ({
//     ...data,
//     studentInfo: {
//         ...data.studentInfo,
//         dateOfBirth: data.studentInfo.dateOfBirth.toISOString(),
//     },
//     commitment: {
//         ...data.commitment,
//         signatureDate: data.commitment.signatureDate.toISOString(),
//     },
// }));
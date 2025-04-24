// schemas/registration/schema.ts
import { z } from "zod";

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
			fatherName: z.string().optional(),
			fatherBirthYear: z.number().int().positive().optional(),
			fatherPhone: z.string().optional(),
			fatherIdCard: z.string().optional(),
			fatherOccupation: z.string().optional(),
			fatherWorkplace: z.string().optional(),

			// Mother
			motherName: z.string().optional(),
			motherBirthYear: z.number().int().positive().optional(),
			motherPhone: z.string().optional(),
			motherIdCard: z.string().optional(),
			motherOccupation: z.string().optional(),
			motherWorkplace: z.string().optional(),

			// Guardian
			guardianName: z.string().optional(),
			guardianBirthYear: z.number().int().positive().optional(),
			guardianPhone: z.string().optional(),
			guardianIdCard: z.string().optional(),
			guardianOccupation: z.string().optional(),
			guardianWorkplace: z.string().optional(),
			guardianRelationship: z.string().optional(),
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
			year: z.number().int().min(2005).max(new Date().getFullYear()),
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
		fileId: z.string().optional(),
		studentCode: z.string().optional(),
		identificationNumber: z.string().optional(),
	}).optional(),
});

// Server-side schema for API validation - converts dates to strings for API transmission
export const registrationApiSchema = registrationSchema.transform((data) => ({
    ...data,
    studentInfo: {
        ...data.studentInfo,
        dateOfBirth: data.studentInfo.dateOfBirth.toISOString(),
    },
    commitment: {
        ...data.commitment,
        signatureDate: data.commitment.signatureDate.toISOString(),
    },
}));
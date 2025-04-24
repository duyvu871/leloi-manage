// schemas/user/schema.ts
import { z } from "zod";

// Define basic user types and roles
const userRoleSchema = z.enum(['manager', 'parent']);

// Define relationship types for parents
const relationshipSchema = z.enum(['father', 'mother', 'guardian']);

// Define parent information schema
export const parentInfoSchema = z.object({
    // Father information
    fatherName: z.string().nullable(),
    fatherBirthYear: z.number().nullable(),
    fatherPhone: z.string().nullable(),
    fatherIdCard: z.string().nullable(),
    fatherOccupation: z.string().nullable(),
    fatherWorkplace: z.string().nullable(),

    // Mother information
    motherName: z.string().nullable(),
    motherBirthYear: z.number().nullable(),
    motherPhone: z.string().nullable(),
    motherIdCard: z.string().nullable(),
    motherOccupation: z.string().nullable(),
    motherWorkplace: z.string().nullable(),

    // Guardian information
    guardianName: z.string().nullable(),
    guardianBirthYear: z.number().nullable(),
    guardianPhone: z.string().nullable(),
    guardianIdCard: z.string().nullable(),
    guardianOccupation: z.string().nullable(),
    guardianWorkplace: z.string().nullable(),
    guardianRelationship: z.string().nullable(),
});

// Update student schema to match StudentInfoDto
export const studentSchema = z.object({
    id: z.number(),
    fullName: z.string(),
    dateOfBirth: z.date(),
    gender: z.string(),
    educationDepartment: z.string(),
    primarySchool: z.string(),
    grade: z.string(),
    placeOfBirth: z.string(),
    ethnicity: z.string(),
    permanentAddress: z.string(),
    temporaryAddress: z.string().nullable(),
    currentAddress: z.string(),
    examNumber: z.string().nullable(),
    examRoom: z.string().nullable(),
    studentCode: z.string().nullable(),
    identificationNumber: z.string().nullable(),
    grades: z.array(z.object({
        id: z.number(),
        subjectId: z.number(),
        score: z.number(),
        examDate: z.date(),
        subject: z.object({
            id: z.number(),
            name: z.string(),
            description: z.string().optional()
        }).optional()
    })).nullable(),
    priorityPoint: z.object({
        type: z.string(),
        points: z.number()
    }).nullable(),
    bonusPoints: z.array(z.object({
        category: z.string(),
        level: z.string(),
        achievement: z.string(),
        points: z.number()
    })).nullable(),
    commitment: z.object({
        relationship: z.string(),
        signatureDate: z.date(),
        guardianName: z.string(),
        applicantName: z.string()
    }).nullable(),
    application: z.object({
        id: z.number(),
        status: z.string(),
        isEligible: z.boolean(),
        rejectionReason: z.string().nullable(),
        verificationDate: z.date().nullable()
    }).nullable()
});

// Base user schema
export const baseUserSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().regex(/^\d{10}$/, "Số điện thoại phải có 10 số"),
    role: userRoleSchema,
    isActive: z.boolean().default(true),
    lastLogin: z.date().nullable(),
    lastUpdated: z.date()
});

// Parent user schema
export const parentUserSchema = baseUserSchema.extend({
    role: z.literal('parent'),
    relationship: relationshipSchema,
    parentInfo: parentInfoSchema.nullable(),
    students: z.array(studentSchema),
});

// Manager user schema (previously Admin)
export const managerUserSchema = baseUserSchema.extend({
    role: z.literal('manager'),
    permissions: z.array(z.enum([
        'manage_applications',
        'manage_schedules',
        'manage_users',
        'send_notifications',
        'view_reports',
        'approve_applications'
    ]))
});

// Combined user schema for general use
export const userSchema = z.discriminatedUnion('role', [
    parentUserSchema,
    managerUserSchema
]);

// Authentication schemas
export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
});

export const registerSchema = z.object({
    name: z.string().min(1, "Tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().regex(/^\d{10}$/, "Số điện thoại phải có 10 số"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    role: userRoleSchema,
    relationship: relationshipSchema.optional()
});

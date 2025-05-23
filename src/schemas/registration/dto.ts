// schemas/registration/dto.ts
import { z } from "zod";
import { registrationSchema } from "./schema";
import { CompetitionResult } from "@/types/points";
import { 
    Student, 
    Application, 
    ParentInfo, 
    PriorityPoint, 
    Commitment,
    Grade
} from "@/types/registration";

// Export the inferred type from the registration schema
export type RegistrationFormData = z.infer<typeof registrationSchema>;

// DTOs for API requests and responses
export interface CreateStudentDto {
    fullName: string;
    dateOfBirth: string | Date;
    gender: string;
    educationDepartment: string;
    primarySchool: string;
    grade: string;
    placeOfBirth: string;
    ethnicity: string;
    permanentAddress: string;
    temporaryAddress?: string | null;
    currentAddress: string;
    examNumber?: string | null;
    examRoom?: string | null;
    studentCode?: string | null;
    identificationNumber?: string | null;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {}

export interface CreateApplicationDto {
    studentId: number;
    status?: string;
    isEligible?: boolean;
    rejectionReason?: string | null;
}

export interface UpdateApplicationDto {
    status?: string;
    isEligible?: boolean;
    rejectionReason?: string | null;
    verificationDate?: Date | null;
}

export interface CreateParentInfoDto {
    userId: number;
    
    // Father information
    fatherName?: string | null;
    fatherBirthYear?: number | null;
    fatherPhone?: string | null;
    fatherIdCard?: string | null;
    fatherOccupation?: string | null;
    fatherWorkplace?: string | null;
    
    // Mother information
    motherName?: string | null;
    motherBirthYear?: number | null;
    motherPhone?: string | null;
    motherIdCard?: string | null;
    motherOccupation?: string | null;
    motherWorkplace?: string | null;
    
    // Guardian information
    guardianName?: string | null;
    guardianBirthYear?: number | null;
    guardianPhone?: string | null;
    guardianIdCard?: string | null;
    guardianOccupation?: string | null;
    guardianWorkplace?: string | null;
    guardianRelationship?: string | null;
}

export interface UpdateParentInfoDto extends Partial<CreateParentInfoDto> {}

export interface CreateCommitmentDto {
    studentId: number;
    relationship: string;
    signatureDate: Date | string;
    guardianName: string;
    applicantName: string;
}

export interface CreatePriorityPointDto {
    studentId: number;
    type: string;
    points: number;
}

export interface CreateCompetitionResultDto {
    studentId: number;
    competitionId: string;
    level: string;
    achievement: string;
    points: number;
    year: number;
}

// Registration response DTO that combines all related entities
// export interface RegistrationResponseDto {
//     student: Student;
//     application?: Application;
//     parentInfo: ParentInfo;
//     priorityPoint?: PriorityPoint;
//     competitionResults?: CompetitionResult[];
//     commitment?: Commitment;
//     grades?: Grade[];
// }

// Convert form data to database DTOs
export function convertFormToDbDtos(formData: RegistrationFormData, userId: number, studentId?: number): {
    student: CreateStudentDto;
    parentInfo: CreateParentInfoDto;
    commitment?: CreateCommitmentDto;
    priorityPoint?: CreatePriorityPointDto;
    competitionResults?: CreateCompetitionResultDto[];
} {
    // Create student data
    const student: CreateStudentDto = {
        fullName: formData.studentInfo.fullName,
        dateOfBirth: formData.studentInfo.dateOfBirth,
        gender: formData.studentInfo.gender,
        educationDepartment: formData.studentInfo.educationDepartment,
        primarySchool: formData.studentInfo.primarySchool,
        grade: formData.studentInfo.grade,
        placeOfBirth: formData.studentInfo.placeOfBirth,
        ethnicity: formData.studentInfo.ethnicity,
        permanentAddress: formData.residenceInfo.permanentAddress,
        temporaryAddress: formData.residenceInfo.temporaryAddress || null,
        currentAddress: formData.residenceInfo.currentAddress,
        studentCode: formData.additionalInfo?.studentCode,
        identificationNumber: formData.additionalInfo?.identificationNumber
    };

    // Create parent info data
    const parentInfo: CreateParentInfoDto = {
        userId,
        ...formData.parentInfo
    };

    // Create commitment data if available
    const commitment = formData.commitment && studentId ? {
        studentId,
        relationship: formData.commitment.relationship,
        signatureDate: formData.commitment.signatureDate,
        guardianName: formData.commitment.guardianName,
        applicantName: formData.commitment.applicantName
    } : undefined;

    // Create priority point data if available
    const priorityPoint = formData.priorityPoint && studentId ? {
        studentId,
        type: formData.priorityPoint.type,
        points: formData.priorityPoint.points || 0
    } : undefined;

    // Create competition results data if available
    const competitionResults = formData.competitionResults && studentId ? 
        formData.competitionResults.map(result => ({
            studentId,
            competitionId: result.competitionId,
            level: result.level,
            achievement: result.achievement,
            points: result.points || 0,
            year: result.year
        })) : undefined;

    return {
        student,
        parentInfo,
        commitment,
        priorityPoint,
        competitionResults
    };
}

// Student related types
export interface StudentDto {
    id: number;
    userId: number;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    educationDepartment: string;
    primarySchool: string;
    grade: string;
    placeOfBirth: string;
    ethnicity: string;
    permanentAddress: string;
    temporaryAddress?: string;
    currentAddress: string;
    examNumber?: string;
    examRoom?: string;
    studentCode?: string;
    identificationNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Application related types
export interface ApplicationDto {
    id: number;
    studentId: number;
    createdAt: Date;
    updatedAt: Date;
}

// Parent information related types
export interface ParentInfoDto {
    id: number;
    userId: number;
    fatherName?: string;
    fatherBirthYear?: number;
    fatherPhone?: string;
    fatherIdCard?: string;
    fatherOccupation?: string;
    fatherWorkplace?: string;
    motherName?: string;
    motherBirthYear?: number;
    motherPhone?: string;
    motherIdCard?: string;
    motherOccupation?: string;
    motherWorkplace?: string;
    guardianName?: string;
    guardianBirthYear?: number;
    guardianPhone?: string;
    guardianIdCard?: string;
    guardianOccupation?: string;
    guardianWorkplace?: string;
    guardianRelationship?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Priority points related types
export interface PriorityPointDto {
    id: number;
    studentId: number;
    type: string;
    points: number;
    createdAt: Date;
    updatedAt: Date;
}

// Competition results related types
export interface CompetitionResultDto {
    competitionId: string;
    level: string;
    achievement: string;
    points: number;
    year: number;
}

// Commitment related types
export interface CommitmentDto {
    id: number;
    studentId: number;
    relationship: string;
    signatureDate: Date;
    guardianName: string;
    applicantName: string;
    createdAt: Date;
    updatedAt: Date;
}

// Academic records related types
export interface GradeDto {
    grade: number;
    math: number;
    vietnamese: number;
    english?: number;
    science?: number;
    history?: number;
}

export interface AcademicRecordsDto {
    academicRecords: {
        grades: GradeDto[];
    };
}

// Registration response DTO that combines all related entities
export interface RegistrationResponseDto {
    student: StudentDto;
    application: ApplicationDto | null;
    parentInfo: ParentInfoDto;
    priorityPoint?: PriorityPointDto;
    competitionResults?: CompetitionResultDto[];
    commitment?: CommitmentDto;
    academicRecords?: AcademicRecordsDto;
}

// Document related types
export interface DocumentDto {
    id: number;
    name: string;
    description?: string;
    url: string;
    type: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: Date;
}

// Competition related types
export type AchievementLevel = 'none' | 'first' | 'second' | 'third';
export type CompetitionLevel = 'city' | 'national';

export interface CompetitionDto {
    id: string;
    name: string;
    description?: string;
    category: CompetitionCategory;
    levels: CompetitionLevel[];
    isActive: boolean;
    order: number;
}

export type CompetitionCategory = 
    | 'academic'      // Học thuật
    | 'sports'        // Thể thao
    | 'arts'          // Nghệ thuật
    | 'literature'    // Văn học
    | 'science'       // Khoa học
    | 'technology'    // Công nghệ
    | 'other';        // Khác

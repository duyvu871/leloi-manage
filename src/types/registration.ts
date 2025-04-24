import { CompetitionResult, PriorityType } from './points';

// Student related types
export interface Student {
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
    temporaryAddress?: string | null;
    currentAddress: string;
    examNumber?: string | null;
    examRoom?: string | null;
    studentCode?: string | null;
    identificationNumber?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Application related types
export interface Application {
    id: number;
    studentId: number;
    status: ApplicationStatus;
    isEligible: boolean;
    rejectionReason?: string | null;
    verificationDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

// Document related types
export interface Document {
    id: number;
    applicationId: number;
    fileName: string;
    fileUrl: string;
    type: DocumentType;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: Date;
}

export type DocumentType = 'transcript' | 'certificate' | 'other';

// Extracted data type
export interface ExtractedData {
    id: number;
    documentId: number;
    data: any; // JSON data
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Grades related types
export interface Grade {
    id: number;
    studentId: number;
    subjectId: number;
    score: number;
    examDate: Date;
    createdAt: Date;
    updatedAt: Date;
    
    // Relation
    subject?: Subject;
}

export interface Subject {
    id: number;
    name: string;
    description?: string | null;
}

// Bonus points related types
export interface BonusPoint {
    id: number;
    studentId: number;
    category: string; 
    level: string;
    achievement: string;
    points: number;
    createdAt: Date;
    updatedAt: Date;
}

// Priority points related types
export interface PriorityPoint {
    id: number;
    studentId: number;
    type: PriorityType;
    points: number;
    createdAt: Date;
    updatedAt: Date;
}

// Commitment related types
export interface Commitment {
    id: number;
    studentId: number;
    relationship: string;
    signatureDate: Date;
    guardianName: string;
    applicantName: string;
    createdAt: Date;
    updatedAt: Date;
}

// Parent information related types
export interface ParentInfo {
    id: number;
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
    
    createdAt: Date;
    updatedAt: Date;
}

// Transcript data
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
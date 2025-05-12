import { API_ROUTES } from "@/constants/path";
import { SuccessResponse } from "@/types/api/response";
import { axiosRequestWithException } from "./base";
import { StudentDto } from "@/types/student";
import { ApplicationDto, GradeDto, ParentInfoDto } from "@/schemas/registration/dto";

// import { StudentStatus, Gender } from '../enums/admin.enum';
// import { StudentDto, ParentInfoDto, ApplicationDto, GradeDto } from './registration.dto';

export enum StudentStatus {
    ELIGIBLE = 'eligible',
    INELIGIBLE = 'ineligible',
    PENDING = 'pending',
    CONFIRMED = 'confirmed'
}

export interface StudentListItemDto {
    id: number;
    studentId: string;
    name: string;
    dob: Date;
    gender: 'male' | 'female';
    currentSchool: string;
    status: StudentStatus;
    statusReason?: string;
    lastUpdated: Date;
}

export interface AdminDashboardStatsDto {
    totalApplications: number;
    eligibleCount: number;
    ineligibleCount: number;
    pendingCount: number;
    confirmedCount: number;
}

export interface StudentFilterDto {
    search?: string;
    status?: StudentStatus;
    gender?: 'male' | 'female';
    school?: string;
    page?: number;
    limit?: number;
}

export interface ExamInfo {
    sbd?: string;
    room?: string;
    date?: string;
    time?: string;
}

export interface StudentDetailDto {
    student: StudentDto;
    parent: ParentInfoDto;
    application: ApplicationDto | null;
    transcriptData: {
        subjects: Array<{
            name: string;
            score: number;
            evaluation?: string;
        }>;
        behavior?: string;
        attendanceRate?: string;
        teacherComments?: string;
    };
    status: {
        currentStatus: StudentStatus;
        reason?: string;
        lastUpdated: Date;
        examInfo?: ExamInfo;
    };
    certificates: string[];
    academicRecords: {
        grades: GradeDto[];
    }
}

export interface UpdateStudentStatusDto {
    status: StudentStatus;
    reason?: string;
    examInfo?: ExamInfo;
}

export interface PaginatedResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PendingReviewStudentDto {
    id: number;
    studentId: string;
    name: string;
    reason: string;
    lastUpdated: Date;
}

export interface DetailedStatsDto {
    totalApplications: number;
    eligibleCount: number;
    ineligibleCount: number;
    processingCount: number;
    confirmedCount: number;
}

export interface StudentDocumentDto {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    status: 'pending' | 'verified' | 'rejected';
    verifiedAt?: string;
    verifiedBy?: string;
    comments?: string;
}

export interface UpdateStudentInfoDto {
    fullName?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female';
    currentSchool?: string;
    grade?: string;
    parentInfo?: {
        fatherName?: string;
        fatherPhone?: string;
        motherName?: string;
        motherPhone?: string;
        guardianName?: string;
        guardianPhone?: string;
        guardianRelationship?: string;
    };
    address?: {
        permanent?: string;
        temporary?: string;
        current?: string;
    };
}

export interface VerifyDocumentDto {
    status: 'verified' | 'rejected';
    comments?: string;
}

// API Functions
export const getAdminStats = async () => {
    const requestConfig = {
        method: 'get',
        url: API_ROUTES.v1.ADMIN.STATS,
    };
    
    return (await axiosRequestWithException<SuccessResponse<AdminDashboardStatsDto>>(
        requestConfig,
        () => console.log("Admin stats fetched successfully")
    )).data;
};

export const getStudentList = async (params?: {
    search?: string;
    status?: string;
    gender?: string;
    school?: string;
    page?: number;
    limit?: number;
}) => {
    const requestConfig = {
        method: 'get',
        url: API_ROUTES.v1.ADMIN.STUDENTS,
        params,
    };
    
    return (await axiosRequestWithException<SuccessResponse<{
        data: StudentListItemDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>>(
        requestConfig,
        () => console.log("Student list fetched successfully")
    )).data;
};

export const getStudentDetails = async (id: string) => {
    const requestConfig = {
        method: 'get',
        url: `${API_ROUTES.v1.ADMIN.STUDENTS}/${id}`,
    };
    
    return (await axiosRequestWithException<SuccessResponse<StudentDetailDto>>(
        requestConfig,
        () => console.log("Student details fetched successfully")
    )).data;
};

export const updateStudentStatus = async (
    id: string,
    data: {
        status: "eligible" | "ineligible" | "pending" | "confirmed";
        reason?: string;
        examInfo?: {
            sbd: string;
            room: string;
            date: string;
            time: string;
        };
    }
) => {
    const requestConfig = {
        method: 'patch',
        url: `${API_ROUTES.v1.ADMIN.STUDENTS}/${id}/status`,
        data,
    };
    
    return (await axiosRequestWithException<SuccessResponse<StudentDetailDto>>(
        requestConfig,
        () => console.log("Student status updated successfully")
    )).data;
};

export const getPendingReviewStudents = async (search?: string) => {
    const requestConfig = {
        method: 'get',
        url: API_ROUTES.v1.ADMIN.PENDING,
        params: { search },
    };
    
    return (await axiosRequestWithException<SuccessResponse<PendingReviewStudentDto[]>>(
        requestConfig,
        () => console.log("Pending review students fetched successfully")
    )).data;
};

export const verifyStudentById = async (studentId: string) => {
    const requestConfig = {
        method: 'get',
        url: API_ROUTES.v1.ADMIN.VERIFY,
        params: { studentId },
    };
    
    return (await axiosRequestWithException<SuccessResponse<StudentDetailDto>>(
        requestConfig,
        () => console.log("Student verified successfully")
    )).data;
};

export const getDetailedStats = async () => {
    const requestConfig = {
        method: 'get',
        url: API_ROUTES.v1.ADMIN.STATS_DETAILED,
    };
    
    return (await axiosRequestWithException<SuccessResponse<DetailedStatsDto>>(
        requestConfig,
        () => console.log("Detailed stats fetched successfully")
    )).data;
};

// Get student documents
export const getStudentDocuments = async (studentId: string) => {
    const requestConfig = {
        method: 'get',
        url: `${API_ROUTES.v1.ADMIN.STUDENTS}/${studentId}/documents`,
    };
    
    return (await axiosRequestWithException<SuccessResponse<StudentDocumentDto[]>>(
        requestConfig,
        () => console.log("Student documents fetched successfully")
    )).data;
};

// Verify student document
export const verifyDocument = async (studentId: string, documentId: number, data: VerifyDocumentDto) => {
    const requestConfig = {
        method: 'patch',
        url: `${API_ROUTES.v1.ADMIN.STUDENTS}/${studentId}/documents/${documentId}/verify`,
        data,
    };
    
    return (await axiosRequestWithException<SuccessResponse<StudentDocumentDto>>(
        requestConfig,
        () => console.log("Document verified successfully")
    )).data;
};

// Update student information
export const updateStudentInfo = async (studentId: string, data: UpdateStudentInfoDto) => {
    const requestConfig = {
        method: 'patch',
        url: `${API_ROUTES.v1.ADMIN.STUDENTS}/${studentId}`,
        data,
    };
    
    return (await axiosRequestWithException<SuccessResponse<StudentDetailDto>>(
        requestConfig,
        () => console.log("Student information updated successfully")
    )).data;
}; 
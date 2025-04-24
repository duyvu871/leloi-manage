import { API_ROUTES } from "@/constants/path";
import { 
    CreateStudentDto, 
    UpdateStudentDto, 
    CreateParentInfoDto, 
    CreateCommitmentDto, 
    CreatePriorityPointDto,
    CreateCompetitionResultDto,
    RegistrationResponseDto,
    RegistrationFormData
} from "@/schemas/registration/dto";
import { SuccessResponse } from "@/types/api/response";
import { axiosRequestWithException } from "@lib/apis/base";
import { Student } from "@/types/student";

// Type definition for registration status query
export interface RegistrationStatusQueryDto {
    studentId?: number | string;
    applicationId?: string;
    userId?: number;
}

// Type definition for registration update
export interface UpdateRegistrationDto {
    studentInfo?: Partial<CreateStudentDto>;
    parentInfo?: Partial<CreateParentInfoDto>;
    commitment?: Partial<CreateCommitmentDto>;
    priorityPoint?: Partial<CreatePriorityPointDto>;
    competitionResults?: CreateCompetitionResultDto[];
}

// Submit a new registration application
export const submitRegistration = async (formData: RegistrationFormData, userId: number) => {
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.REGISTRATION.SUBMIT,
        data: {
            formData,
            userId
        }
    };
    
    return (await axiosRequestWithException<SuccessResponse<RegistrationResponseDto>>(
        requestConfig,
        () => console.log("Registration submitted successfully")
    )).data;
};

// Get registration status by ID or other search parameters
export const getRegistrationStatus = async (
    query: RegistrationStatusQueryDto
): Promise<RegistrationResponseDto> => {
    const requestConfig = {
        method: 'get',
        url: API_ROUTES.v1.REGISTRATION.STATUS,
        params: query,
    };

    return (await axiosRequestWithException<SuccessResponse<RegistrationResponseDto>>(
        requestConfig,
        () => console.log("Retrieved registration status successfully")
    )).data;
};

// Update an existing registration
export const updateRegistration = async (
    studentId: number,
    updates: UpdateRegistrationDto
): Promise<RegistrationResponseDto> => {
    // Process any date fields before sending to API
    let processedUpdates: Record<string, any> = { ...updates };
    
    if (updates.studentInfo?.dateOfBirth) {
        processedUpdates = {
            ...processedUpdates,
            studentInfo: {
                ...processedUpdates.studentInfo,
                dateOfBirth: new Date(updates.studentInfo.dateOfBirth).toISOString(),
            }
        };
    }
    
    if (updates.commitment?.signatureDate) {
        processedUpdates = {
            ...processedUpdates,
            commitment: {
                ...processedUpdates.commitment,
                signatureDate: new Date(updates.commitment.signatureDate).toISOString(),
            }
        };
    }

    const requestConfig = {
        method: 'patch',
        url: `${API_ROUTES.v1.REGISTRATION.STUDENT}/${studentId}`,
        data: processedUpdates,
    };

    return (await axiosRequestWithException<SuccessResponse<RegistrationResponseDto>>(
        requestConfig,
        () => console.log("Registration updated successfully")
    )).data;
};

// Create a new student
export const createStudent = async (dto: CreateStudentDto) => {
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.REGISTRATION.STUDENT,
        data: dto
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ student: { id: number } }>>( 
        requestConfig, 
        () => console.log("Student created successfully")
    )).data;
};

// Update an existing student
export const updateStudent = async (studentId: number, dto: UpdateStudentDto) => {
    const requestConfig = {
        method: 'put',
        url: `${API_ROUTES.v1.REGISTRATION.STUDENT}/${studentId}`,
        data: dto
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ student: { id: number } }>>(
        requestConfig,
        () => console.log("Student updated successfully")
    )).data;
};

// Create or update parent information
export const saveParentInfo = async (dto: CreateParentInfoDto) => {
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.REGISTRATION.PARENT_INFO,
        data: dto
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ parentInfo: { id: number } }>>(
        requestConfig,
        () => console.log("Parent information saved successfully")
    )).data;
};

// Save student's commitment
export const saveCommitment = async (dto: CreateCommitmentDto) => {
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.REGISTRATION.COMMITMENT,
        data: dto
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ commitment: { id: number } }>>(
        requestConfig,
        () => console.log("Commitment saved successfully")
    )).data;
};

// Save priority point information
export const savePriorityPoint = async (dto: CreatePriorityPointDto) => {
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.REGISTRATION.PRIORITY_POINT,
        data: dto
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ priorityPoint: { id: number } }>>(
        requestConfig,
        () => console.log("Priority point saved successfully")
    )).data;
};

// Save competition results
export const saveCompetitionResults = async (dtos: CreateCompetitionResultDto[]) => {
    if (!dtos.length) return { success: true, data: { results: [] } };
    
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.REGISTRATION.COMPETITION_RESULTS,
        data: { results: dtos }
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ results: any[] }>>(
        requestConfig,
        () => console.log("Competition results saved successfully")
    )).data;
};

// Get registration data by student ID
export const getRegistrationByStudentId = async (studentId: number) => {
    const requestConfig = {
        method: 'get',
        url: `${API_ROUTES.v1.REGISTRATION.STUDENT}/${studentId}`
    };
    
    return (await axiosRequestWithException<SuccessResponse<RegistrationResponseDto>>(
        requestConfig,
        () => console.log("Registration data fetched successfully")
    )).data;
};

// Get a student by ID
export const getStudentById = async (studentId: number): Promise<Student> => {
    const requestConfig = {
        method: 'get',
        url: `${API_ROUTES.v1.REGISTRATION.STUDENT}/${studentId}/details`,
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ student: Student }>>(
        requestConfig,
        () => console.log("Student data fetched successfully")
    )).data.student;
};

// Upload document for an application
export const uploadDocument = async (applicationId: number, file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('applicationId', applicationId.toString());
    
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.REGISTRATION.DOCUMENT_UPLOAD,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ document: { id: number } }>>(
        requestConfig,
        () => console.log("Document uploaded successfully")
    )).data;
};
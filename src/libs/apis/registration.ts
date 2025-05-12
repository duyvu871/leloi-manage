import { API_ROUTES } from "@/constants/path";
import { 
    CreateStudentDto, 
    UpdateStudentDto, 
    CreateParentInfoDto, 
    CreateCommitmentDto, 
    CreatePriorityPointDto,
    CreateCompetitionResultDto,
    RegistrationResponseDto,
    RegistrationFormData,
    convertFormToDbDtos
} from "@/schemas/registration/dto";
import { SuccessResponse } from "@/types/api/response";
import { axiosRequestWithException } from "@lib/apis/base";
import { StudentDto } from "@/types/student";


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
            ...formData,
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
export const getStudentById = async (studentId: number): Promise<StudentDto> => {
    const requestConfig = {
        method: 'get',
        url: `${API_ROUTES.v1.REGISTRATION.STUDENT}/${studentId}/details`,
    };
    
    return (await axiosRequestWithException<SuccessResponse<{ student: StudentDto }>>(
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

// Get application status and details
export const getApplicationStatus = async (applicationId: number) => {
    const requestConfig = {
        method: 'get',
        url: `${API_ROUTES.v1.REGISTRATION.APPLICATION}/${applicationId}/status`,
    };
    
    return (await axiosRequestWithException<SuccessResponse<{
        application: {
            id: number;
            status: 'pending' | 'approved' | 'rejected';
            isEligible: boolean;
            rejectionReason?: string;
            verificationDate?: string;
            createdAt: string;
            updatedAt: string;
            examNumber?: string;
            examRoom?: string;
            documents: Array<{
                id: number;
                type: string;
                fileName: string;
                fileUrl: string;
                uploadedAt: string;
            }>;
            student: {
                id: number;
                fullName: string;
                dateOfBirth: string;
                gender: string;
                educationDepartment: string;
                primarySchool: string;
                grade: string;
                academicRecords: {
                    grades: Array<{
                        grade: number;
                        math?: number;
                        vietnamese?: number;
                        english?: number;
                        science?: number;
                        history?: number;
                        award?: string;
                    }>;
                };
                competitionResults?: Array<{
                    competitionId: string;
                    level: 'city' | 'national';
                    achievement: 'none' | 'first' | 'second' | 'third';
                    points: number;
                }>;
                priorityPoint?: {
                    type: string;
                    points: number;
                };
            };
        };
    }>>(
        requestConfig,
        () => console.log("Application status fetched successfully")
    )).data;
};

// // Get available exam schedule slots
// export const getAvailableScheduleSlots = async () => {
//     const requestConfig = {
//         method: 'get',
//         url: API_ROUTES.v1.REGISTRATION.SCHEDULE_SLOTS,
//     };
    
//     return (await axiosRequestWithException<SuccessResponse<{
//         slots: Array<{
//             id: number;
//             date: string;
//             startTime: string;
//             endTime: string;
//             room: string;
//             capacity: number;
//             availableSeats: number;
//         }>;
//     }>>(
//         requestConfig,
//         () => console.log("Available schedule slots fetched successfully")
//     )).data;
// };

// Assign schedule slot to application
export const assignScheduleSlot = async (applicationId: number, slotId: number) => {
    const requestConfig = {
        method: 'post',
        url: `${API_ROUTES.v1.REGISTRATION.APPLICATION}/${applicationId}/schedule`,
        data: { slotId },
    };
    
    return (await axiosRequestWithException<SuccessResponse<{
        success: boolean;
        examNumber?: string;
        examRoom?: string;
        scheduledAt: string;
    }>>(
        requestConfig,
        () => console.log("Schedule slot assigned successfully")
    )).data;
};

// Calculate total points for an application
export const calculateApplicationPoints = async (applicationId: number) => {
    const requestConfig = {
        method: 'get',
        url: `${API_ROUTES.v1.REGISTRATION.APPLICATION}/${applicationId}/points`,
    };
    
    return (await axiosRequestWithException<SuccessResponse<{
        totalPoints: number;
        breakdown: {
            academicPoints: number;
            competitionPoints: number;
            priorityPoints: number;
        };
    }>>(
        requestConfig,
        () => console.log("Application points calculated successfully")
    )).data;
};
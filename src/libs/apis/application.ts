import { API_ROUTES } from "@/constants/path";
import { axiosRequestWithException } from "@lib/apis/base";
import { SuccessResponse } from "@/types/api/response";
import { Application } from "@/types/registration";

// Get application status
export const getApplicationStatus = async (applicationId: number): Promise<Application> => {
  const requestConfig = {
    method: 'get',
    url: `${API_ROUTES.v1.REGISTRATION.APPLICATION}/${applicationId}`,
  };
  
  return (await axiosRequestWithException<SuccessResponse<{ application: Application }>>(
    requestConfig,
    () => console.log("Application status retrieved successfully")
  )).data.application;
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: number, 
  status: 'pending' | 'approved' | 'rejected',
  isEligible?: boolean,
  rejectionReason?: string
): Promise<Application> => {
  const requestConfig = {
    method: 'patch',
    url: `${API_ROUTES.v1.REGISTRATION.APPLICATION}/${applicationId}/status`,
    data: {
      status,
      isEligible,
      rejectionReason,
      verificationDate: new Date().toISOString()
    }
  };
  
  return (await axiosRequestWithException<SuccessResponse<{ application: Application }>>(
    requestConfig,
    () => console.log("Application status updated successfully")
  )).data.application;
};

// Assign schedule slot to application
export const assignScheduleSlot = async (
  applicationId: number,
  scheduleSlotId: number
): Promise<{ application: Application, scheduleSlot: any }> => {  
  const requestConfig = {
    method: 'post',
    url: `${API_ROUTES.v1.REGISTRATION.APPLICATION}/${applicationId}/schedule`,
    data: { scheduleSlotId }
  };
  
  return (await axiosRequestWithException<SuccessResponse<{ application: Application, scheduleSlot: any }>>(
    requestConfig,
    () => console.log("Schedule slot assigned successfully")
  )).data;
};

// Get available schedule slots
export const getAvailableScheduleSlots = async (scheduleId?: number): Promise<any[]> => {
  const requestConfig = {
    method: 'get',
    url: API_ROUTES.v1.REGISTRATION.APPLICATION + '/available-slots',
    params: scheduleId ? { scheduleId } : undefined
  };
  
  return (await axiosRequestWithException<SuccessResponse<{ slots: any[] }>>(
    requestConfig,
    () => console.log("Available schedule slots retrieved successfully")
  )).data.slots;
};

// Get applications by filter
export const getApplications = async (
  filter: {
    status?: string;
    isEligible?: boolean;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }
): Promise<{ applications: Application[], total: number, page: number, totalPages: number }> => {
  const requestConfig = {
    method: 'get',
    url: API_ROUTES.v1.REGISTRATION.APPLICATION,
    params: filter
  };
  
  return (await axiosRequestWithException<SuccessResponse<{
    applications: Application[];
    total: number;
    page: number;
    totalPages: number;
  }>>(
    requestConfig,
    () => console.log("Applications retrieved successfully")
  )).data;
};
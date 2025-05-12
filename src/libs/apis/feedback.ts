import { API_ROUTES } from "@/constants/path";
import { Pagination, SuccessResponse } from "@/types/api/response";
import { axiosRequestWithException } from "@lib/apis/base";

// Feedback interfaces
export interface Feedback {
  id?: number;
  type: 'error' | 'suggestion' | 'other';
  content: string;
  needSupport: boolean;
  needCallback: boolean;
  isUrgent: boolean;
  status: 'pending' | 'resolved';
  createdAt?: string;
  updatedAt?: string;
}

// Create feedback DTO
export interface CreateFeedbackDto {
  type: 'error' | 'suggestion' | 'other' | 'missing';
  content: string;
  needSupport: boolean;
  needCallback: boolean;
  isUrgent: boolean;
}

// Submit feedback
export const submitFeedback = async (data: CreateFeedbackDto): Promise<Feedback> => {
  const requestConfig = {
    method: 'post',
    url: '/feedback',
    data,
  };

  return (await axiosRequestWithException<SuccessResponse<Feedback>>(
    requestConfig,
    () => console.log("Feedback submitted successfully")
  )).data;
};

// Get all feedback
export const getFeedbackList = async (filters?: {
  type?: 'error' | 'suggestion' | 'other';
  status?: 'pending' | 'resolved';
  isUrgent?: boolean;
  needCallback?: boolean;
}): Promise<Pagination<Feedback>> => {
  const requestConfig = {
    method: 'get',
    url: '/feedback',
    params: filters,
  };

  return (await axiosRequestWithException<SuccessResponse<Pagination<Feedback>>>(
    requestConfig,
    () => console.log("Feedback list fetched successfully")
  )).data;
};

// Update feedback status
export const updateFeedbackStatus = async (
  id: number, 
  status: 'pending' | 'resolved'
): Promise<Feedback> => {
  const requestConfig = {
    method: 'patch',
    url: `/feedback/${id}/status`,
    data: { status },
  };

  return (await axiosRequestWithException<SuccessResponse<Feedback>>(
    requestConfig,
    () => console.log("Feedback status updated successfully")
  )).data;
}; 
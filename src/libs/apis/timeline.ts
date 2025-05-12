import { API_ROUTES } from "@/constants/path";
import { SuccessResponse } from "@/types/api/response";
import { axiosRequestWithException } from "@lib/apis/base";

// Timeline item interface
export interface TimelineItem {
  id?: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  color: string;
  alert: {
    title: string;
    content: string;
    type: 'info' | 'warning';
  };
  links: Array<{
    text: string;
    url: string;
  }>;
  hidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// DTO for creating a timeline item
export interface CreateTimelineItemDto extends Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt'> {}

// DTO for updating a timeline item
export interface UpdateTimelineItemDto extends Partial<Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt'>> {}

// DTO for querying timeline items
export interface TimelineQueryDto {
  status?: 'active' | 'upcoming' | 'completed';
  hidden?: boolean;
  limit?: number;
  offset?: number;
}

// DTO for bulk operations response
export interface BulkOperationResponse {
  success: boolean;
  count: number;
  items: TimelineItem[];
}

// Retrieve all timeline items with optional filtering
export const getAllTimelineItems = async (query?: TimelineQueryDto): Promise<TimelineItem[]> => {
  const requestConfig = {
    method: 'get',
    url: API_ROUTES.v1.TIMELINE.LIST,
    params: query || {},
  };

  return (await axiosRequestWithException<SuccessResponse<{ items: TimelineItem[] }>>(
    requestConfig,
    () => console.log("Timeline items fetched successfully")
  )).data.items;
};

// Get a timeline item by ID
export const getTimelineItemById = async (id: number): Promise<TimelineItem> => {
  const requestConfig = {
    method: 'get',
    url: `${API_ROUTES.v1.TIMELINE.ITEM}/${id}`,
  };

  return (await axiosRequestWithException<SuccessResponse<{ item: TimelineItem }>>(
    requestConfig,
    () => console.log("Timeline item fetched successfully")
  )).data.item;
};

// Create a new timeline item
export const createTimelineItem = async (data: CreateTimelineItemDto): Promise<TimelineItem> => {
  const requestConfig = {
    method: 'post',
    url: API_ROUTES.v1.TIMELINE.ITEM,
    data,
  };

  return (await axiosRequestWithException<SuccessResponse<{ item: TimelineItem }>>(
    requestConfig,
    () => console.log("Timeline item created successfully")
  )).data.item;
};

// Update an existing timeline item
export const updateTimelineItem = async (id: number, data: UpdateTimelineItemDto): Promise<TimelineItem> => {
  const requestConfig = {
    method: 'patch',
    url: `${API_ROUTES.v1.TIMELINE.ITEM}/${id}`,
    data,
  };

  return (await axiosRequestWithException<SuccessResponse<{ item: TimelineItem }>>(
    requestConfig,
    () => console.log("Timeline item updated successfully")
  )).data.item;
};

// Delete a timeline item
export const deleteTimelineItem = async (id: number): Promise<boolean> => {
  const requestConfig = {
    method: 'delete',
    url: `${API_ROUTES.v1.TIMELINE.ITEM}/${id}`,
  };

  return (await axiosRequestWithException<SuccessResponse<{ success: boolean }>>(
    requestConfig,
    () => console.log("Timeline item deleted successfully")
  )).data.success;
};

// Toggle timeline item visibility
export const toggleTimelineItemVisibility = async (id: number, hidden: boolean): Promise<TimelineItem> => {
  const requestConfig = {
    method: 'patch',
    url: `${API_ROUTES.v1.TIMELINE.ITEM}/${id}/visibility`,
    data: { hidden },
  };

  return (await axiosRequestWithException<SuccessResponse<{ item: TimelineItem }>>(
    requestConfig,
    () => console.log(`Timeline item ${hidden ? 'hidden' : 'shown'} successfully`)
  )).data.item;
};

// Import timeline items from JSON
export const importTimelineItems = async (items: CreateTimelineItemDto[]): Promise<BulkOperationResponse> => {
  const requestConfig = {
    method: 'post',
    url: API_ROUTES.v1.TIMELINE.IMPORT,
    data: { items },
  };

  return (await axiosRequestWithException<SuccessResponse<BulkOperationResponse>>(
    requestConfig,
    () => console.log("Timeline items imported successfully")
  )).data;
};

// Export timeline items to JSON
export const exportTimelineItems = async (query?: TimelineQueryDto): Promise<TimelineItem[]> => {
  const requestConfig = {
    method: 'get',
    url: API_ROUTES.v1.TIMELINE.EXPORT,
    params: query || {},
  };

  return (await axiosRequestWithException<SuccessResponse<{ items: TimelineItem[] }>>(
    requestConfig,
    () => console.log("Timeline items exported successfully")
  )).data.items;
};

// Reorder timeline items
export const reorderTimelineItems = async (itemIds: number[]): Promise<boolean> => {
  const requestConfig = {
    method: 'post',
    url: API_ROUTES.v1.TIMELINE.REORDER,
    data: { itemIds },
  };

  return (await axiosRequestWithException<SuccessResponse<{ success: boolean }>>(
    requestConfig,
    () => console.log("Timeline items reordered successfully")
  )).data.success;
};

// Batch update timeline items (update multiple items at once)
export const batchUpdateTimelineItems = async (
  updates: Array<{ id: number; data: UpdateTimelineItemDto }>
): Promise<BulkOperationResponse> => {
  const requestConfig = {
    method: 'patch',
    url: API_ROUTES.v1.TIMELINE.BATCH,
    data: { updates },
  };

  return (await axiosRequestWithException<SuccessResponse<BulkOperationResponse>>(
    requestConfig,
    () => console.log("Timeline items batch updated successfully")
  )).data;
};

// Get public timeline items
export const getPublicTimelineItems = async (): Promise<TimelineItem[]> => {
  const requestConfig = {
    method: 'get',
    url: API_ROUTES.v1.TIMELINE.PUBLIC,
  };

  return (await axiosRequestWithException<SuccessResponse<{ items: TimelineItem[] }>>(
    requestConfig,
    () => console.log("Public timeline items fetched successfully")
  )).data.items;
}; 
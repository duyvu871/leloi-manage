// Timeline Item interface
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

// Request DTOs

// DTO for querying timeline items
export interface TimelineQueryDto {
  status?: 'active' | 'upcoming' | 'completed';
  hidden?: boolean;
  limit?: number;
  offset?: number;
}

// DTO for creating a timeline item
export interface CreateTimelineItemDto extends Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt'> {}

// DTO for updating a timeline item
export interface UpdateTimelineItemDto extends Partial<Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt'>> {}

// DTO for toggling visibility
export interface ToggleVisibilityDto {
  hidden: boolean;
}

// DTO for reordering timeline items
export interface ReorderTimelineItemsDto {
  itemIds: number[];
}

// DTO for batch updating timeline items
export interface BatchUpdateTimelineItemsDto {
  updates: Array<{
    id: number;
    data: UpdateTimelineItemDto;
  }>;
}

// DTO for importing timeline items
export interface ImportTimelineItemsDto {
  items: CreateTimelineItemDto[];
}

// Response DTOs

// DTO for timeline item response
export interface TimelineItemResponseDto extends TimelineItem {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// DTO for timeline list response
export interface TimelineListResponseDto {
  items: TimelineItemResponseDto[];
  total: number;
}

// DTO for bulk operation response
export interface BulkOperationResponseDto {
  success: boolean;
  count: number;
  items: TimelineItemResponseDto[];
}

// Common response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any[];
} 
import { z } from 'zod';

// Alert schema
const alertSchema = z.object({
  title: z.string().min(1, { message: 'Alert title is required' }).max(100),
  content: z.string().min(1, { message: 'Alert content is required' }).max(500),
  type: z.enum(['info', 'warning'], { 
    required_error: 'Alert type is required',
    invalid_type_error: 'Alert type must be either "info" or "warning"'
  })
});

// Link schema
const linkSchema = z.object({
  text: z.string().min(1, { message: 'Link text is required' }).max(100),
  url: z.string().url({ message: 'Invalid URL format' })
});

// Base timeline item schema
export const timelineItemSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(200),
  startDate: z.string().datetime({
    message: 'Start date must be a valid date'
  }),
  type: z.enum(['registration', 'competition', 'other'], { 
    required_error: 'Type is required',
    invalid_type_error: 'Type must be either "registration", "competition", or "other"'
  }),
  endDate: z.string().datetime({
    message: 'End date must be a valid date'
  }),
  description: z.string().max(1000, { message: 'Description must be at most 1000 characters' }),
  status: z.enum(['active', 'upcoming', 'completed'], { 
    required_error: 'Status is required',
    invalid_type_error: 'Status must be either "active", "upcoming", or "completed"'
  }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { 
    message: 'Color must be a valid hex color code (e.g., #FF5733)' 
  }),
  alert: alertSchema,
  links: z.array(linkSchema).max(5, { message: 'Maximum 5 links allowed' }),
  hidden: z.boolean().optional().default(false)
});

// Schema for creating a timeline item
export const createTimelineItemSchema = timelineItemSchema;

// Schema for updating a timeline item
export const updateTimelineItemSchema = timelineItemSchema.partial();

// Schema for toggling visibility
export const toggleVisibilitySchema = z.object({
  hidden: z.boolean({ 
    required_error: 'Hidden flag is required',
    invalid_type_error: 'Hidden must be a boolean value'
  })
});

// Schema for reordering timeline items
export const reorderTimelineItemsSchema = z.object({
  itemIds: z.array(z.number().int().positive(), { 
    required_error: 'Item IDs are required',
    invalid_type_error: 'Item IDs must be an array of positive integers'
  })
    .min(1, { message: 'At least one item ID is required' })
});

// Schema for batch updates
export const batchUpdateTimelineItemsSchema = z.object({
  updates: z.array(z.object({
    id: z.number().int().positive({ message: 'Item ID must be a positive integer' }),
    data: updateTimelineItemSchema
  }))
    .min(1, { message: 'At least one update is required' })
    .max(50, { message: 'Maximum 50 updates allowed in a single batch' })
});

// Schema for importing timeline items
export const importTimelineItemsSchema = z.object({
  items: z.array(createTimelineItemSchema)
    .min(1, { message: 'At least one item is required' })
    .max(100, { message: 'Maximum 100 items allowed in a single import' })
});

// Schema for querying timeline items
export const timelineQuerySchema = z.object({
  status: z.enum(['active', 'upcoming', 'completed']).optional(),
  hidden: z.boolean().optional(),
  limit: z.number().int().positive().max(100).optional().default(10),
  offset: z.number().int().nonnegative().optional().default(0)
}); 
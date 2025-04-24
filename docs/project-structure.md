# Cấu trúc dự án hệ thống quản lý tuyển sinh

## Cấu trúc thư mục

Dự án sẽ được tổ chức theo cấu trúc App Router của Next.js 14, với các thành phần được phân chia rõ ràng để dễ quản lý và mở rộng.

```
/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/             # Authentication API
│   │   ├── students/         # Student API
│   │   ├── documents/        # Document upload API
│   │   └── schedules/        # Schedule API
│   ├── auth/                 # Authentication pages
│   │   ├── login/            # Login page
│   │   └── register/         # Register page
│   ├── dashboard/            # Dashboard pages
│   │   ├── parent/           # Parent dashboard
│   │   │   ├── registration/ # Registration form
│   │   │   ├── documents/    # Document upload
│   │   │   └── status/       # Application status
│   │   └── manager/          # Manager dashboard
│   │       ├── students/     # Student list
│   │       ├── schedules/    # Schedule management
│   │       ├── pending/      # Pending applications
│   │       └── confirmation/ # Confirmation page
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # Shared components
│   ├── ui/                   # UI components (shadcn)
│   ├── forms/                # Form components
│   │   ├── registration/     # Registration form components
│   │   ├── document-upload/  # Document upload components
│   │   └── confirmation/     # Confirmation form components
│   ├── dashboard/            # Dashboard components
│   │   ├── parent/           # Parent dashboard components
│   │   └── manager/          # Manager dashboard components
│   └── shared/               # Shared components
│       ├── header/           # Header components
│       ├── sidebar/          # Sidebar components
│       └── layout/           # Layout components
├── lib/                      # Utility functions
│   ├── api/                  # API utilities
│   │   ├── client.ts         # Axios client setup
│   │   ├── student-service.ts # Student API service
│   │   ├── document-service.ts # Document API service
│   │   └── schedule-service.ts # Schedule API service
│   ├── auth/                 # Auth utilities
│   │   ├── session.ts        # Session management
│   │   └── permissions.ts    # Permission checking
│   ├── pdf/                  # PDF processing utilities
│   │   ├── extract-data.ts   # Extract data from PDF
│   │   └── preview.ts        # PDF preview utilities
│   └── validators/           # Zod schemas
│       ├── registration.ts   # Registration form schemas
│       ├── document-upload.ts # Document upload schemas
│       └── schedule.ts       # Schedule form schemas
├── store/                    # Jotai store
│   ├── auth.ts               # Authentication store
│   ├── registration.ts       # Registration form store
│   ├── documents.ts          # Document upload store
│   └── application.ts        # Application status store
├── types/                    # TypeScript types
│   ├── student.ts            # Student types
│   ├── parent.ts             # Parent types
│   ├── document.ts           # Document types
│   ├── application.ts        # Application types
│   └── schedule.ts           # Schedule types
├── mock/                     # Mock API data
│   ├── data/                 # Mock data
│   │   ├── students.ts       # Student mock data
│   │   ├── applications.ts   # Application mock data
│   │   └── schedules.ts      # Schedule mock data
│   └── handlers/             # Mock API handlers
│       ├── student-handlers.ts # Student API handlers
│       ├── document-handlers.ts # Document API handlers
│       └── schedule-handlers.ts # Schedule API handlers
├── public/                   # Static assets
│   ├── images/               # Images
│   ├── fonts/                # Fonts
│   └── favicon.ico           # Favicon
├── styles/                   # Global styles
│   └── theme.ts              # Theme configuration
├── middleware.ts             # Next.js middleware
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Chi tiết các thành phần

### 1. Các Schema và Types

#### Student Type
```typescript
// types/student.ts
export interface Student {
  id: string;
  name: string;
  dob: string;
  gender: 'male' | 'female';
  address: string;
  currentSchool: {
    name: string;
    address: string;
  };
}
```

#### Parent Type
```typescript
// types/parent.ts
export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
}
```

#### Document Type
```typescript
// types/document.ts
export interface Document {
  id: string;
  studentId: string;
  type: 'transcript' | 'certificate' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  extractedData?: any;
}

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
```

#### Application Type
```typescript
// types/application.ts
export type ApplicationStatus = 'pending' | 'eligible' | 'ineligible' | 'confirmed';

export interface Application {
  id: string;
  studentId: string;
  parentId: string;
  status: ApplicationStatus;
  reason?: string;
  lastUpdated: string;
  examInfo?: {
    sbd: string;
    room: string;
    date: string;
    time: string;
  };
  documents: Document[];
}
```

#### Schedule Type
```typescript
// types/schedule.ts
export interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  currentAppointments: number;
  location: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  scheduleId: string;
  studentId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

### 2. Zod Schemas

#### Registration Schema
```typescript
// lib/validators/registration.ts
import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(1, 'Họ và tên không được để trống'),
  dob: z.string().min(1, 'Ngày sinh không được để trống'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính' }),
  }),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  currentSchool: z.object({
    name: z.string().min(1, 'Tên trường không được để trống'),
    address: z.string().min(1, 'Địa chỉ trường không được để trống'),
  }),
});

export const parentSchema = z.object({
  name: z.string().min(1, 'Họ và tên không được để trống'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  relationship: z.enum(['father', 'mother', 'guardian', 'other'], {
    errorMap: () => ({ message: 'Vui lòng chọn mối quan hệ' }),
  }),
});

export const registrationSchema = z.object({
  student: studentSchema,
  parent: parentSchema,
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
```

#### Document Upload Schema
```typescript
// lib/validators/document-upload.ts
import { z } from 'zod';

export const documentUploadSchema = z.object({
  type: z.enum(['transcript', 'certificate', 'other'], {
    errorMap: () => ({ message: 'Vui lòng chọn loại tài liệu' }),
  }),
  file: z.instanceof(File, { message: 'Vui lòng chọn file' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'File không được vượt quá 5MB')
    .refine(file => ['application/pdf'].includes(file.type), 'Chỉ chấp nhận file PDF'),
});

export type DocumentUploadValues = z.infer<typeof documentUploadSchema>;
```

### 3. API Services

#### Axios Client Setup
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Student Service
```typescript
// lib/api/student-service.ts
import apiClient from './client';
import { Student } from '@/types/student';
import { Application } from '@/types/application';

export const studentService = {
  // Get all students
  getStudents: async () => {
    const response = await apiClient.get<Student[]>('/students');
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id: string) => {
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },

  // Create new student
  createStudent: async (student: Omit<Student, 'id'>) => {
    const response = await apiClient.post<Student>('/students', student);
    return response.data;
  },

  // Update student
  updateStudent: async (id: string, student: Partial<Student>) => {
    const response = await apiClient.put<Student>(`/students/${id}`, student);
    return response.data;
  },

  // Get student application
  getStudentApplication: async (id: string) => {
    const response = await apiClient.get<Application>(`/students/${id}/application`);
    return response.data;
  },
};
```

### 4. Jotai Store

#### Authentication Store
```typescript
// store/auth.ts
import { atom } from 'jotai';

type UserRole = 'parent' | 'manager';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isLoadingAtom = atom<boolean>(true);

// Derived atoms
export const isParentAtom = atom<boolean>(
  (get) => get(userAtom)?.role === 'parent'
);

export const isManagerAtom = atom<boolean>(
  (get) => get(userAtom)?.role === 'manager'
);
```

#### Registration Form Store
```typescript
// store/registration.ts
import { atom } from 'jotai';
import { RegistrationFormValues } from '@/lib/validators/registration';

// Initial empty form state
const initialRegistrationForm: RegistrationFormValues = {
  student: {
    name: '',
    dob: '',
    gender: 'male',
    address: '',
    currentSchool: {
      name: '',
      address: '',
    },
  },
  parent: {
    name: '',
    phone: '',
    email: '',
    relationship: 'father',
  },
};

export const registrationFormAtom = atom<RegistrationFormValues>(initialRegistrationForm);
export const isRegistrationSubmittedAtom = atom<boolean>(false);
```

### 5. React Components

#### Registration Form Component
```tsx
// components/forms/registration/RegistrationForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { registrationSchema, RegistrationFormValues } from '@/lib/validators/registration';
import { registrationFormAtom, isRegistrationSubmittedAtom } from '@/store/registration';
import { studentService } from '@/lib/api/student-service';

export function RegistrationForm() {
  const [formData, setFormData] = useAtom(registrationFormAtom);
  const [, setIsSubmitted] = useAtom(isRegistrationSubmittedAtom);
  const router = useRouter();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: formData,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RegistrationFormValues) => {
      // Create student first
      const student = await studentService.createStudent(data.student);
      // Then create parent and link to student
      // This is simplified, in a real app you'd handle this differently
      return student;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      router.push('/dashboard/parent/documents');
    },
  });

  function onSubmit(data: RegistrationFormValues) {
    setFormData(data);
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin học sinh</h3>
            
            <FormField
              control={form.control}
              name="student.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên học sinh <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên học sinh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="student.dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="student.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính <span className="text-red-500">*</span></FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="student.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập địa chỉ" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="student.currentSchool.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trường hiện tại <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên trường" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="student.currentSchool.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ trường <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ trường" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Parent Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin phụ huynh</h3>
            
            <FormField
              control={form.control}
              name="parent.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên phụ huynh <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên phụ huynh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parent.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parent.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parent.relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mối quan hệ với học sinh <span className="text-red-500">*</span></FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mối quan hệ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="father">Cha</SelectItem>
                      <SelectItem value="mother">Mẹ</SelectItem>
                      <SelectItem value="guardian">Người giám hộ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Đang xử lý...' : 'Lưu thông tin'}
        </Button>
      </form>
    </Form>
  );
}
```

#### Document Upload Component
```tsx
// components/forms/document-upload/DocumentUploadForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

import { documentUploadSchema, DocumentUploadValues } from '@/lib/validators/document-upload';
import { documentService } from '@/lib/api/document-service';

export function DocumentUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const form = useForm<DocumentUploadValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      type: 'transcript',
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        form.setValue('file', selectedFile);
        
        // Create a preview URL
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: DocumentUploadValues) => {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('file', data.file);
      
      return documentService.uploadDocument(formData);
    },
    onSuccess: () => {
      form.reset();
      setFile(null);
      setPreview(null);
      // Show success message or redirect
    },
  });

  function onSubmit(data: DocumentUploadValues) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại tài liệu <span className="text-red-500">*</span></FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="transcript">Học bạ</SelectItem>
                  <SelectItem value="certificate">Chứng chỉ/Giấy khen</SelectItem>
                  <SelectItem value="other">Tài liệu khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Tải lên tài liệu <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div 
                  {...getRootProps()} 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="text-sm">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500">Kéo thả file vào đây hoặc click để chọn file</p>
                      <p className="text-xs text-gray-400 mt-1">Chỉ chấp nhận file PDF, tối đa 5MB</p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {preview && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Xem trước tài liệu</h4>
              <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden">
                <iframe 
                  src={preview} 
                  className="w-full h-full" 
                  title="PDF Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        <Button type="submit" className="w-full" disabled={isPending || !file}>
          {isPending ? 'Đang tải lên...' : 'Tải lên'}
        </Button>
      </form>
    </Form>
  );
}
```

#### Student Table Component
```tsx
// components/dashboard/manager/StudentTable.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody
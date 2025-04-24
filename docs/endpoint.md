# API Endpoints Documentation

## Overview
This document provides a comprehensive list of API endpoints for the Le Loi school application system. The endpoints are organized by functionality to help frontend developers understand the available backend services.

## Base URL Structure
All API endpoints follow this structure:
```
{BASE_URL}/api/{VERSION}/{SERVICE}/{ENDPOINT}
```

## API Routes

### Authentication APIs
- **Login**: `POST /api/v1/auth/login`
- **Register**: `POST /api/v1/auth/register`
- **Refresh Token**: `POST /api/v1/auth/refresh-token`
- **Logout**: `POST /api/v1/auth/logout`
- **Reset Password Request**: `POST /api/v1/auth/reset-password-request`
- **Reset Password**: `POST /api/v1/auth/reset-password`
- **Verify Email**: `POST /api/v1/auth/verify-email`

### Registration APIs
- **Create Application**: `POST /api/v1/registration/application`
- **Get Application**: `GET /api/v1/registration/application/{applicationId}`
- **Update Application**: `PUT /api/v1/registration/application/{applicationId}`
- **Delete Application**: `DELETE /api/v1/registration/application/{applicationId}`
- **Submit Application**: `POST /api/v1/registration/application/{applicationId}/submit`
- **Get Application Status**: `GET /api/v1/registration/application/{applicationId}/status`

### Document Management APIs
- **Upload Document**: `POST /api/v1/registration/document-upload`
- **Get Document**: `GET /api/v1/registration/document-upload/{documentId}`
- **Delete Document**: `DELETE /api/v1/registration/document-upload/{documentId}`
- **Get Application Documents**: `GET /api/v1/registration/application/{applicationId}/documents`
- **Get Extracted Data**: `GET /api/v1/registration/document-upload/{documentId}/extracted-data`
- **Verify Extracted Data**: `PATCH /api/v1/registration/document-upload/extracted-data/{extractedDataId}`

### Student APIs
- **Get Student Profile**: `GET /api/v1/student/{studentId}`
- **Update Student Profile**: `PUT /api/v1/student/{studentId}`
- **Get Student Documents**: `GET /api/v1/student/{studentId}/documents`
- **Get Student Academic Records**: `GET /api/v1/student/{studentId}/academic-records`

### Parent APIs
- **Get Parent Profile**: `GET /api/v1/parent/{parentId}`
- **Update Parent Profile**: `PUT /api/v1/parent/{parentId}`
- **Get Parent's Students**: `GET /api/v1/parent/{parentId}/students`

### Admin APIs
- **Get Applications List**: `GET /api/v1/admin/applications`
- **Review Application**: `PATCH /api/v1/admin/applications/{applicationId}/review`
- **Get Application Statistics**: `GET /api/v1/admin/statistics/applications`
- **Manage Users**: `GET /api/v1/admin/users`
- **Create User**: `POST /api/v1/admin/users`
- **Update User**: `PUT /api/v1/admin/users/{userId}`
- **Delete User**: `DELETE /api/v1/admin/users/{userId}`

### Points Calculation APIs
- **Calculate Points**: `POST /api/v1/points/calculate`
- **Get Point Criteria**: `GET /api/v1/points/criteria`
- **Update Point Criteria**: `PUT /api/v1/points/criteria`

### Notifications APIs
- **Get User Notifications**: `GET /api/v1/notifications`
- **Mark Notification as Read**: `PATCH /api/v1/notifications/{notificationId}`
- **Send Notification**: `POST /api/v1/notifications/send`

## Data Transfer Objects (DTOs)

### Authentication DTOs
```typescript
// Login Request
interface LoginRequest {
  email: string;
  password: string;
}

// Login Response
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Register Request
interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: UserRole;
}
```

### Application DTOs
```typescript
// Application Request
interface ApplicationRequest {
  studentInfo: StudentInfo;
  parentInfo: ParentInfo;
  addressInfo: AddressInfo;
  priority?: PriorityInfo;
}

// Application Response
interface ApplicationResponse {
  id: string;
  status: ApplicationStatus;
  studentInfo: StudentInfo;
  parentInfo: ParentInfo;
  addressInfo: AddressInfo;
  priority?: PriorityInfo;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}
```

### Document DTOs
```typescript
// Document Upload Request
interface DocumentUploadRequest {
  file: File;
  type: DocumentType;
  applicationId: string;
}

// Document Upload Response
interface DocumentUploadResponse {
  document: Document;
  extractedData?: ExtractedData;
}

// Document
interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  applicationId: string;
}

// Extracted Data
interface ExtractedData {
  id: string;
  documentId: string;
  data: Record<string, any>; // Depends on document type
  isVerified: boolean;
  verifiedAt?: string;
}
```

### Student DTOs
```typescript
// Student Info
interface StudentInfo {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  placeOfBirth: string;
  ethnicity: string;
  nationalId?: string;
  schoolName: string;
  schoolDistrict: string;
  schoolProvince: string;
  academicAchievements?: AcademicAchievement[];
}

// Academic Achievement
interface AcademicAchievement {
  type: AchievementType;
  level: AchievementLevel;
  description: string;
  year: string;
  certificateDocumentId?: string;
}
```

### Parent DTOs
```typescript
// Parent Info
interface ParentInfo {
  fullName: string;
  relationship: ParentRelationship;
  phoneNumber: string;
  email?: string;
  occupation?: string;
  workPlace?: string;
  emergencyContact?: string;
}
```

### Address DTOs
```typescript
// Address Info
interface AddressInfo {
  province: string;
  district: string;
  ward: string;
  street: string;
  houseNumber: string;
  fullAddress: string;
}
```

### Points Calculation DTOs
```typescript
// Points Calculation Request
interface PointsCalculationRequest {
  academicResults: AcademicResult[];
  competitionResults?: CompetitionResult[];
  priorityPoints?: PriorityPoint[];
}

// Points Calculation Response
interface PointsCalculationResponse {
  totalPoints: number;
  breakdown: {
    academicPoints: number;
    competitionPoints: number;
    priorityPoints: number;
  };
  details: PointsDetail[];
}
```

## Response Structure
All API responses follow a consistent structure:

```typescript
// Success Response
interface SuccessResponse<T> {
  status: 'success';
  data: T;
  message?: string;
}

// Error Response
interface ErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## HTTP Status Codes
- **200**: OK - The request was successful
- **201**: Created - A new resource was created
- **400**: Bad Request - The request was invalid
- **401**: Unauthorized - The user is not authenticated
- **403**: Forbidden - The user does not have permission
- **404**: Not Found - The resource was not found
- **422**: Unprocessable Entity - Validation errors
- **500**: Internal Server Error - Server-side error
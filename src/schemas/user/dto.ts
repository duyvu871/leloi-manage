// schemas/user/dto.ts
import { z } from "zod";
import {
    userSchema,
    parentUserSchema,
    managerUserSchema,
    loginSchema,
    registerSchema,
    studentSchema
} from "./schema";

// Base types from schemas
export type User = z.infer<typeof userSchema>;
export type ParentUser = z.infer<typeof parentUserSchema>;
export type ManagerUser = z.infer<typeof managerUserSchema>;
export type Student = z.infer<typeof studentSchema>

// Registration DTOs
export type RegisterParentDto = {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    relationship: 'father' | 'mother' | 'guardian';
    student?: Student;
};

export type RegisterManagerDto = {
    name: string;
    email: string;
    phone: string;
    password: string;
    permissions: Array<
        | 'manage_applications'
        | 'manage_schedules'
        | 'manage_users'
        | 'send_notifications'
        | 'view_reports'
        | 'approve_applications'
    >;
};

// Authentication DTOs
export type AuthCredentialSchema = {
    email: string;
    password: string;
};

// Login DTO
export type LoginDto = z.infer<typeof loginSchema>;

// Response DTOs
export type UserResponse = Omit<User, 'password'>;
export type AuthResponse = {
    user: UserResponse;
    token: string;
    refresh_token?: string;
    expire_access_token?: number;
    expire_refresh_token?: number;
};

// Update DTOs
export type UpdateParentDto = Partial<
    Omit<ParentUser, 'id' | 'role' | 'password' | 'isActive' | 'lastLogin' | 'lastUpdated'>
>;

export type UpdateManagerDto = Partial<
    Omit<ManagerUser, 'id' | 'role' | 'password' | 'isActive' | 'lastLogin' | 'lastUpdated'>
>;

// Document Upload DTOs
export type UploadDocumentDto = {
    type: 'transcript' | 'certificate';
    file: File;
    studentId: string;
};


// For compatibility with existing authentication system
export type RegisterUserDto = RegisterParentDto | RegisterManagerDto;


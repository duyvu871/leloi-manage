'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useRegistration } from '@/hooks/client/use-registration';
import { RegistrationFormData } from '@/schemas/registration/dto';
import { Student, ParentInfo, Commitment, PriorityPoint } from '@/types/registration';
import { CompetitionResult } from '@/types/points';

// Define the type for our registration context
interface RegistrationContextType {
  // State
  currentStudent: Student | null;
  parentInfo: ParentInfo | null;
  commitment: Commitment | null;
  priorityPoint: PriorityPoint | null;
  competitionResults: CompetitionResult[];
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  draftExists: boolean;
  
  // Actions
  submitRegistration: (formData: RegistrationFormData) => Promise<void>;
  updateRegistration: (studentId: number, updates: any) => Promise<void>;
  loadRegistrationData: (studentId: number) => Promise<void>;
  uploadDocument: (applicationId: number, file: File, type: string) => Promise<number | null>;
  saveDraft: (data: RegistrationFormData) => void;
  loadDraft: () => RegistrationFormData | null;
  clearDraft: () => void;
  resetRegistration: () => void;
}

// Create context with a default undefined value
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Provider component
export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const registration = useRegistration();
  
  return (
    <RegistrationContext.Provider value={registration}>
      {children}
    </RegistrationContext.Provider>
  );
};

// Custom hook to use the registration context
export const useRegistrationContext = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  
  if (context === undefined) {
    throw new Error('useRegistrationContext must be used within a RegistrationProvider');
  }
  
  return context;
};
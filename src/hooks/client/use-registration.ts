import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  currentStudentAtom,
  parentInfoAtom,
  commitmentAtom,
  priorityPointAtom,
  competitionResultsAtom,
  isRegistrationSubmittingAtom,
  registrationSuccessAtom,
  registrationErrorAtom,
  resetRegistrationAtom
} from '@/stores/registration';

import { userAtom } from '@/stores/user';
import { convertFormToDbDtos, RegistrationFormData } from '@/schemas/registration/dto';
import { STORAGE_KEYS } from '@/constants/storage';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem } from '@/utils/localstorage';
import * as registrationApi from '@/libs/apis/registration';
import useToast from './use-toast-notification';

export const useRegistration = () => {
  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useToast();
  // Store state atoms
  const [user] = useAtom(userAtom);
  const [currentStudent, setCurrentStudent] = useAtom(currentStudentAtom);
  const [parentInfo, setParentInfo] = useAtom(parentInfoAtom);
  const [commitment, setCommitment] = useAtom(commitmentAtom);
  const [priorityPoint, setPriorityPoint] = useAtom(priorityPointAtom);
  const [competitionResults, setCompetitionResults] = useAtom(competitionResultsAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isRegistrationSubmittingAtom);
  const [isSuccess, setIsSuccess] = useAtom(registrationSuccessAtom);
  const [error, setError] = useAtom(registrationErrorAtom);
  const [_, resetRegistration] = useAtom(resetRegistrationAtom);

  // Local state
  const [draftExists, setDraftExists] = useState(false);

  // Load draft from local storage on mount
  useEffect(() => {
    const draft = getLocalStorageItem<RegistrationFormData>(STORAGE_KEYS.REGISTRATION_FORM_DRAFT);
    if (draft) {
      setDraftExists(true);
    }
  }, []);

  // Save form data as draft
  const saveDraft = (data: RegistrationFormData) => {
    setLocalStorageItem(STORAGE_KEYS.REGISTRATION_FORM_DRAFT, data);
    setDraftExists(true);
    showSuccessToast('Dữ liệu đã được lưu tạm thời.');
  };

  // Load draft data
  const loadDraft = (): RegistrationFormData | null => {
    return getLocalStorageItem<RegistrationFormData>(STORAGE_KEYS.REGISTRATION_FORM_DRAFT);
  };

  // Clear draft data
  const clearDraft = () => {
    removeLocalStorageItem(STORAGE_KEYS.REGISTRATION_FORM_DRAFT);
    setDraftExists(false);
  };

  // Submit registration form
  const submitRegistration = async (formData: RegistrationFormData) => {
    if (!user) {
      showErrorToast('Bạn cần đăng nhập để đăng ký.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit the entire form at once using our API
      const result = await registrationApi.submitRegistration(formData, user.id);

      setIsSuccess(true);
      // setCurrentStudent(result.student);
      // setParentInfo(result.parentInfo);

      // if (result.commitment) {
      //   setCommitment(result.commitment);
      // }

      // if (result.priorityPoint) {
      //   setPriorityPoint(result.priorityPoint);
      // }

      // if (result.competitionResults) {
      //   setCompetitionResults(result.competitionResults);
      // }

      // Clear draft after successful submission
      clearDraft();

      // Show success message
      showSuccessToast('Đăng ký thành công!');

      // Redirect to status page
      // router.push('/dashboard/status');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký.');
      showErrorToast(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update registration information
  const updateRegistration = async (studentId: number, updates: any) => {
    if (!user) {
      showErrorToast('Bạn cần đăng nhập để cập nhật thông tin.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await registrationApi.updateRegistration(studentId, updates);

      // Update local state
      setCurrentStudent(result.student);
      setParentInfo(result.parentInfo);

      if (result.commitment) {
        setCommitment(result.commitment);
      }

      if (result.priorityPoint) {
        // setPriorityPoint(result.priorityPoint);
      }

      if (result.competitionResults) {
        // setCompetitionResults(result.competitionResults);
      }

      showSuccessToast('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thông tin.');
      showErrorToast(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load registration data for a student
  const loadRegistrationData = async (studentId: number) => {
    if (!user) {
      showErrorToast('Bạn cần đăng nhập để xem thông tin đăng ký.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await registrationApi.getRegistrationByStudentId(studentId);

      // Update local state
      setCurrentStudent(result.student);
      setParentInfo(result.parentInfo);

      if (result.commitment) {
        setCommitment(result.commitment);
      }

      if (result.priorityPoint) {
        // setPriorityPoint(result.priorityPoint);
      }

      if (result.competitionResults) {
        // setCompetitionResults(result.competitionResults);
      }
    } catch (err) {
      console.error('Load error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu.');
      showErrorToast(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload document
  const uploadDocument = async (applicationId: number, file: File, type: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await registrationApi.uploadDocument(applicationId, file, type);

      showSuccessToast('Tải lên tài liệu thành công!');
      return result.document.id;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải lên tài liệu.');
      showErrorToast(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải lên tài liệu.');
    } finally {
      setIsSubmitting(false);
    }

    return null;
  };

  return {
    // State
    currentStudent,
    parentInfo,
    commitment,
    priorityPoint,
    competitionResults,
    isSubmitting,
    isSuccess,
    error,
    draftExists,

    // Actions
    submitRegistration,
    updateRegistration,
    loadRegistrationData,
    uploadDocument,
    saveDraft,
    loadDraft,
    clearDraft,
    resetRegistration,

    // Utils
    convertFormToDbDtos
  };
};
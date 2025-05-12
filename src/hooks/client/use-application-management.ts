import { useState, useCallback } from 'react';
import * as applicationApi from '@/libs/apis/application';
import { Application } from '@/types/registration';
import { toast } from 'react-toastify';

interface UseApplicationManagementProps {
  applicationId?: number;
}

export const useApplicationManagement = ({ applicationId }: UseApplicationManagementProps = {}) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load application status
  const loadApplicationStatus = useCallback(async (appId?: number) => {
    const targetAppId = appId || applicationId;
    if (!targetAppId) {
      setError('Application ID is required to load status');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await applicationApi.getApplicationStatus(targetAppId);
      console.log(result);
      setApplication(result);
    } catch (err) {
      console.error('Failed to load application status:', err);
      // setError(err instanceof Error ? err.message : 'Failed to load application status');
      // toast.error('Không thể tải thông tin trạng thái hồ sơ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  // Update application status
  const updateStatus = useCallback(async (
    status: 'pending' | 'approved' | 'rejected',
    isEligible?: boolean,
    rejectionReason?: string,
    appId?: number
  ) => {
    const targetAppId = appId || applicationId;
    if (!targetAppId) {
      setError('Application ID is required to update status');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await applicationApi.updateApplicationStatus(
        targetAppId,
        status,
        isEligible,
        rejectionReason
      );

      setApplication(result);
      // toast.success(`Trạng thái hồ sơ đã được cập nhật thành ${status === 'approved' ? 'đã duyệt' :
      //     status === 'rejected' ? 'từ chối' : 'đang xử lý'
      //   }`);

      return result;
    } catch (err) {
      console.error('Failed to update application status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      // toast.error('Không thể cập nhật trạng thái hồ sơ. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  // Load available schedule slots
  const loadAvailableScheduleSlots = useCallback(async (scheduleId?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const slots = await applicationApi.getAvailableScheduleSlots(scheduleId);
      setAvailableSlots(slots);
      return slots;
    } catch (err) {
      console.error('Failed to load available schedule slots:', err);
      setError(err instanceof Error ? err.message : 'Failed to load available schedule slots');
      // toast.error('Không thể tải lịch còn trống. Vui lòng thử lại sau.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Assign schedule slot
  const assignScheduleSlot = useCallback(async (scheduleSlotId: number, appId?: number) => {
    const targetAppId = appId || applicationId;
    if (!targetAppId) {
      setError('Application ID is required to assign schedule');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await applicationApi.assignScheduleSlot(targetAppId, scheduleSlotId);
      setApplication(result.application);
      // toast.success('Đã phân lịch thành công!');
      return result;
    } catch (err) {
      console.error('Failed to assign schedule slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign schedule slot');
      // toast.error('Không thể phân lịch. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  return {
    application,
    availableSlots,
    isLoading,
    error,
    loadApplicationStatus,
    updateStatus,
    loadAvailableScheduleSlots,
    assignScheduleSlot
  };
};
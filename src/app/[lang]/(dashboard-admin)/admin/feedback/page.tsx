'use client';

import RegistrationFormV1 from '@/components/dashboard/registration-form-v1';
import FeedbackManager from '@/components/feedback/FeedbackManager';
import TimelineManager from '@/components/timeline/TimelineManager';
import { RegistrationProvider } from '@/providers/registration-provider';

export default function RegistrationPage() {

  return (
    <FeedbackManager />
  );
}
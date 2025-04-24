'use client';

import RegistrationFormV1 from '@/components/dashboard/registration-form-v1';
import { RegistrationProvider } from '@/providers/registration-provider';

export default function RegistrationPage() {

  return (
    <RegistrationProvider>
      <RegistrationFormV1 />
    </RegistrationProvider>
  );
}
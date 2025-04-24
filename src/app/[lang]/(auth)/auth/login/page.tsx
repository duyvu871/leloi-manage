import React from 'react';
import { Text } from '@mantine/core';
import { UserLoginSection } from '@component/sections/authentication/user-login';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
    return (
        <UserLoginSection />
    );
}
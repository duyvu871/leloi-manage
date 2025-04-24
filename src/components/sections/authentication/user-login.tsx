'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { UserLoginForm } from '@component/forms/user-login-form';
import { useTranslations } from 'next-intl';

export const UserLoginSection = () => {
    const router = useRouter();
    const t = useTranslations();

    return (
        <div className="w-full max-w-lg mx-auto p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center gap-2"
                    aria-label={t('common.back')}>
                    <IconArrowLeft size={24} className="text-gray-700" />
                    <span className="text-gray-700">{t('common.back')}</span>
                </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.user_login')}</h1>
                <UserLoginForm />
            </div>
        </div>
    );
};

export default UserLoginSection;
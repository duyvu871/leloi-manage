'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { IconMenu2, IconX, IconArrowLeft } from '@tabler/icons-react';
import { Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LanguageSwitcher from '@component/language-switcher';
import { useLocale, useTranslations } from 'next-intl';
import { useAtomValue } from 'jotai';
import { UserMenu } from '@component/shared/menu';
import { isAuthenticatedAtom } from '@/stores/auth';

const FeatureHeader = () => {
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);

	const [mobileMenuOpen, { toggle, close }] = useDisclosure(false);
	const t = useTranslations();
	const lang = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const navLinks = [
		{ name: t('nav.home'), href: `/${lang}` },
		{ name: t('nav.about'), href: `/${lang}/about` },
		{ name: t('nav.contact'), href: `/${lang}/contact` },
		{ name: t('nav.news'), href: `/${lang}/news` },
		{ name: t('nav.events'), href: `/${lang}/events` },
	];

	useEffect(() => {
		console.log('Header mounted', isAuthenticated);
	}, [isAuthenticated]);

	return (
		<nav className='flex items-center justify-between h-full'>
			{/* Logo section with conditional back button */}
			

			{/* Desktop Navigation */}
			<div className='flex items-center gap-8'>
				<Group>
					<LanguageSwitcher />

					{isAuthenticated ? (
						<UserMenu />
					) : (
						<Group>
							<Button
								variant='outline'
								size='sm'
								fullWidth
								className='border-blue-600 text-blue-600 hover:bg-blue-50'
								onClick={() => router.push(`/${lang}/auth/login`)}>
								{t('common.login')}
							</Button>

							<Button
								size='sm'
								fullWidth
								className='bg-blue-600 hover:bg-blue-700'
								onClick={() => router.push(`/${lang}/auth/register`)}>
								{t('common.register')}
							</Button>
						</Group>
					)}
				</Group>
			</div>
		</nav>
	);
};

export default FeatureHeader;

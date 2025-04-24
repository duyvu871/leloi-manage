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

export const Header = () => {
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
		<header className='bg-white h-16 w-full shadow-sm absolute top-0 z-50 transition-all duration-300'>
			{/* Desktop Header */}
			<nav className='container mx-auto px-4 md:px-6 flex items-center justify-between h-full'>
				{/* Logo section with conditional back button */}
				<div className='flex items-center gap-4'>
					<Link href={`/${lang}`} className='flex items-center gap-2'>
						<div className='relative w-10 h-10'>
							<Image src='/images/logo.png' alt={t('common.school_name')} width={40} height={40} />
						</div>
						<span className='font-bold text-blue-800 text-xl hidden md:block'>
							{t('common.school_name')}
						</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className='hidden md:flex items-center gap-8'>
					<ul className='flex items-center gap-6'>
						{navLinks.map((link, idx) => (
							<li key={idx}>
								<Link href={link.href} className='text-gray-800 hover:text-blue-600 font-medium'>
									{link.name}
								</Link>
							</li>
						))}
					</ul>

					<Group>
						<LanguageSwitcher />

						{isAuthenticated ? (
							<UserMenu />
						) : (
							<Group wrap='nowrap'>
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

				{/* Mobile menu button */}
				<div className='md:hidden flex items-center gap-4'>
					<LanguageSwitcher />
					<button onClick={toggle} className='p-2 rounded-md' aria-label={t('nav.toggle_menu')}>
						{mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
					</button>
				</div>
			</nav>

			{/* Mobile Navigation */}
			{mobileMenuOpen && (
				<div className='md:hidden border-t border-gray-200'>
					<div className='container mx-auto px-4 py-4'>
						<ul className='flex flex-col gap-4'>
							{navLinks.map((link, idx) => (
								<li key={idx}>
									<Link
										href={link.href}
										className='text-gray-800 hover:text-blue-600 font-medium block py-2'
										onClick={close}>
										{link.name}
									</Link>
								</li>
							))}
							<li className='pt-4 border-t border-gray-200 mt-2'>
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
							</li>
						</ul>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;

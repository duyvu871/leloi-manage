'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

const Logo = () => {
	const t = useTranslations();
	const lang = useLocale();
	const router = useRouter();
	return (
		<div className='items-center gap-4 flex'>
			<Link href={`/${lang}`} className='flex items-center flex-nowrap gap-2'>
				<div className='relative w-10 h-10'>
					<Image src='/images/logo.png' alt={t('common.school_name')} width={40} height={40} />
				</div>
				<span className='font-bold text-blue-800 text-xl hidden md:block'>
					{t('common.school_name')}
				</span>
			</Link>
		</div>
	);
};

export default Logo;

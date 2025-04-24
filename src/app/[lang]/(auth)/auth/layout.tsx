// app/[lang]/layout.tsx
import React from 'react';
import Link from 'next/link';
import { LANGUAGES } from '@constant/languages';
import { STATIC_LABELS } from '@constant/ui';
import type { Locale } from '@constant/locales';
// import Header from '@component/shared/header/header';
import { MantineProviderClient } from '@provider/mantine-provider';
import type { Metadata } from 'next';
import { cn } from '@lib/tailwind/tailwind-merge';
import '@style/global.css';
import '@mantine/core/styles.css';
import { ThemeProvider } from '@provider/theme-provider';
import I18nProvider from '@provider/i18n-provider';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@component/shared/header/header';
import QueryClientProvider from '@provider/query-client-provider';

export const metadata: Metadata = {
	title: 'Trường THCS Lê Lợi',
	description: 'Trang thông tin tuyển sinh Trường THCS Lê Lợi',
	openGraph: {
		title: 'Trường THCS Lê Lợi',
		description: 'Trang thông tin tuyển sinh Trường THCS Lê Lợi',
		url: 'https://leloi.edu.vn',
		siteName: 'THCS Lê Lợi',
		images: [
			{
				url: '/images/logo.png',
				width: 800,
				height: 600,
			},
		],
		locale: 'vi_VN',
		type: 'website',
	},
};

interface LandingLayoutProps {
	children: React.ReactNode;
	params: { lang: Locale };
}

export default async function RootLayout({ children, params }: LandingLayoutProps) {
	const { lang } = params;

	return (
		<html lang={lang} suppressHydrationWarning className={'overscroll-contain scroll-smooth'}>
			<body className={cn('min-h-dvh font-sans antialiased bg-[#ffffff]')}>
				<NextIntlClientProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='light'
						disableTransitionOnChange
						forcedTheme={'light'}>
						<MantineProviderClient>
							<QueryClientProvider>
								<div className="min-h-screen flex flex-col">
									<Header />
									<main className="flex-1 h-full flex items-center justify-center bg-zinc-50">
                                        {children}
									</main>
								</div>
							</QueryClientProvider>
						</MantineProviderClient>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

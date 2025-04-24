// app/[lang]/layout.tsx
import React from 'react';
import type { Locale } from '@constant/locales';
import { MantineProviderClient } from '@provider/mantine-provider';
import type { Metadata } from 'next';
import { cn } from '@lib/tailwind/tailwind-merge';
import '@style/global.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { ThemeProvider } from '@provider/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import QueryClientProvider from '@provider/query-client-provider';
import JotaiProvider from '@provider/jotai-provider';
import AuthProvider from '@provider/auth-provider';
import { DashboardShell } from '@/components/shared/layout/dashboard';
import { RegistrationProvider } from '@/providers/registration-provider';
import ToastLayout from '@/components/shared/layout/toast';

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
						<JotaiProvider>
							<MantineProviderClient>
								<QueryClientProvider>
									<AuthProvider>
										<RegistrationProvider>
											<ToastLayout>
												<DashboardShell>{children}</DashboardShell>
											</ToastLayout>
										</RegistrationProvider>
									</AuthProvider>
								</QueryClientProvider>
							</MantineProviderClient>
						</JotaiProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

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
import JotaiProvider from '@provider/jotai-provider';
import AuthProvider from '@provider/auth-provider';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import ToastLayout from '@/components/shared/layout/toast';
import { DashboardShell } from '@/components/shared/layout/dashboard';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { Button } from '@mantine/core';

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
										<ToastLayout>
											<div className="min-h-screen flex flex-col bg-gray-100">
												{/* Header */}
												<header className="bg-primary text-white">
													<div className="container mx-auto px-4 py-3 flex justify-between items-center">
														<h1 className="text-xl font-bold">Hệ thống Quản lý Tuyển sinh - Quản lý</h1>
														<div className="flex items-center space-x-4">
															<span id="user-name" className="flex items-center">
																<IconUser size={18} className="mr-2" />
																Admin
															</span>
															<Button
																variant="filled"
																color="white"
																className="text-primary hover:bg-gray-100"
																rightSection={<IconLogout size={18} />}
															>
																Đăng xuất
															</Button>
														</div>
													</div>
												</header>

												{/* Main content */}
												<main className="flex-grow">
													{children}
												</main>

												{/* Footer */}
												<footer className="bg-gray-200 py-4">
													<div className="container mx-auto px-4 text-center text-gray-600 text-sm">
														&copy; {new Date().getFullYear()} Hệ thống Quản lý Tuyển sinh. All rights reserved.
													</div>
												</footer>
											</div>
										</ToastLayout>
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

'use client';
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Sidebar from '@component/shared/sidebar/sidebar';
import FeatureHeader from '@component/shared/header/feature-header';
import Logo from '@component/shared/logo';

// Client component for AppShell
export function DashboardShell({ children }: { children: React.ReactNode }) {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}>
			<AppShell.Header className='border-b border-gray-200 bg-white shadow-sm'>
				<Group h='100%' w={'100%'} wrap='nowrap' justify='space-between' px='md'>
					<Group wrap='nowrap'>
						<Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
						<Logo />
					</Group>
					<FeatureHeader />
				</Group>
			</AppShell.Header>

			<AppShell.Navbar>
				<Sidebar userType='parent' />
			</AppShell.Navbar>

			<AppShell.Main className='bg-zinc-50'>
				<div className='p-5'>{children}</div>
			</AppShell.Main>
		</AppShell>
	);
}

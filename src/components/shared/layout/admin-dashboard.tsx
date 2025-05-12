
'use client';
import { AppShell, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Sidebar from '@component/shared/sidebar/sidebar';
import FeatureHeader from '@component/shared/header/feature-header';
import Logo from '@component/shared/logo';
import { IconLogout, IconUser } from '@tabler/icons-react';

// Client component for AppShell
export function AdminDashboard({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}>
            <AppShell.Header className='border-b bg-primary text-white shadow-sm'>
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
            </AppShell.Header>

            <AppShell.Navbar>
                <Sidebar userType='manager' />
            </AppShell.Navbar>

            <AppShell.Main className='bg-zinc-50'>
                <div className='p-5'>{children}</div>
            </AppShell.Main>

            {/* <AppShell.Footer className='bg-gray-200 py-4'>
                <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} Hệ thống Quản lý Tuyển sinh. All rights reserved.
                </div>
            </AppShell.Footer> */}
        </AppShell>
    );
}

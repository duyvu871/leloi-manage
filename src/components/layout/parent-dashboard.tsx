'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '../shared/sidebar/sidebar';
import { usePathname } from 'next/navigation';
import { Container, Tabs, Title } from '@mantine/core';
// import RegistrationProvider from '@/providers/registration-provider';
import { useTranslation } from 'react-i18next';
import { IconFileText, IconUpload, IconClipboardList } from '@tabler/icons-react';
import { RegistrationProvider } from '@/providers/registration-provider';

interface ParentDashboardProps {
  children?: ReactNode;
  activeTab?: string;
}

export function ParentDashboard({ children, activeTab = 'registration' }: ParentDashboardProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState<string>(activeTab);

  // Helper function to determine if a path is active
  const isActiveTab = (tabId: string) => {
    // If exact dashboard path, default to registration tab
    if (pathname === '/dashboard') {
      return tabId === 'registration';
    }
    
    // Otherwise check if path includes tab ID
    return pathname.includes(tabId);
  };

  return (
    <RegistrationProvider>
      <Container size="xl" px="xs" py="lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Component */}
          <div className="w-full md:w-1/4">
            <Sidebar userType="parent" />
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {children}
          </div>
        </div>
      </Container>
    </RegistrationProvider>
  );
}

export default ParentDashboard;
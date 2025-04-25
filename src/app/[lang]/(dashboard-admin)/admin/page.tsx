'use client';

import React, { useState } from 'react';
import { Card, Text, Group, Tabs } from '@mantine/core';
import { useTranslations } from 'next-intl';
import StudentsList from '@/components/admin/students-list';
// import ScheduleManager from '@/components/admin/schedule-manager';
// import PendingReviews from '@/components/admin/pending-reviews';
// import AdmissionConfirmation from '@/components/admin/admission-confirmation';
import AdminStatistics from '@/components/admin/admin-statistics';
import ScheduleManager from '@/components/admin/schedule-manager';
import PendingReviews from '@/components/admin/pending-reviews';
import AdmissionConfirmation from '@/components/admin/admission-confirmation';

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Text fw={500} className="text-primary">{t('sidebar.menuTitle')}</Text>
            </Card.Section>
            <div className="mt-4 space-y-2">
              <a 
                href="#" 
                className={`block p-2 rounded ${activeTab === 'students' ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-blue-50 hover:text-primary'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('students');
                }}
              >
                {t('sidebar.studentList')}
              </a>
              <a 
                href="#" 
                className={`block p-2 rounded ${activeTab === 'schedule' ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-blue-50 hover:text-primary'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('schedule');
                }}
              >
                {t('sidebar.scheduleManager')}
              </a>
              <a 
                href="#" 
                className={`block p-2 rounded ${activeTab === 'pending' ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-blue-50 hover:text-primary'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('pending');
                }}
              >
                {t('sidebar.pendingReview')}
              </a>
              <a 
                href="#" 
                className={`block p-2 rounded ${activeTab === 'admission' ? 'bg-blue-50 text-primary font-medium' : 'text-gray-700 hover:bg-blue-50 hover:text-primary'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('admission');
                }}
              >
                {t('sidebar.admissionConfirmation')}
              </a>
            </div>
          </Card>
          
          {/* Statistics sidebar */}
          <AdminStatistics />
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4">
          {activeTab === 'students' && <StudentsList />}
          {activeTab === 'schedule' && <ScheduleManager />}
          {activeTab === 'pending' && <PendingReviews />}
          {activeTab === 'admission' && <AdmissionConfirmation />}
        </div>
      </div>
    </div>
  );
}
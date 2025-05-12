'use client';

import React, { useState, useEffect } from 'react';
import { Card, Text, Group, Tabs } from '@mantine/core';
import { useTranslations } from 'next-intl';
import StudentsList from '@/components/admin/students-list';
// import ScheduleManager from '@/components/admin/schedule-manager';
// import PendingReviews from '@/components/admin/pending-reviews';
// import AdmissionConfirmation from '@/components/admin/admission-confirmation';
import AdminStatistics from '@/components/admin/admin-statistics';
// import ScheduleManager from '@/components/admin/schedule-manager';
import PendingReviews from '@/components/admin/pending-reviews';
import AdmissionConfirmation from '@/components/admin/admission-confirmation';
import {
  Container,
  Title,
  Grid,
  RingProgress,
  Stack,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconClock,
  IconChecks,
} from '@tabler/icons-react';
import * as adminApi from '@/libs/apis/admin';
import useToast from '@/hooks/client/use-toast-notification';

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState('students');
  const { showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<adminApi.DetailedStatsDto | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getDetailedStats();
      setStats(response);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePercentage = (count: number) => {
    if (!stats?.totalApplications) return 0;
    return Math.round((count / stats.totalApplications) * 100);
  };

  if (!stats) {
    return (
      <Container size="xl">
        <LoadingOverlay visible={isLoading} />
      </Container>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
  <Container size="xl" mt="xl">
        <Stack gap="xl">
          <Title order={2}>Thống kê tuyển sinh</Title>

          <Grid>
            {/* Tổng số hồ sơ */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group>
                  <RingProgress
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[{ value: 100, color: 'blue' }]}
                    label={
                      <IconUsers size={20} style={{ width: '100%', height: '100%' }} />
                    }
                  />
                  <div>
                    <Text size="xs" c="dimmed">Tổng số hồ sơ</Text>
                    <Text fw={700} size="xl">{stats.totalApplications}</Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            {/* Đủ điều kiện */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group>
                  <RingProgress
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[{ value: calculatePercentage(stats.eligibleCount), color: 'green' }]}
                    label={
                      <IconUserCheck size={20} style={{ width: '100%', height: '100%' }} />
                    }
                  />
                  <div>
                    <Text size="xs" c="dimmed">Đủ điều kiện</Text>
                    <Text fw={700} size="xl">{stats.eligibleCount}</Text>
                    <Text size="xs" c="dimmed">
                      {calculatePercentage(stats.eligibleCount)}% tổng số hồ sơ
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            {/* Không đủ điều kiện */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group>
                  <RingProgress
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[{ value: calculatePercentage(stats.ineligibleCount), color: 'red' }]}
                    label={
                      <IconUserX size={20} style={{ width: '100%', height: '100%' }} />
                    }
                  />
                  <div>
                    <Text size="xs" c="dimmed">Không đủ điều kiện</Text>
                    <Text fw={700} size="xl">{stats.ineligibleCount}</Text>
                    <Text size="xs" c="dimmed">
                      {calculatePercentage(stats.ineligibleCount)}% tổng số hồ sơ
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            {/* Đang xử lý */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group>
                  <RingProgress
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[{ value: calculatePercentage(stats.processingCount), color: 'yellow' }]}
                    label={
                      <IconClock size={20} style={{ width: '100%', height: '100%' }}/>
                    }
                  />
                  <div>
                    <Text size="xs" c="dimmed">Đang xử lý</Text>
                    <Text fw={700} size="xl">{stats.processingCount}</Text>
                    <Text size="xs" c="dimmed">
                      {calculatePercentage(stats.processingCount)}% tổng số hồ sơ
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            {/* Đã xác nhận */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group>
                  <RingProgress
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[{ value: calculatePercentage(stats.confirmedCount), color: 'blue' }]}
                    label={
                      <IconChecks size={20} style={{ width: '100%', height: '100%' }} />
                    }
                  />
                  <div>
                    <Text size="xs" c="dimmed">Đã xác nhận</Text>
                    <Text fw={700} size="xl">{stats.confirmedCount}</Text>
                    <Text size="xs" c="dimmed">
                      {calculatePercentage(stats.confirmedCount)}% tổng số hồ sơ
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 hidden">
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
        <div className="w-full md:w-3/4 hidden">
          {activeTab === 'students' && <StudentsList />}
          {/* {activeTab === 'schedule' && <ScheduleManager />} */}
          {activeTab === 'pending' && <PendingReviews />}
          {activeTab === 'admission' && <AdmissionConfirmation />}
        </div>
      </div>

    </div>
  );
}
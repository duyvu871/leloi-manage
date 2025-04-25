'use client';

import React, { useEffect, useState } from 'react';
import { Card, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

interface StatsData {
  totalApplications: number;
  eligible: number;
  ineligible: number;
  pending: number;
  confirmed: number;
}

export default function AdminStatistics() {
  const t = useTranslations('admin');
  const [stats, setStats] = useState<StatsData>({
    totalApplications: 0,
    eligible: 0,
    ineligible: 0,
    pending: 0,
    confirmed: 0
  });

  useEffect(() => {
    // Fetch statistics from API
    // This is a mock implementation
    const fetchStats = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/admin/statistics');
        // const data = await response.json();
        
        // For now, using mock data
        setStats({
          totalApplications: 254,
          eligible: 142,
          ineligible: 45,
          pending: 67,
          confirmed: 89
        });
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-6">
      <Card.Section withBorder inheritPadding py="xs">
        <Text fw={500} className="text-primary">{t('statistics.title')}</Text>
      </Card.Section>
      
      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <Text c="dimmed">{t('statistics.totalApplications')}:</Text>
          <Text fw={500}>{stats.totalApplications}</Text>
        </div>
        <div className="flex justify-between">
          <Text c="dimmed">{t('statistics.eligible')}:</Text>
          <Text fw={500} className="text-green-600">{stats.eligible}</Text>
        </div>
        <div className="flex justify-between">
          <Text c="dimmed">{t('statistics.ineligible')}:</Text>
          <Text fw={500} className="text-red-600">{stats.ineligible}</Text>
        </div>
        <div className="flex justify-between">
          <Text c="dimmed">{t('statistics.pending')}:</Text>
          <Text fw={500} className="text-yellow-600">{stats.pending}</Text>
        </div>
        <div className="flex justify-between">
          <Text c="dimmed">{t('statistics.confirmed')}:</Text>
          <Text fw={500} className="text-blue-600">{stats.confirmed}</Text>
        </div>
      </div>
    </Card>
  );
}
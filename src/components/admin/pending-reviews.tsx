'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Text, 
  TextInput, 
  Table, 
  Badge, 
  Group, 
  ActionIcon,
  Loader
} from '@mantine/core';
import { IconSearch, IconEye, IconCheck, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import StudentDetailModal from './student-detail-modal';

interface PendingApplication {
  id: string;
  studentId: string;
  studentName: string;
  reason: string;
  updatedAt: string;
  status: 'pending';
}

export default function PendingReviews() {
  const t = useTranslations('admin');
  const [pendingApps, setPendingApps] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  useEffect(() => {
    // Fetch pending applications from API
    const fetchPendingApplications = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('/api/admin/applications/pending');
        // const data = await response.json();
        
        // Mock data
        setTimeout(() => {
          const mockPendingApps: PendingApplication[] = [
            {
              id: 'APP1001',
              studentId: 'HS10001',
              studentName: 'Nguyễn Văn A',
              reason: 'Học bạ cung cấp không rõ ràng, cần kiểm tra lại',
              updatedAt: '2025-04-10T08:30:00',
              status: 'pending'
            },
            {
              id: 'APP1002',
              studentId: 'HS10015',
              studentName: 'Trần Thị B',
              reason: 'Thông tin phụ huynh chưa đầy đủ',
              updatedAt: '2025-04-15T14:20:00',
              status: 'pending'
            },
            {
              id: 'APP1003',
              studentId: 'HS10023',
              studentName: 'Lê Văn C',
              reason: 'Thiếu giấy chứng nhận thành tích học tập',
              updatedAt: '2025-04-18T09:45:00',
              status: 'pending'
            },
            {
              id: 'APP1004',
              studentId: 'HS10042',
              studentName: 'Phạm Thị D',
              reason: 'Cần xác minh điểm số học tập',
              updatedAt: '2025-04-20T11:10:00',
              status: 'pending'
            }
          ];
          setPendingApps(mockPendingApps);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch pending applications:', error);
        setLoading(false);
      }
    };
    
    fetchPendingApplications();
  }, []);
  
  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };
  
  const handleViewApplication = (app: PendingApplication) => {
    // Mock student data for the selected application
    const mockStudent = {
      id: app.studentId,
      name: app.studentName,
      dob: '15/03/2010',
      school: 'Trường THCS Nguyễn Trãi',
      status: 'pending'
    };
    
    setSelectedStudent(mockStudent);
    setDetailModalOpen(true);
  };
  
  const handleApprove = (id: string) => {
    console.log('Approving application:', id);
    // Remove from pending list
    setPendingApps(pendingApps.filter(app => app.id !== id));
    // Call API to approve
    // await fetch(`/api/admin/applications/${id}/approve`, { method: 'POST' })
  };
  
  const handleReject = (id: string) => {
    console.log('Rejecting application:', id);
    // Remove from pending list
    setPendingApps(pendingApps.filter(app => app.id !== id));
    // Call API to reject
    // await fetch(`/api/admin/applications/${id}/reject`, { method: 'POST' })
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Text fw={500} className="text-primary text-xl">{t('pending.title')}</Text>
      </Card.Section>
      
      <div className="mb-6 mt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <TextInput
              placeholder={t('pending.searchPlaceholder')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader size="md" />
          </div>
        ) : pendingApps.length === 0 ? (
          <Text className="text-center py-4">{t('pending.noApplications')}</Text>
        ) : (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('pending.columnID')}</Table.Th>
                <Table.Th>{t('pending.columnName')}</Table.Th>
                <Table.Th>{t('pending.columnReason')}</Table.Th>
                <Table.Th>{t('pending.columnUpdatedAt')}</Table.Th>
                <Table.Th>{t('pending.columnActions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pendingApps.map((app) => (
                <Table.Tr key={app.id}>
                  <Table.Td>{app.studentId}</Table.Td>
                  <Table.Td>{app.studentName}</Table.Td>
                  <Table.Td>
                    <Text lineClamp={2}>{app.reason}</Text>
                  </Table.Td>
                  <Table.Td>{formatDate(app.updatedAt)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon 
                        variant="subtle" 
                        color="blue"
                        onClick={() => handleViewApplication(app)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="green"
                        onClick={() => handleApprove(app.id)}
                      >
                        <IconCheck size={18} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red"
                        onClick={() => handleReject(app.id)}
                      >
                        <IconX size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </div>
      
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          opened={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      )}
    </Card>
  );
}
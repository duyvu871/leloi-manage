'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Text,
  TextInput,
  Button,
  Group,
  Paper,
  Avatar,
  Grid,
  Textarea,
  Checkbox,
  Loader,
  Alert
} from '@mantine/core';
import { 
  IconSearch, 
  IconCheck, 
  IconX,
  IconUserCircle,
  IconAlertCircle
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface StudentVerification {
  id: string;
  name: string;
  dob: string;
  parent: {
    name: string;
    phone: string;
    email: string;
  };
  school: {
    name: string;
    address: string;
  };
  found: boolean;
}

export default function AdmissionConfirmation() {
  const t = useTranslations('admin');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<StudentVerification | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  
  const handleSearch = async () => {
    if (!studentId) return;
    
    setLoading(true);
    setNotFound(false);
    setStudentData(null);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // Mock response
        if (studentId === 'HS12345' || studentId === '12345') {
          setStudentData({
            id: 'HS12345',
            name: 'Nguyễn Văn A',
            dob: '01/01/2010',
            parent: {
              name: 'Nguyễn Văn B',
              phone: '0912345678',
              email: 'email@example.com',
            },
            school: {
              name: 'THCS ABC',
              address: '123 Đường XYZ, Hà Nội',
            },
            found: true,
          });
        } else {
          setNotFound(true);
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error searching for student:', error);
      setLoading(false);
      setNotFound(true);
    }
  };
  
  const handleApprove = () => {
    if (!studentData) return;
    
    console.log('Approving application:', studentData.id);
    console.log('Notes:', notes);
    
    // Reset form
    setStudentId('');
    setStudentData(null);
    setNotes('');
    setConfirmed(false);
    
    // Call API to approve
    // await fetch(`/api/admin/applications/${studentData.id}/approve-in-person`, { 
    //   method: 'POST',
    //   body: JSON.stringify({ notes })
    // })
  };
  
  const handleReject = () => {
    if (!studentData) return;
    
    console.log('Rejecting application:', studentData.id);
    console.log('Notes:', notes);
    
    // Reset form
    setStudentId('');
    setStudentData(null);
    setNotes('');
    setConfirmed(false);
    
    // Call API to reject
    // await fetch(`/api/admin/applications/${studentData.id}/reject-in-person`, { 
    //   method: 'POST',
    //   body: JSON.stringify({ notes })
    // })
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Text fw={500} className="text-primary text-xl">{t('admission.title')}</Text>
      </Card.Section>
      
      <div className="mb-6 mt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <TextInput
              placeholder={t('admission.searchPlaceholder')}
              value={studentId}
              onChange={(event) => setStudentId(event.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              className="w-full"
            />
          </div>
          <Button 
            color="blue" 
            onClick={handleSearch}
            loading={loading}
          >
            {t('admission.verify')}
          </Button>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <Loader size="md" />
        </div>
      )}
      
      {notFound && !loading && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title={t('admission.studentNotFound')} 
          color="red"
        >
          {t('admission.studentNotFoundDescription')}
        </Alert>
      )}
      
      {studentData && !loading && (
        <div>
          <Paper withBorder p="md" radius="md" className="mb-6">
            <div className="flex items-center mb-4">
              <Avatar
                size="xl"
                radius="xl"
                color="blue"
                className="mr-4"
              >
                <IconUserCircle size={32} />
              </Avatar>
              <div>
                <Text fw={700} size="xl">{studentData.name}</Text>
                <Text c="dimmed">{studentData.dob}</Text>
                <Text c="dimmed">ID: {studentData.id}</Text>
              </div>
            </div>
            
            <Grid gutter="xl" className="mt-4">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text fw={500} className="mb-2">{t('admission.parentInfo')}</Text>
                <div className="space-y-1">
                  <div className="flex">
                    <Text c="dimmed" className="w-24">{t('admission.parentName')}:</Text>
                    <Text>{studentData.parent.name}</Text>
                  </div>
                  <div className="flex">
                    <Text c="dimmed" className="w-24">{t('admission.phone')}:</Text>
                    <Text>{studentData.parent.phone}</Text>
                  </div>
                  <div className="flex">
                    <Text c="dimmed" className="w-24">{t('admission.email')}:</Text>
                    <Text>{studentData.parent.email}</Text>
                  </div>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text fw={500} className="mb-2">{t('admission.schoolInfo')}</Text>
                <div className="space-y-1">
                  <div className="flex">
                    <Text c="dimmed" className="w-24">{t('admission.schoolName')}:</Text>
                    <Text>{studentData.school.name}</Text>
                  </div>
                  <div className="flex">
                    <Text c="dimmed" className="w-24">{t('admission.address')}:</Text>
                    <Text>{studentData.school.address}</Text>
                  </div>
                </div>
              </Grid.Col>
            </Grid>
          </Paper>
          
          <div className="border-t pt-6">
            <Text fw={500} className="mb-4">{t('admission.confirmApplication')}</Text>
            
            <div className="mb-4">
              <Textarea
                label={t('admission.notesLabel')}
                placeholder={t('admission.notesPlaceholder')}
                value={notes}
                onChange={(event) => setNotes(event.currentTarget.value)}
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <Checkbox
                label={t('admission.confirmCheckbox')}
                checked={confirmed}
                onChange={(event) => setConfirmed(event.currentTarget.checked)}
              />
            </div>
            
            <Group justify="flex-end" gap="sm">
              <Button 
                leftSection={<IconX size={16} />}
                color="red"
                variant="outline"
                onClick={handleReject}
              >
                {t('admission.rejectButton')}
              </Button>
              <Button 
                leftSection={<IconCheck size={16} />}
                color="green"
                onClick={handleApprove}
                disabled={!confirmed}
              >
                {t('admission.approveButton')}
              </Button>
            </Group>
          </div>
        </div>
      )}
    </Card>
  );
}
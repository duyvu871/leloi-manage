'use client';

import React, { useState } from 'react';
import { 
  Modal, 
  Badge, 
  Text, 
  Divider, 
  Grid, 
  Group,
  Button,
  Textarea,
  Checkbox,
  Alert,
  ActionIcon,
  Avatar
} from '@mantine/core';
import { useTranslations } from 'next-intl';
import { 
  IconUserCircle, 
  IconClock, 
  IconAlertCircle, 
  IconCheck,
  IconX,
  IconFileText,
  IconDownload,
  IconEye
} from '@tabler/icons-react';

interface StudentDetailProps {
  student: {
    id: string;
    name: string;
    dob: string;
    school: string;
    status: 'eligible' | 'ineligible' | 'pending' | 'confirmed';
  };
  opened: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ student, opened, onClose }: StudentDetailProps) {
  const t = useTranslations('admin');
  const [reviewNotes, setReviewNotes] = useState('');
  const [confirmCheck, setConfirmCheck] = useState(false);
  const [isProcessingVisible, setIsProcessingVisible] = useState(student.status === 'pending');
  
  // Mock data that would come from API
  const studentDetails = {
    gender: 'Nam',
    address: '123 Đường Nguyễn Trãi, Quận 1, TP.HCM',
    parent: {
      name: 'Nguyễn Văn B',
      relationship: 'Bố',
      phone: '0912345678',
      email: 'phuhuynh@example.com'
    },
    school: {
      name: student.school,
      address: '456 Đường Lê Lợi, Quận 5, TP.HCM'
    },
    transcriptResults: [
      { subject: 'Toán', grade5: 9.5, grade6: 9.0, grade7: 8.5, grade8: 9.2, grade9: 8.8 },
      { subject: 'Ngữ Văn', grade5: 8.0, grade6: 8.5, grade7: 9.0, grade8: 8.7, grade9: 9.1 },
      { subject: 'Tiếng Anh', grade5: 8.7, grade6: 9.2, grade7: 9.4, grade8: 9.0, grade9: 9.5 },
    ],
    documents: [
      { name: 'Học bạ.pdf', type: 'transcript' },
      { name: 'CMND phụ huynh.pdf', type: 'id' },
      { name: 'Giấy khen.pdf', type: 'certificate' }
    ],
    pendingReason: 'Hồ sơ đang được xem xét do scan học bạ không chính xác'
  };
  
  const handleMarkEligible = () => {
    // API call to mark student as eligible
    console.log('Marking student as eligible:', student.id);
    // Close modal after action
    onClose();
  };
  
  const handleMarkIneligible = () => {
    // API call to mark student as ineligible
    console.log('Marking student as ineligible:', student.id);
    // Close modal after action
    onClose();
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'green';
      case 'ineligible':
        return 'red';
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      default:
        return 'gray';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'eligible':
        return t('students.statusEligible');
      case 'ineligible':
        return t('students.statusIneligible');
      case 'pending':
        return t('students.statusPending');
      case 'confirmed':
        return t('students.statusConfirmed');
      default:
        return status;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700} size="xl" className="text-primary">
        {t('studentDetail.title')}
      </Text>}
      size="lg"
      padding="md"
    >
      <div className="flex items-center mb-6">
        <Avatar
          size="xl"
          radius="xl"
          color="blue"
          className="mr-4"
        >
          <IconUserCircle size={32} />
        </Avatar>
        <div>
          <div className="flex items-center">
            <Text fw={700} size="xl" className="mr-2">{student.name}</Text>
            <Badge color={getStatusBadgeColor(student.status)}>
              {getStatusText(student.status)}
            </Badge>
          </div>
          <Text c="dimmed">{student.dob}</Text>
          <Text c="dimmed">ID: {student.id}</Text>
        </div>
      </div>
      
      <Grid gutter="md" className="mb-4">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} className="mb-2">{t('studentDetail.studentInfo')}</Text>
          <div className="space-y-1">
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.gender')}:</Text>
              <Text>{studentDetails.gender}</Text>
            </div>
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.address')}:</Text>
              <Text>{studentDetails.address}</Text>
            </div>
          </div>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} className="mb-2">{t('studentDetail.parentInfo')}</Text>
          <div className="space-y-1">
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.parentName')}:</Text>
              <Text>{studentDetails.parent.name}</Text>
            </div>
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.relationship')}:</Text>
              <Text>{studentDetails.parent.relationship}</Text>
            </div>
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.phone')}:</Text>
              <Text>{studentDetails.parent.phone}</Text>
            </div>
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.email')}:</Text>
              <Text>{studentDetails.parent.email}</Text>
            </div>
          </div>
        </Grid.Col>
      </Grid>
      
      <div className="mb-4">
        <Text fw={500} className="mb-2">{t('studentDetail.schoolInfo')}</Text>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.schoolName')}:</Text>
              <Text>{studentDetails.school.name}</Text>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <div className="flex">
              <Text c="dimmed" className="w-24">{t('studentDetail.schoolAddress')}:</Text>
              <Text>{studentDetails.school.address}</Text>
            </div>
          </Grid.Col>
        </Grid>
      </div>
      
      <div className="mb-4">
        <Text fw={500} className="mb-2">{t('studentDetail.transcriptResults')}</Text>
        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">{t('studentDetail.subject')}</th>
                <th className="text-center py-2 px-2">{t('studentDetail.grade5')}</th>
                <th className="text-center py-2 px-2">{t('studentDetail.grade6')}</th>
                <th className="text-center py-2 px-2">{t('studentDetail.grade7')}</th>
                <th className="text-center py-2 px-2">{t('studentDetail.grade8')}</th>
                <th className="text-center py-2 px-2">{t('studentDetail.grade9')}</th>
              </tr>
            </thead>
            <tbody>
              {studentDetails.transcriptResults.map((subject, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 pr-4">{subject.subject}</td>
                  <td className="text-center py-2 px-2">{subject.grade5}</td>
                  <td className="text-center py-2 px-2">{subject.grade6}</td>
                  <td className="text-center py-2 px-2">{subject.grade7}</td>
                  <td className="text-center py-2 px-2">{subject.grade8}</td>
                  <td className="text-center py-2 px-2">{subject.grade9}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-4">
        <Text fw={500} className="mb-2">{t('studentDetail.documents')}</Text>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            {studentDetails.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconFileText size={18} className="text-blue-600 mr-2" />
                  <Text>{doc.name}</Text>
                </div>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="blue">
                    <IconEye size={18} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="blue">
                    <IconDownload size={18} />
                  </ActionIcon>
                </Group>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Processing section for pending applications */}
      {isProcessingVisible && (
        <div className="mb-4">
          <Text fw={500} className="mb-2">{t('studentDetail.processing')}</Text>
          <Alert 
            icon={<IconClock size={18} />}
            title={t('studentDetail.pendingReview')}
            color="yellow"
            className="mb-4"
          >
            <Text>{t('studentDetail.reason')}: {studentDetails.pendingReason}</Text>
          </Alert>
          
          <div className="space-y-4">
            <Textarea
              label={t('studentDetail.notes')}
              placeholder={t('studentDetail.notesPlaceholder')}
              value={reviewNotes}
              onChange={(event) => setReviewNotes(event.currentTarget.value)}
              rows={3}
            />
            
            <Group justify="flex-end" gap="md">
              <Button 
                leftSection={<IconX size={18} />}
                color="red"
                variant="outline"
                onClick={handleMarkIneligible}
              >
                {t('studentDetail.markIneligible')}
              </Button>
              <Button 
                leftSection={<IconCheck size={18} />}
                color="green"
                onClick={handleMarkEligible}
              >
                {t('studentDetail.markEligible')}
              </Button>
            </Group>
          </div>
        </div>
      )}
    </Modal>
  );
}
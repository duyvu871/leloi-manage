'use client';

import React, { useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Badge,
  Timeline,
  Button,
  List,
  Loader,
  Alert,
  Avatar,
  Divider,
  Box
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconX,
  IconHourglassHigh,
  IconCalendarEvent,
  IconFileCheck,
  IconInfoCircle,
  IconUserCircle
} from '@tabler/icons-react';
import { useApplicationManagement } from '@/hooks/client/use-application-management';
import { useRegistration } from '@/providers/registration-provider';
import { formatPoints } from '@/utils/points-calculator';
import { useTranslations } from 'next-intl';
import { ApplicationStatus } from '@/types/registration';
import { useAtom } from 'jotai';
import { userAtom, selectedStudentAtom, selectedStudentIndexAtom } from '@/stores/user';

interface ApplicationStatusComponentProps {
  studentId?: number;
  applicationId?: number;
}

export default function ApplicationStatusComponent({
  // studentId, 
  // applicationId 
}: ApplicationStatusComponentProps) {
  const t = useTranslations('dashboard');
  const [user, setUser] = useAtom(userAtom);
  const [selectedStudent] = useAtom(selectedStudentAtom);
  const [selectedStudentIndex] = useAtom(selectedStudentIndexAtom);
  const {
    application,
    availableSlots,
    isLoading,
    error,
    loadApplicationStatus,
    loadAvailableScheduleSlots,
    assignScheduleSlot
  } = useApplicationManagement();

  const { competitionResults, priorityPoint } = useRegistration();

  // Load application status on component mount
  useEffect(() => {
    if (user?.students[0]?.application?.id) {
      loadApplicationStatus(user?.students[0]?.application?.id);
    }
    // loadAvailableScheduleSlots();
  }, [user]);

  // Load available schedule slots when needed for scheduling
  const handleScheduleClick = async () => {
    await loadAvailableScheduleSlots();
  };

  // Select a schedule slot
  const handleSelectSlot = async (slotId: number) => {
    await assignScheduleSlot(slotId);
  };

  const getStatusColor = (status?: ApplicationStatus): string => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
      default:
        return 'yellow';
    }
  };

  const getStatusIcon = (status?: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return <IconCheck size={16} />;
      case 'rejected':
        return <IconX size={16} />;
      case 'pending':
      default:
        return <IconHourglassHigh size={16} />;
    }
  };

  // Calculate total points
  const calculateTotalPoints = () => {
    let totalPoints = 0;

    // Add competition/bonus points (use highest)
    if (competitionResults && competitionResults.length > 0) {
      const highestPoints = Math.max(...competitionResults.map(result => result.points));
      totalPoints += highestPoints;
    }

    // Add priority points
    if (priorityPoint) {
      totalPoints += priorityPoint.points;
    }

    return totalPoints;
  };

  // Function to format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title={t('status.errorTitle')}
        color="red"
      >
        {error}
      </Alert>
    );
  }

  const hasApplication = user?.students[0]?.application?.id;

  return (
    <div className="space-y-6">
      {/* User and Student Information Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <Text fw={500}>{t('status.userInfo')}</Text>
          </Group>
        </Card.Section>

        <Group mt="md" mb="md">
          <Avatar
            size="lg"
            radius="xl"
            color="blue"
            src={undefined}
          >
            {user?.fullName ? user.fullName.charAt(0) : <IconUserCircle size={24} />}
          </Avatar>
          <div>
            <Text fw={600}>{user?.fullName || '—'}</Text>
            <Text size="sm" color="dimmed">{user?.email || '—'}</Text>
          </div>
        </Group>

        {/* <Divider my="sm" /> */}

        {selectedStudent && (
          <>
            <Text fw={500} mb="xs">{t('status.studentInfo')}</Text>
            <Box className='sm:ml-5'>
              <Group grow>
                <div>
                  <Text size="sm" color="dimmed">{t('status.studentName')}</Text>
                  <Text fw={500}>{selectedStudent.fullName || '—'}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">{t('status.studentId')}</Text>
                  <Text fw={500}>{selectedStudent.id || '—'}</Text>
                </div>
              </Group>
              <Group grow mt="md">
                <div>
                  <Text size="sm" color="dimmed">{t('status.dateOfBirth')}</Text>
                  <Text fw={500}>{selectedStudent.dateOfBirth
                    ? new Date(selectedStudent.dateOfBirth).toLocaleDateString('vi-VN')
                    : '—'}
                  </Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">{t('status.gender')}</Text>
                  <Text fw={500}>{selectedStudent.gender || '—'}</Text>
                </div>
              </Group>
            </Box>
          </>
        )}
      </Card>

      {/* Display warning if no application exists */}
      {!hasApplication ? (
        <>
          <Alert
            icon={<IconInfoCircle size={16} />}
            title={t('status.noApplication')}
            color="yellow"
          >
            {t('status.noApplicationDesc')}
          </Alert>

          <Button
            component="a"
            href="/dashboard/upload-documents"
            variant="filled"
            color="blue"
            fullWidth
          // className='max-w-xl'
          >
            {t('status.createApplication')}
          </Button>
        </>
      ) : (
        <>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group>
                <Text fw={500}>{t('status.applicationStatus')}</Text>
                <Badge
                  color={getStatusColor(application?.status)}
                  leftSection={getStatusIcon(application?.status)}
                >
                  {application?.status === 'approved'
                    ? t('status.approved')
                    : application?.status === 'rejected'
                      ? t('status.rejected')
                      : t('status.pending')
                  }
                </Badge>
              </Group>
            </Card.Section>

            <Group grow mt="md">
              <div>
                <Text size="sm" color="dimmed">{t('status.applicationId')}</Text>
                <Text fw={500}>{application?.id || '—'}</Text>
              </div>

              <div>
                <Text size="sm" color="dimmed">{t('status.submissionDate')}</Text>
                <Text fw={500}>{application?.createdAt
                  ? formatDate(application.createdAt)
                  : '—'}
                </Text>
              </div>

              <div>
                <Text size="sm" color="dimmed">{t('status.lastUpdated')}</Text>
                <Text fw={500}>{application?.updatedAt
                  ? formatDate(application.updatedAt)
                  : '—'}
                </Text>
              </div>
            </Group>

            <div className="mt-4">
              <Text size="sm" color="dimmed">{t('status.totalPoints')}</Text>
              <Text fw={700} size="xl">{formatPoints(calculateTotalPoints())}</Text>
            </div>

            {application?.rejectionReason && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title={t('status.rejectionReason')}
                color="red"
                mt="md"
              >
                {application.rejectionReason}
              </Alert>
            )}
          </Card>

          {/* Timeline of application status */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Text fw={500}>{t('status.timeline')}</Text>
            </Card.Section>

            <Timeline active={
              application?.status === 'approved' ? 3
                : application?.status === 'rejected' ? 3
                  : application?.verificationDate ? 2
                    : 1
            } bulletSize={24} lineWidth={2} mt="md">
              <Timeline.Item
                bullet={<IconFileCheck size={16} />}
                title={t('status.submitted')}
                color="blue"
              >
                <Text color="dimmed" size="sm">{
                  application?.createdAt ? formatDate(application.createdAt) : ''
                }</Text>
                <Text size="xs" mt={4}>{t('status.submittedDesc')}</Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconHourglassHigh size={16} />}
                title={t('status.verification')}
                color={application?.verificationDate ? "blue" : "gray"}
              >
                <Text color="dimmed" size="sm">{
                  application?.verificationDate
                    ? formatDate(application.verificationDate)
                    : t('status.pending')
                }</Text>
                <Text size="xs" mt={4}>{t('status.verificationDesc')}</Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={
                  application?.status === 'approved'
                    ? <IconCheck size={16} />
                    : application?.status === 'rejected'
                      ? <IconX size={16} />
                      : <IconHourglassHigh size={16} />
                }
                title={
                  application?.status === 'approved'
                    ? t('status.approved')
                    : application?.status === 'rejected'
                      ? t('status.rejected')
                      : t('status.decision')
                }
                color={
                  application?.status === 'approved'
                    ? "blue"
                    : application?.status === 'rejected'
                      ? "red"
                      : "gray"
                }
              >
                <Text color="dimmed" size="sm">{
                  application?.status === 'pending'
                    ? t('status.pending')
                    : application?.verificationDate
                      ? formatDate(application.verificationDate)
                      : ''
                }</Text>
                <Text size="xs" mt={4}>
                  {application?.status === 'approved'
                    ? t('status.approvedDesc')
                    : application?.status === 'rejected'
                      ? t('status.rejectedDesc')
                      : t('status.decisionDesc')
                  }
                </Text>
              </Timeline.Item>

              {application?.status === 'approved' && (
                <Timeline.Item
                  bullet={<IconCalendarEvent size={16} />}
                  title={t('status.scheduling')}
                  color="blue"
                >
                  {/* Show schedule info or button to select schedule */}
                  {/* Implementation will depend on schedule data structure */}
                </Timeline.Item>
              )}
            </Timeline>
          </Card>

          {/* Documents section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Text fw={500}>{t('status.documents')}</Text>
            </Card.Section>

            <Text size="sm" color="dimmed" mt="md" mb="md">
              {t('status.documentsDesc')}
            </Text>
            {application && (
              <Button
                component="a"
                href={`/dashboard/documents/${application?.id}`}
                fullWidth
                variant="light"
              >
                {t('status.viewDocuments')}
              </Button>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
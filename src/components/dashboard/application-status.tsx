'use client';

import React, { useEffect, useState } from 'react';
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
  Box,
  Table,
  Stack
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconX,
  IconHourglassHigh,
  IconCalendarEvent,
  IconFileCheck,
  IconInfoCircle,
  IconUserCircle,
  IconSchool,
  IconTrophy
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useAtom } from 'jotai';
import { userAtom } from '@/stores/user';
import * as registrationApi from '@/libs/apis/registration';
import useToast from '@/hooks/client/use-toast-notification';

interface ApplicationStatusComponentProps {
  studentId?: number;
  applicationId?: number;
}

export default function ApplicationStatusComponent({
  studentId,
  applicationId
}: ApplicationStatusComponentProps) {
  const t = useTranslations('dashboard');
  const [user] = useAtom(userAtom);
  const { showErrorToast } = useToast();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [pointsBreakdown, setPointsBreakdown] = useState<any>(null);

  // Load application status and points
  useEffect(() => {
    const loadApplicationData = async () => {
      if (!applicationId) return;
      
      setIsLoading(true);
      try {
        // Load application status
        const statusResponse = await registrationApi.getApplicationStatus(applicationId);
        setApplicationData(statusResponse.application);

        // Load points breakdown
        const pointsResponse = await registrationApi.calculateApplicationPoints(applicationId);
        setPointsBreakdown(pointsResponse);
      } catch (err: any) {
        setError(err.message || 'Failed to load application data');
        showErrorToast(err.message || 'Failed to load application data');
      } finally {
        setIsLoading(false);
      }
    };

    loadApplicationData();
  }, [applicationId]);

  // // Load available schedule slots
  // const handleScheduleClick = async () => {
  //   try {
  //     const response = await registrationApi.getAvailableScheduleSlots();
  //     setAvailableSlots(response.slots);
  //   } catch (err: any) {
  //     showErrorToast(err.message || 'Failed to load schedule slots');
  //   }
  // };

  // Select a schedule slot
  const handleSelectSlot = async (slotId: number) => {
    if (!applicationId) return;
    
    try {
      await registrationApi.assignScheduleSlot(applicationId, slotId);
      // Reload application data to get updated exam info
      const response = await registrationApi.getApplicationStatus(applicationId);
      setApplicationData(response.application);
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to assign schedule slot');
    }
  };

  const getStatusColor = (status?: string): string => {
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

  const getStatusIcon = (status?: string) => {
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

  const formatDate = (date: string | undefined) => {
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
        title="Error"
        color="red"
      >
        {error}
      </Alert>
    );
  }

  if (!applicationData) {
    return (
      <Alert
        icon={<IconInfoCircle size={16} />}
        title="No Application Found"
        color="yellow"
      >
        Please submit an application first.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <IconSchool size={20} />
            <Text fw={500}>Student Information</Text>
          </Group>
        </Card.Section>

        <Box mt="md">
          <Group grow>
            <div>
              <Text size="sm" c="dimmed">Full Name</Text>
              <Text fw={500}>{applicationData.student.fullName}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Date of Birth</Text>
              <Text fw={500}>{formatDate(applicationData.student.dateOfBirth)}</Text>
            </div>
          </Group>

          <Group grow mt="md">
            <div>
              <Text size="sm" c="dimmed">School</Text>
              <Text fw={500}>{applicationData.student.primarySchool}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Grade</Text>
              <Text fw={500}>{applicationData.student.grade}</Text>
            </div>
          </Group>
        </Box>
      </Card>

      {/* Application Status Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <Text fw={500}>Application Status</Text>
            <Badge
              color={getStatusColor(applicationData.status)}
              leftSection={getStatusIcon(applicationData.status)}
            >
              {applicationData.status.toUpperCase()}
            </Badge>
          </Group>
        </Card.Section>

        <Stack mt="md">
          <Group grow>
            <div>
              <Text size="sm" c="dimmed">Application ID</Text>
              <Text fw={500}>{applicationData.id}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Submitted Date</Text>
              <Text fw={500}>{formatDate(applicationData.createdAt)}</Text>
            </div>
          </Group>

          {applicationData.examNumber && (
            <Group grow>
              <div>
                <Text size="sm" c="dimmed">Exam Number</Text>
                <Text fw={500}>{applicationData.examNumber}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">Exam Room</Text>
                <Text fw={500}>{applicationData.examRoom}</Text>
              </div>
            </Group>
          )}

          {/* Points Breakdown */}
          {pointsBreakdown && (
            <Box mt="md">
              <Text fw={500} mb="xs">Points Breakdown</Text>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>Academic Points</Table.Td>
                    <Table.Td align="right" fw={500}>{pointsBreakdown.breakdown.academicPoints}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Competition Points</Table.Td>
                    <Table.Td align="right" fw={500}>{pointsBreakdown.breakdown.competitionPoints}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Priority Points</Table.Td>
                    <Table.Td align="right" fw={500}>{pointsBreakdown.breakdown.priorityPoints}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>Total Points</Table.Td>
                    <Table.Td align="right" fw={700}>{pointsBreakdown.totalPoints}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Box>
          )}
        </Stack>

        {applicationData.rejectionReason && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Rejection Reason"
            color="red"
            mt="md"
          >
            {applicationData.rejectionReason}
          </Alert>
        )}
      </Card>

      {/* Timeline Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <IconCalendarEvent size={20} />
            <Text fw={500}>Application Timeline</Text>
          </Group>
        </Card.Section>

        <Timeline active={
          applicationData.status === 'approved' ? 3
            : applicationData.status === 'rejected' ? 3
              : applicationData.verificationDate ? 2
                : 1
        } bulletSize={24} lineWidth={2} mt="md">
          <Timeline.Item
            bullet={<IconFileCheck size={16} />}
            title="Application Submitted"
          >
            <Text c="dimmed" size="sm">{formatDate(applicationData.createdAt)}</Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={<IconHourglassHigh size={16} />}
            title="Document Verification"
          >
            <Text c="dimmed" size="sm">
              {applicationData.verificationDate 
                ? formatDate(applicationData.verificationDate)
                : 'Pending'
              }
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={getStatusIcon(applicationData.status)}
            title="Final Decision"
          >
            <Text c="dimmed" size="sm">
              {applicationData.status === 'pending'
                ? 'Pending'
                : formatDate(applicationData.updatedAt)
              }
            </Text>
          </Timeline.Item>

          {applicationData.status === 'approved' && (
            <Timeline.Item
              bullet={<IconCalendarEvent size={16} />}
              title="Exam Schedule"
            >
              <Text c="dimmed" size="sm">
                {applicationData.examNumber
                  ? `Room ${applicationData.examRoom} - Number ${applicationData.examNumber}`
                  : 'Schedule not assigned'
                }
              </Text>
              {/* {!applicationData.examNumber && (
                <Button
                  variant="light"
                  size="xs"
                  mt="xs"
                  onClick={handleScheduleClick}
                >
                  Select Schedule
                </Button>
              )} */}
            </Timeline.Item>
          )}
        </Timeline>
      </Card>

      {/* Documents Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <IconFileCheck size={20} />
            <Text fw={500}>Submitted Documents</Text>
          </Group>
        </Card.Section>

        {applicationData.documents.length > 0 ? (
          <List spacing="xs" mt="md">
            {applicationData.documents.map((doc: any) => (
              <List.Item key={doc.id}>
                <Group justify="space-between">
                  <Text size="sm">{doc.fileName}</Text>
                  <Text size="xs" c="dimmed">{formatDate(doc.uploadedAt)}</Text>
                </Group>
              </List.Item>
            ))}
          </List>
        ) : (
          <Text c="dimmed" mt="md">No documents uploaded yet.</Text>
        )}

        <Button
          component="a"
          href={`/dashboard/documents/${applicationData.id}`}
          variant="light"
          fullWidth
          mt="md"
        >
          Manage Documents
        </Button>
      </Card>

      {/* Competition Results Card */}
      {applicationData.student.competitionResults && applicationData.student.competitionResults.length > 0 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <IconTrophy size={20} />
              <Text fw={500}>Competition Results</Text>
            </Group>
          </Card.Section>

          <Table mt="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Competition</Table.Th>
                <Table.Th>Level</Table.Th>
                <Table.Th>Achievement</Table.Th>
                <Table.Th>Points</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {applicationData.student.competitionResults.map((result: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>{result.competitionId}</Table.Td>
                  <Table.Td>{result.level}</Table.Td>
                  <Table.Td>{result.achievement}</Table.Td>
                  <Table.Td>{result.points}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
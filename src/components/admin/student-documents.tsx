'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Table,
  Badge,
  Button,
  Group,
  Text,
  ActionIcon,
  Modal,
  Stack,
  Select,
  Textarea,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconX, IconDownload, IconEye } from '@tabler/icons-react';
import * as adminApi from '@/libs/apis/admin';
import useToast from '@/hooks/client/use-toast-notification';

interface Props {
  studentId: string;
}

export default function StudentDocuments({ studentId }: Props) {
  const { showSuccessToast, showErrorToast } = useToast();
  const [opened, { open, close }] = useDisclosure(false);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<adminApi.StudentDocumentDto[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<adminApi.StudentDocumentDto | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'rejected'>('verified');
  const [comments, setComments] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [studentId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getStudentDocuments(studentId);
      setDocuments(response);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedDocument) return;

    try {
      setIsLoading(true);
      await adminApi.verifyDocument(studentId, selectedDocument.id, {
        status: verificationStatus,
        comments: comments || undefined,
      });
      
      showSuccessToast('Document verified successfully');
      close();
      loadDocuments();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to verify document');
    } finally {
      setIsLoading(false);
    }
  };

  const openVerificationModal = (document: adminApi.StudentDocumentDto) => {
    setSelectedDocument(document);
    setVerificationStatus('verified');
    setComments('');
    open();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'yellow';
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
      <LoadingOverlay visible={isLoading} />
      
      <Title order={3} mb="xl">Tài liệu đã nộp</Title>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Tên tài liệu</Table.Th>
            <Table.Th>Loại</Table.Th>
            <Table.Th>Kích thước</Table.Th>
            <Table.Th>Ngày tải lên</Table.Th>
            <Table.Th>Trạng thái</Table.Th>
            <Table.Th>Người xác minh</Table.Th>
            <Table.Th>Thao tác</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {documents.map((doc) => (
            <Table.Tr key={doc.id}>
              <Table.Td>{doc.fileName}</Table.Td>
              <Table.Td>{doc.fileType}</Table.Td>
              <Table.Td>{formatFileSize(doc.fileSize)}</Table.Td>
              <Table.Td>{formatDate(doc.uploadedAt)}</Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(doc.status)}>
                  {doc.status === 'verified' ? 'Đã xác minh'
                    : doc.status === 'rejected' ? 'Từ chối'
                    : 'Chờ xác minh'
                  }
                </Badge>
              </Table.Td>
              <Table.Td>
                {doc.verifiedBy ? (
                  <Group gap="xs">
                    <Text size="sm">{doc.verifiedBy}</Text>
                    <Text size="xs" c="dimmed">
                      {doc.verifiedAt ? formatDate(doc.verifiedAt) : ''}
                    </Text>
                  </Group>
                ) : (
                  '—'
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    component="a"
                    href={doc.fileUrl}
                    target="_blank"
                    title="Xem tài liệu"
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="blue"
                    component="a"
                    href={doc.fileUrl}
                    download
                    title="Tải xuống"
                  >
                    <IconDownload size={16} />
                  </ActionIcon>
                  {doc.status === 'pending' && (
                    <ActionIcon
                      variant="light"
                      color="yellow"
                      onClick={() => openVerificationModal(doc)}
                      title="Xác minh"
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}

          {documents.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={7} align="center">
                <Text c="dimmed">Chưa có tài liệu nào được nộp</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Verification Modal */}
      <Modal opened={opened} onClose={close} title="Xác minh tài liệu" size="lg">
        {selectedDocument && (
          <Stack>
            <Text fw={500}>{selectedDocument.fileName}</Text>
            
            <Select
              label="Trạng thái"
              value={verificationStatus}
              onChange={(value: any) => setVerificationStatus(value)}
              data={[
                { value: 'verified', label: 'Xác nhận' },
                { value: 'rejected', label: 'Từ chối' },
              ]}
              required
            />

            <Textarea
              label="Ghi chú"
              placeholder="Nhập ghi chú nếu cần"
              value={comments}
              onChange={(e) => setComments(e.currentTarget.value)}
              minRows={3}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="light" onClick={close}>Hủy</Button>
              <Button 
                color={verificationStatus === 'verified' ? 'green' : 'red'}
                onClick={handleVerify}
              >
                {verificationStatus === 'verified' ? 'Xác nhận' : 'Từ chối'}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Card>
  );
} 
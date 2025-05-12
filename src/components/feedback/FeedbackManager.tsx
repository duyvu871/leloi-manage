import { useState, useEffect } from 'react';
import {
  Table,
  Badge,
  Group,
  Text,
  ActionIcon,
  Stack,
  Button,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEye, IconCheck } from '@tabler/icons-react';
import { getFeedbackList, updateFeedbackStatus, Feedback } from '@/libs/apis/feedback';
import useToast from '@/hooks/client/use-toast-notification';

const statusColors = {
  pending: 'yellow',
  resolved: 'green',
} as const;

export default function FeedbackManager() {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const items = await getFeedbackList();
      setFeedbackItems(items.data);
    } catch (error: any) {
      showErrorToast(error.message || 'Không thể tải danh sách phản ánh');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsResolved = async (item: Feedback) => {
    try {
      await updateFeedbackStatus(item.id!, 'resolved');
      showSuccessToast('Đã đánh dấu phản ánh là đã giải quyết');
      loadFeedback();
    } catch (error: any) {
      showErrorToast(error.message || 'Không thể cập nhật trạng thái');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <Stack>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Loại</Table.Th>
            <Table.Th>Nội dung</Table.Th>
            <Table.Th>Trạng thái</Table.Th>
            <Table.Th>Thời gian</Table.Th>
            <Table.Th>Thao tác</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {feedbackItems.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>
                <Badge>
                  {item.type === 'error' ? 'Báo lỗi' : item.type === 'suggestion' ? 'Góp ý' : 'Khác'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text lineClamp={2}>{item.content}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={statusColors[item.status]}>
                  {item.status === 'pending' ? 'Chờ xử lý' : 'Đã giải quyết'}
                </Badge>
              </Table.Td>
              <Table.Td>{formatDate(item.createdAt)}</Table.Td>
              <Table.Td>
                <Group gap={8}>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => {
                      setSelectedItem(item);
                      openViewModal();
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  {item.status === 'pending' && (
                    <ActionIcon
                      variant="subtle"
                      color="green"
                      onClick={() => handleMarkAsResolved(item)}
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={viewModalOpened}
        onClose={closeViewModal}
        title="Chi tiết phản ánh"
        size="md"
      >
        {selectedItem && (
          <Stack>
            <Group>
              <Badge>{selectedItem.type === 'error' ? 'Báo lỗi' : selectedItem.type === 'suggestion' ? 'Góp ý' : 'Khác'}</Badge>
              <Text size="sm" c="dimmed">{formatDate(selectedItem.createdAt)}</Text>
            </Group>
            <Text>{selectedItem.content}</Text>
            {selectedItem.status === 'pending' && (
              <Button onClick={() => {
                handleMarkAsResolved(selectedItem);
                closeViewModal();
              }}>
                Đánh dấu đã giải quyết
              </Button>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
} 
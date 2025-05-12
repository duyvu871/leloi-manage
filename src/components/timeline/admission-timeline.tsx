import { Timeline, Text, Title, Container, Paper, Alert, Button, Group, Stack, LoadingOverlay, Space, Badge } from '@mantine/core';
import { IconCalendarTime, IconAlertCircle, IconExternalLink } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as timelineApi from '@/libs/apis/timeline';
import useToast from '@/hooks/client/use-toast-notification';
import FeedbackCard from '../feedback/feedback-card';

// Interface definition
interface TimelineItem {
  id?: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  color: string;
  alert: {
    title: string;
    content: string;
    type: 'info' | 'warning';
  };
  links: Array<{
    text: string;
    url: string;
  }>;
  hidden?: boolean;
}

export default function AdmissionTimeline() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const { showErrorToast } = useToast();

  useEffect(() => {
    loadTimelineItems();
  }, []);

  const loadTimelineItems = async () => {
    try {
      setIsLoading(true);
      const items = await timelineApi.getPublicTimelineItems();
      setTimelineItems(items);
    } catch (error: any) {
      showErrorToast(error.message || 'Không thể tải dữ liệu timeline');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'upcoming':
        return 'blue';
      case 'completed':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  return (
    <Container size="xl" py="xl" maw={1200} px={0}>
       <Alert
          icon={<IconAlertCircle size={16} />}
          title="Thông báo quan trọng"
          color="blue"
          mb="xl"
        >
          <Text size="sm">
            Vui lòng theo dõi thông tin tuyển sinh dưới đây để nắm rõ các mốc thời gian quan trọng trong quá trình tuyển sinh.
            Nhà trường sẽ cập nhật thông tin thường xuyên.
          </Text>
        </Alert>

      <Paper p="md" radius="md" withBorder className='' pos="relative">
        <LoadingOverlay visible={isLoading} />
        
        <Title order={2} ta="center" mb="xl">
          THỜI GIAN TUYỂN SINH
        </Title>

       
        <Space h="xl" />

        {timelineItems.length === 0 && !isLoading ? (
          <Alert color="blue">
            <Text size="sm" fw={400}>
              Chưa có thông tin timeline
            </Text>
          </Alert>
        ) : (
          <Timeline 
            active={timelineItems.findIndex(item => item.status === 'active')} 
            bulletSize={32} 
            lineWidth={2} 
            maw={800}
            mx="auto"
          >
            {timelineItems.map((item, index) => (
              <Timeline.Item
                key={item.id || index}
                bullet={
                  <Badge
                    size="lg"
                    variant="filled"
                    color={getStatusColor(item.status)}
                    w={8}
                    h={8}
                    p={0}
                  />
                }
                title={
                  <Group justify="space-between" wrap="nowrap">
                    <Text size="lg" fw={500}>
                      {item.title}
                    </Text>
                  </Group>
                }
              >
                <Stack gap="sm">
                  <Text size="sm" c="dimmed">
                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </Text>
                  <Text size="sm">{item.description}</Text>

                  {item.alert && (
                    <Alert
                      icon={<IconAlertCircle size={16} />}
                      title={item.alert.title}
                      color={item.alert.type === 'warning' ? 'red' : 'blue'}
                    >
                      {item.alert.content}
                    </Alert>
                  )}

                  {item.links && item.links.length > 0 && (
                    <Group gap="xs">
                      {item.links.map((link, linkIndex) => (
                        <Button
                          key={linkIndex}
                          variant="light"
                          size="xs"
                          rightSection={<IconExternalLink size={14} />}
                          onClick={() => handleNavigate(link.url)}
                        >
                          {link.text}
                        </Button>
                      ))}
                    </Group>
                  )}
                </Stack>
              </Timeline.Item>
            ))}
          </Timeline>
        )}

        <Space h="xl" />
      </Paper>

      
      {/* <Alert
          // icon={<IconAlertCircle size={16} />}
          title="Hỗ trợ"
          color="blue"
          mt="xl"
        >
          <Stack gap="xs">
            <Text size="sm">
              Nếu cần hỗ trợ, vui lòng liên hệ:
            </Text>
            <Text size="sm">
              - Hotline: <Text span fw={500}>1900 xxxx</Text>
            </Text>
            <Text size="sm">
              - Email: <Text span fw={500}>tuyensinh@leloi.edu.vn</Text>
            </Text>
            <Text size="sm">
              - Thời gian hỗ trợ: <Text span fw={500}>8:00 - 17:00</Text> (Thứ 2 - Thứ 6)
            </Text>
            <Space h="xs" />
            <Text size="sm">
              Nếu có thắc mắc, vui lòng gửi phản ánh:
            </Text>
            <FeedbackForm useModal={false} />
          </Stack>
        </Alert> */}
        <FeedbackCard />
    </Container>
  );
} 
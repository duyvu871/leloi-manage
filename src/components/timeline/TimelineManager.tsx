import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  TextInput,
  Textarea,
  Select,
  Group,
  Stack,
  ActionIcon,
  Table,
  Text,
  ColorInput,
  Timeline,
  Alert,
  Box,
  Transition,
  Tooltip,
  Collapse,
  Switch,
  Checkbox,
  Badge,
  Tabs,
  LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconEdit, IconTrash, IconPlus, IconDownload, IconCalendarTime, IconAlertCircle, IconExternalLink, IconEye, IconEyeOff, IconCheck, IconX, IconFilter } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import useToast from '@/hooks/client/use-toast-notification';
import * as timelineApi from '@/libs/apis/timeline';
import { TimelineItem, TimelineQueryDto } from '@/schemas/timeline/dto';
import { timelineItemSchema } from '@/schemas/timeline/schema';

// Timeline types
export const TIMELINE_TYPES = [
  { value: 'registration', label: 'Nộp hồ sơ' },
  { value: 'document', label: 'Nộp giấy tờ' },
  { value: 'exam', label: 'Lịch thi' },
  { value: 'result', label: 'Kết quả' },
  { value: 'enrollment', label: 'Nhập học' },
] as const;

export type TimelineType = typeof TIMELINE_TYPES[number]['value'];

// Update TimelineFormData type
type TimelineFormData = z.infer<typeof timelineItemSchema> & {
  type: TimelineType;
};

const statusOptions = [
  { value: 'active', label: 'Đang diễn ra' },
  { value: 'upcoming', label: 'Sắp diễn ra' },
  { value: 'completed', label: 'Đã kết thúc' },
];

const alertTypeOptions = [
  { value: 'info', label: 'Thông tin' },
  { value: 'warning', label: 'Cảnh báo' },
];

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Add date formatting function
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export default function TimelineManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [linkErrors, setLinkErrors] = useState<Array<{ text?: string; url?: string }>>([]);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const [inlineEditIndex, setInlineEditIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHiddenItems, setShowHiddenItems] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const { showSuccessToast, showErrorToast } = useToast();

  // Load timeline items on mount
  useEffect(() => {
    loadTimelineItems();
  }, []);

  const loadTimelineItems = async () => {
    try {
      setIsLoading(true);
      const query: TimelineQueryDto = {};
      const items = await timelineApi.getAllTimelineItems(query);
      setTimelineItems(items);
    } catch (error: any) {
      showErrorToast(error.message || 'Không thể tải dữ liệu timeline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInlineEdit = (index: number) => {
    setInlineEditIndex(index);
    const itemToEdit = timelineItems[index];
    reset(itemToEdit);
  };

  const handleCancelEdit = () => {
    setInlineEditIndex(null);
    setEditingIndex(null);
    setShowAddForm(false);
    setLinkErrors([]);
    reset({
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      status: 'upcoming',
      color: '#228be6',
      type: 'registration',
      alert: {
        title: '',
        content: '',
        type: 'info',
      },
      links: [],
    });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TimelineFormData>({
    resolver: zodResolver(timelineItemSchema),
    defaultValues: {
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      status: 'upcoming',
      color: '#228be6',
      type: 'registration',
      alert: {
        title: '',
        content: '',
        type: 'info',
      },
      links: [],
    },
  });

  const validateLink = (index: number, field: 'text' | 'url', value: string) => {
    const newErrors = [...linkErrors];
    if (!newErrors[index]) {
      newErrors[index] = {};
    }

    if (field === 'text') {
      newErrors[index].text = !value ? 'Tên liên kết không được để trống' : undefined;
    } else {
      newErrors[index].url = !isValidUrl(value) ? 'URL không hợp lệ' : undefined;
    }

    setLinkErrors(newErrors);
  };

  const onSubmit = async (data: TimelineFormData) => {
    try {
      setIsLoading(true);

      // Validate all links before submitting
      const newLinkErrors = data.links.map(link => ({
        text: !link.text ? 'Tên liên kết không được để trống' : undefined,
        url: !isValidUrl(link.url) ? 'URL không hợp lệ' : undefined,
      }));

      setLinkErrors(newLinkErrors);

      // Check if there are any errors
      if (newLinkErrors.some(error => error.text || error.url)) {
        return;
      }

      if (inlineEditIndex !== null) {
        // Edit existing item
        const itemId = timelineItems[inlineEditIndex].id;
        if (!itemId) return;

        await timelineApi.updateTimelineItem(itemId, data);
        showSuccessToast('Cập nhật timeline thành công');
      } else {
        // Add new item
        await timelineApi.createTimelineItem(data);
        showSuccessToast('Thêm mới timeline thành công');
      }

      // Reload timeline items
      await loadTimelineItems();
      
      // Reset form
      handleCancelEdit();
    } catch (error: any) {
      showErrorToast(error.message || 'Có lỗi xảy ra khi lưu timeline');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (index: number) => {
    try {
      setIsLoading(true);
      const itemId = timelineItems[index].id;
      if (!itemId) return;

      await timelineApi.deleteTimelineItem(itemId);
      showSuccessToast('Xóa timeline thành công');

      // Reload timeline items
      await loadTimelineItems();
    } catch (error: any) {
      showErrorToast(error.message || 'Có lỗi xảy ra khi xóa timeline');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemVisibility = async (index: number) => {
    try {
      setIsLoading(true);
      const item = timelineItems[index];
      if (!item.id) return;

      await timelineApi.toggleTimelineItemVisibility(item.id, !item.hidden);
      showSuccessToast(`${item.hidden ? 'Hiện' : 'Ẩn'} timeline thành công`);

      // Reload timeline items
      await loadTimelineItems();
    } catch (error: any) {
      showErrorToast(error.message || 'Có lỗi xảy ra khi thay đổi trạng thái hiển thị');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsLoading(true);
      const items = await timelineApi.exportTimelineItems();
      
      // Create a Blob with the JSON data
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `timeline-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      showSuccessToast('Xuất dữ liệu timeline thành công');
    } catch (error: any) {
      showErrorToast(error.message || 'Có lỗi xảy ra khi xuất dữ liệu');
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

  const EditForm = ({ isNew = false }) => {
    return (
      <Box p="md" bg="gray.0" style={{ borderRadius: '8px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  label="Tiêu đề"
                  placeholder="Nhập tiêu đề timeline"
                  error={error?.message}
                  required
                  {...field}
                />
              )}
            />

            <Group grow>
              <Controller
                name="startDate"
                control={control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <DateInput
                    label="Ngày bắt đầu"
                    placeholder="DD/MM/YYYY"
                    error={error?.message}
                    value={value ? new Date(value) : null}
                    onChange={(date) => onChange(date?.toISOString())}
                    required
                    locale="vi"
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                  const startDate = watch('startDate');
                  return (
                    <DateInput
                      label="Ngày kết thúc"
                      placeholder="DD/MM/YYYY"
                      error={error?.message}
                      value={value ? new Date(value) : null}
                      onChange={(date) => onChange(date?.toISOString())}
                      required
                      locale="vi"
                      minDate={startDate ? new Date(startDate) : undefined}
                    />
                  );
                }}
              />
            </Group>

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Textarea
                  label="Mô tả"
                  placeholder="Nhập mô tả chi tiết"
                  error={error?.message}
                  required
                  minRows={3}
                  {...field}
                />
              )}
            />

            <Group grow>
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    label="Trạng thái"
                    placeholder="Chọn trạng thái"
                    data={[
                      { value: 'upcoming', label: 'Sắp diễn ra' },
                      { value: 'active', label: 'Đang diễn ra' },
                      { value: 'completed', label: 'Đã kết thúc' },
                    ]}
                    error={error?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="type"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    label="Loại timeline"
                    placeholder="Chọn loại"
                    data={TIMELINE_TYPES}
                    error={error?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="color"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ColorInput
                    label="Màu sắc"
                    placeholder="Chọn màu"
                    error={error?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Group>

            <Paper withBorder p="md">
              <Title order={4} mb="md">Thông báo</Title>
              <Stack>
                <Controller
                  name="alert.title"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextInput
                      label="Tiêu đề thông báo"
                      placeholder="Nhập tiêu đề thông báo"
                      error={error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="alert.content"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Textarea
                      label="Nội dung thông báo"
                      placeholder="Nhập nội dung thông báo"
                      error={error?.message}
                      minRows={2}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="alert.type"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      label="Loại thông báo"
                      placeholder="Chọn loại thông báo"
                      data={[
                        { value: 'info', label: 'Thông tin' },
                        { value: 'warning', label: 'Cảnh báo' },
                      ]}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </Stack>
            </Paper>

            <Paper withBorder p="md">
              <Group justify="space-between" mb="md">
                <Title order={4}>Liên kết</Title>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => {
                    const links = watch('links') || [];
                    setValue('links', [...links, { text: '', url: '' }]);
                  }}
                >
                  Thêm liên kết
                </Button>
              </Group>

              {watch('links')?.map((_, index) => (
                <Group key={index} mt="xs">
                  <Controller
                    name={`links.${index}.text`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextInput
                        label="Tên liên kết"
                        placeholder="Nhập tên liên kết"
                        error={error?.message}
                        style={{ flex: 1 }}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name={`links.${index}.url`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextInput
                        label="URL"
                        placeholder="Nhập đường dẫn"
                        error={error?.message}
                        style={{ flex: 2 }}
                        {...field}
                      />
                    )}
                  />

                  <ActionIcon
                    color="red"
                    variant="light"
                    mt={28}
                    onClick={() => {
                      const links = watch('links').filter((_, i) => i !== index);
                      setValue('links', links);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Paper>

            <Group justify="flex-end" mt="xl">
              <Button variant="light" onClick={handleCancelEdit}>
                Hủy
              </Button>
              <Button type="submit">
                {isNew ? 'Tạo mới' : 'Cập nhật'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    );
  };

  const getFilteredTimelineItems = () => {
    return timelineItems.filter(item => {
      // Filter by hidden status
      if (!showHiddenItems && item.hidden) {
        return false;
      }
      
      // Filter by status if a filter is selected
      if (filterStatus && item.status !== filterStatus) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <Container size="xl" py="xl" maw={1200}>
      <LoadingOverlay visible={isLoading} />
      <Paper p="md" radius="md" withBorder className='mx-auto'>
        <Group justify="space-between" mb="xl">
          {/* <Title order={2}>Quản lý Timeline</Title> */}
          <Group>
            {/* <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportData}
              disabled={timelineItems.length === 0}
            >
              Xuất dữ liệu
            </Button> */}
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                reset({
                  title: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  status: 'upcoming',
                  color: '#228be6',
                  type: 'registration',
                  alert: {
                    title: '',
                    content: '',
                    type: 'info',
                  },
                  links: [],
                });
                setShowAddForm(true);
                setInlineEditIndex(null);
              }}
            >
              Thêm mục mới
            </Button>
          </Group>
        </Group>

        {/* Timeline Display */}
        <Paper p="md" mb="xl" withBorder className='mx-auto'>
          <Title order={3} ta="center" mb="xl">
            THỜI GIAN TUYỂN SINH
          </Title>

          {/* Filter Controls */}
          <Group justify="apart" mb="lg">
            <Group>
              <Text fw={500}>Lọc theo trạng thái:</Text>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                data={[
                  { value: '', label: 'Tất cả' },
                  ...statusOptions
                ]}
                placeholder="Chọn trạng thái"
                style={{ width: 200 }}
              />
            </Group>
            <Switch
              label="Hiển thị mục đã ẩn"
              checked={showHiddenItems}
              onChange={(event) => setShowHiddenItems(event.currentTarget.checked)}
            />
          </Group>

          {showAddForm && (
            <Box mb="xl">
              <Title order={4} mb="md">Thêm mục mới</Title>
              <EditForm isNew={true} />
            </Box>
          )}

          <Timeline active={1} bulletSize={24} lineWidth={2}>
            {getFilteredTimelineItems().map((item, index) => (
              <Timeline.Item
                key={index}
                bullet={<IconCalendarTime size={12} />}
                title={
                  <Group gap="xs" wrap="nowrap">
                    <Text fw={700} size="lg" c={item.color}>
                      {item.title}
                    </Text>
                    {item.hidden && (
                      <Badge color="red" variant="filled" size="xs">
                        Ẩn
                      </Badge>
                    )}
                  </Group>
                }
                color={getStatusColor(item.status)}
                onMouseEnter={() => inlineEditIndex !== index && setHoveredItemIndex(index)}
                onMouseLeave={() => setHoveredItemIndex(null)}
                style={item.hidden ? { opacity: 0.7 } : {}}
              >
                {inlineEditIndex === index ? (
                  <EditForm />
                ) : (
                  <Box style={{ position: 'relative' }} className='p-4'>
                    <Text size="sm" c="dimmed" mt={4}>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Text>
                    <Text size="sm" mt={4}>
                      {item.description}
                    </Text>

                    {item.alert && (
                      <Alert
                        icon={<IconAlertCircle size={16} />}
                        title={item.alert.title}
                        color={item.alert.type === 'warning' ? 'yellow' : 'blue'}
                        mt="sm"
                        mb="sm"
                      >
                        <Text size="sm">{item.alert.content}</Text>
                      </Alert>
                    )}

                    {item.links && item.links.length > 0 && (
                      <Group mt="sm">
                        {item.links.map((link, linkIndex) => (
                          <Button
                            key={linkIndex}
                            variant="light"
                            size="xs"
                            color={item.color.replace('#', '')}
                            leftSection={<IconExternalLink size={14} />}
                            component="a"
                            href={link.url}
                            target="_blank"
                          >
                            {link.text}
                          </Button>
                        ))}
                      </Group>
                    )}

                    {/* Hover overlay with action buttons */}
                    <Transition
                      mounted={hoveredItemIndex === index}
                      transition="fade"
                      duration={200}
                    >
                      {(styles) => (
                        <Box
                          style={{
                            ...styles,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 10,
                            cursor: 'pointer',
                          }}
                        >
                          <Group>
                            <Tooltip label="Chỉnh sửa">
                              <ActionIcon 
                                variant="filled" 
                                color="blue" 
                                onClick={() => handleStartInlineEdit(index)}
                                radius="xl"
                                size="md"
                              >
                                <IconEdit size={18} />
                              </ActionIcon>
                            </Tooltip>
                            
                            <Tooltip label={item.hidden ? "Hiện" : "Ẩn"}>
                              <ActionIcon 
                                variant="filled" 
                                color={item.hidden ? "green" : "gray"}
                                onClick={() => toggleItemVisibility(index)}
                                radius="xl"
                                size="md"
                              >
                                {item.hidden ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                              </ActionIcon>
                            </Tooltip>
                            
                            <Tooltip label="Xóa">
                              <ActionIcon 
                                variant="filled" 
                                color="red" 
                                onClick={() => deleteItem(index)}
                                radius="xl"
                                size="md"
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Box>
                      )}
                    </Transition>
                  </Box>
                )}
              </Timeline.Item>
            ))}

            {/* Add button at the end of timeline */}
            {!showAddForm && (
              <Timeline.Item bullet={<IconPlus size={12} />} title="">
                <Button 
                  variant="subtle" 
                  color="gray" 
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {
                    reset({
                      title: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                      status: 'upcoming',
                      color: '#228be6',
                      type: 'registration',
                      alert: {
                        title: '',
                        content: '',
                        type: 'info',
                      },
                      links: [],
                    });
                    setShowAddForm(true);
                    setInlineEditIndex(null);
                  }}
                  mt={-10}
                >
                  Thêm mục mới
                </Button>
              </Timeline.Item>
            )}
          </Timeline>
        </Paper>

        {/* Table View */}
        <Tabs defaultValue="all">
          <Tabs.List mb="md">
            <Tabs.Tab value="all" leftSection={<IconFilter size={14} />}>
              Tất cả (<Text span fw={700}>{timelineItems.length}</Text>)
            </Tabs.Tab>
            <Tabs.Tab value="visible" leftSection={<IconEye size={14} />}>
              Đang hiển thị (<Text span fw={700}>{timelineItems.filter(i => !i.hidden).length}</Text>)
            </Tabs.Tab>
            <Tabs.Tab value="hidden" leftSection={<IconEyeOff size={14} />}>
              Đã ẩn (<Text span fw={700}>{timelineItems.filter(i => i.hidden).length}</Text>)
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all">
            <Title order={3} mb="md">Danh sách Timeline</Title>
            <Table striped withTableBorder mb="xl">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tiêu đề</Table.Th>
                  <Table.Th>Thời gian</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Hiển thị</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {timelineItems.map((item, index) => (
                  <Table.Tr key={index} style={{ opacity: item.hidden ? 0.6 : 1 }}>
                    <Table.Td>{item.title}</Table.Td>
                    <Table.Td>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Table.Td>
                    <Table.Td>
                      <Text
                        c={getStatusColor(item.status)}
                      >
                        {statusOptions.find((opt) => opt.value === item.status)?.label}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {item.hidden ? <Text c="red">Ẩn</Text> : <Text c="green">Hiển thị</Text>}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Chỉnh sửa">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleStartInlineEdit(index)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label={item.hidden ? "Hiện" : "Ẩn"}>
                          <ActionIcon
                            variant="light"
                            color={item.hidden ? "green" : "gray"}
                            onClick={() => toggleItemVisibility(index)}
                          >
                            {item.hidden ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Xóa">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => deleteItem(index)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="visible">
            <Title order={3} mb="md">Danh sách Timeline (Đang hiển thị)</Title>
            <Table striped withTableBorder mb="xl">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tiêu đề</Table.Th>
                  <Table.Th>Thời gian</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {timelineItems.filter(item => !item.hidden).map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{item.title}</Table.Td>
                    <Table.Td>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Table.Td>
                    <Table.Td>
                      <Text
                        c={getStatusColor(item.status)}
                      >
                        {statusOptions.find((opt) => opt.value === item.status)?.label}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Chỉnh sửa">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleStartInlineEdit(timelineItems.findIndex(i => i.title === item.title))}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Ẩn">
                          <ActionIcon
                            variant="light"
                            color="gray"
                            onClick={() => toggleItemVisibility(timelineItems.findIndex(i => i.title === item.title))}
                          >
                            <IconEyeOff size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Xóa">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => deleteItem(timelineItems.findIndex(i => i.title === item.title))}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="hidden">
            <Title order={3} mb="md">Danh sách Timeline (Đã ẩn)</Title>
            <Table striped withTableBorder mb="xl">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tiêu đề</Table.Th>
                  <Table.Th>Thời gian</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {timelineItems.filter(item => item.hidden).map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{item.title}</Table.Td>
                    <Table.Td>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Table.Td>
                    <Table.Td>
                      <Text
                        c={getStatusColor(item.status)}
                      >
                        {statusOptions.find((opt) => opt.value === item.status)?.label}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Chỉnh sửa">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleStartInlineEdit(timelineItems.findIndex(i => i.title === item.title))}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Hiện">
                          <ActionIcon
                            variant="light"
                            color="green"
                            onClick={() => toggleItemVisibility(timelineItems.findIndex(i => i.title === item.title))}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Xóa">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => deleteItem(timelineItems.findIndex(i => i.title === item.title))}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
} 
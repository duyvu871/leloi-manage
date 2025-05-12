import { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Modal,
  TextInput,
  Textarea,
  Select,
  Group,
  Stack,
  ActionIcon,
  Table,
  Text,
  ColorInput,
  MultiSelect,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconEdit, IconTrash, IconPlus, IconDownload } from '@tabler/icons-react';

// Define the schema for timeline data
const timelineSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  startDate: z.date({
    required_error: 'Vui lòng chọn ngày bắt đầu',
    invalid_type_error: 'Ngày không hợp lệ',
  }),
  endDate: z.date({
    required_error: 'Vui lòng chọn ngày kết thúc',
    invalid_type_error: 'Ngày không hợp lệ',
  }),
  description: z.string().min(1, 'Mô tả không được để trống'),
  status: z.enum(['active', 'upcoming', 'completed']),
  color: z.string().min(1, 'Vui lòng chọn màu'),
  alert: z.object({
    title: z.string().min(1, 'Tiêu đề cảnh báo không được để trống'),
    content: z.string().min(1, 'Nội dung cảnh báo không được để trống'),
    type: z.enum(['info', 'warning']),
  }),
  links: z.array(
    z.object({
      text: z.string().min(1, 'Tên liên kết không được để trống'),
      url: z.string().url('URL không hợp lệ'),
    })
  ),
});

type TimelineFormData = z.infer<typeof timelineSchema>;

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

export default function TimelineManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineFormData[]>([]);
  const [linkErrors, setLinkErrors] = useState<Array<{ text?: string; url?: string }>>([]);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<TimelineFormData>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      links: [],
    },
  });

  const onSubmit = async (data: TimelineFormData) => {
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

    if (editingIndex !== null) {
      // Edit existing item
      const newItems = [...timelineItems];
      newItems[editingIndex] = data;
      setTimelineItems(newItems);
    } else {
      // Add new item
      setTimelineItems([...timelineItems, data]);
    }
    closeModal();
  };

  const openModal = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      reset(timelineItems[index]);
    } else {
      setEditingIndex(null);
      reset({
        title: '',
        description: '',
        status: 'upcoming',
        color: '#228be6',
        alert: {
          title: '',
          content: '',
          type: 'info',
        },
        links: [],
      });
    }
    setLinkErrors([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setLinkErrors([]);
    reset();
  };

  const deleteItem = (index: number) => {
    const newItems = timelineItems.filter((_, i) => i !== index);
    setTimelineItems(newItems);
  };

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

  const handleExportData = () => {
    // Convert dates to ISO strings for better readability
    const exportData = timelineItems.map(item => ({
      ...item,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString()
    }));

    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    
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
  };

  return (
    <Container size="xl" py="xl">
      <Paper p="md" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <Title order={2}>Quản lý Timeline</Title>
          <Group>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportData}
              disabled={timelineItems.length === 0}
            >
              Xuất dữ liệu
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => openModal()}
            >
              Thêm mục mới
            </Button>
          </Group>
        </Group>

        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tiêu đề</Table.Th>
              <Table.Th>Thời gian</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {timelineItems.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>{item.title}</Table.Td>
                <Table.Td>
                  {item.startDate.toLocaleDateString('vi-VN')} -{' '}
                  {item.endDate.toLocaleDateString('vi-VN')}
                </Table.Td>
                <Table.Td>
                  <Text
                    c={
                      item.status === 'active'
                        ? 'green'
                        : item.status === 'upcoming'
                        ? 'blue'
                        : 'gray'
                    }
                  >
                    {statusOptions.find((opt) => opt.value === item.status)?.label}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => openModal(index)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => deleteItem(index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Modal
          opened={isModalOpen}
          onClose={closeModal}
          title={
            <Text fw={500} size="lg">
              {editingIndex !== null ? 'Chỉnh sửa mục' : 'Thêm mục mới'}
            </Text>
          }
          size="70vw"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    label="Tiêu đề"
                    placeholder="Nhập tiêu đề"
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
                  render={({ field, fieldState: { error } }) => (
                    <DateInput
                      label="Ngày bắt đầu"
                      placeholder="DD/MM/YYYY"
                      error={error?.message}
                      required
                      valueFormat="DD/MM/YYYY"
                      locale='vi'
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DateInput
                      label="Ngày kết thúc"
                      placeholder="DD/MM/YYYY"
                      error={error?.message}
                      required
                      valueFormat="DD/MM/YYYY"
                      locale='vi'
                      {...field}
                    />
                  )}
                />
              </Group>

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Textarea
                    label="Mô tả"
                    placeholder="Nhập mô tả"
                    error={error?.message}
                    required
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
                      data={statusOptions}
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

              <Title order={4}>Cảnh báo</Title>
              <Controller
                name="alert.title"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    label="Tiêu đề cảnh báo"
                    placeholder="Nhập tiêu đề cảnh báo"
                    error={error?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="alert.content"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Textarea
                    label="Nội dung cảnh báo"
                    placeholder="Nhập nội dung cảnh báo"
                    error={error?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="alert.type"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    label="Loại cảnh báo"
                    placeholder="Chọn loại cảnh báo"
                    data={alertTypeOptions}
                    error={error?.message}
                    required
                    {...field}
                  />
                )}
              />

              <Title order={4}>Liên kết</Title>
              <Controller
                name="links"
                control={control}
                render={({ field }) => (
                  <Stack gap="sm">
                    {field.value.map((link, index) => (
                      <Group key={index} wrap="nowrap">
                        <TextInput
                          placeholder="Tên liên kết"
                          w={"100%"}
                          value={link.text}
                          error={linkErrors[index]?.text}
                          onChange={(e) => {
                            const newLinks = [...field.value];
                            newLinks[index] = {
                              ...newLinks[index],
                              text: e.target.value,
                            };
                            field.onChange(newLinks);
                            validateLink(index, 'text', e.target.value);
                          }}
                          onBlur={() => validateLink(index, 'text', link.text)}
                        />
                        <TextInput
                          placeholder="URL"
                          w={"100%"}
                          value={link.url}
                          error={linkErrors[index]?.url}
                          onChange={(e) => {
                            const newLinks = [...field.value];
                            newLinks[index] = {
                              ...newLinks[index],
                              url: e.target.value,
                            };
                            field.onChange(newLinks);
                            validateLink(index, 'url', e.target.value);
                          }}
                          onBlur={() => validateLink(index, 'url', link.url)}
                        />
                        <ActionIcon
                          variant="light"
                          color="red"
                          w={20}
                          h={20}
                          onClick={() => {
                            const newLinks = field.value.filter(
                              (_, i) => i !== index
                            );
                            field.onChange(newLinks);
                            const newErrors = linkErrors.filter((_, i) => i !== index);
                            setLinkErrors(newErrors);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    ))}
                    <Button
                      variant="light"
                      onClick={() => {
                        field.onChange([
                          ...field.value,
                          { text: '', url: '' },
                        ]);
                        setLinkErrors([...linkErrors, {}]);
                      }}
                    >
                      Thêm liên kết
                    </Button>
                  </Stack>
                )}
              />

              <Group justify="flex-end" mt="xl">
                <Button variant="light" onClick={closeModal}>
                  Hủy
                </Button>
                <Button type="submit" color="blue">
                  {editingIndex !== null ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Paper>
    </Container>
  );
} 
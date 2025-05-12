import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  Button,
  Group,
  Stack,
  Title,
  Text,
  Modal,
  Alert,
  Textarea,
  Checkbox,
  Paper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import { submitFeedback } from '@/libs/apis/feedback';
import useToast from '@/hooks/client/use-toast-notification';

// Simplified validation schema
const feedbackSchema = z.object({
  type: z.enum(['error', 'suggestion', 'other', 'missing'], {
    required_error: 'Vui lòng chọn loại phản ánh',
  }),
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  needSupport: z.boolean().default(false),
  needCallback: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  useModal?: boolean;
  onSuccess?: () => void;
}

export default function FeedbackForm({ useModal = true, onSuccess }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'error',
      needSupport: false,
      needCallback: false,
      isUrgent: false,
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      setIsSubmitting(true);
      await submitFeedback({
          type: data.type,
          content: `${data.content}\n\nTùy chọn bổ sung:\n${data.needSupport ? '- Cần hỗ trợ thêm\n' : ''}${data.needCallback ? '- Cần gọi lại\n' : ''}${data.isUrgent ? '- Vấn đề khẩn cấp' : ''}`,
          needSupport: data.needSupport,
          needCallback: data.needCallback,
          isUrgent: data.isUrgent
      });
      showSuccessToast('Cảm ơn bạn đã gửi phản ánh. Chúng tôi sẽ xem xét sớm nhất!');
      reset();
      if (useModal) close();
      onSuccess?.();
    } catch (error: any) {
      showErrorToast(error.message || 'Có lỗi xảy ra khi gửi phản ánh');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Alert icon={<IconAlertCircle size={16} />} color="blue">
          <Text size="sm">
            Vui lòng cung cấp thông tin chi tiết để chúng tôi có thể hỗ trợ bạn tốt nhất.
          </Text>
        </Alert>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Loại phản ánh"
              placeholder="Chọn loại phản ánh"
              data={[
                { value: 'missing', label: 'Thiếu thông tin' },
                { value: 'error', label: 'Báo lỗi' },
                { value: 'suggestion', label: 'Góp ý' },
                { value: 'other', label: 'Khác' },
              ]}
              error={errors.type?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Textarea
              label="Nội dung"
              placeholder="Mô tả chi tiết vấn đề của bạn"
              minRows={5}
              rows={5}
              error={errors.content?.message}
              required
              {...field}
            />
          )}
        />

        <Stack gap="xs">
          <Text size="sm" fw={500}>Tùy chọn bổ sung:</Text>
          <Controller
            name="needSupport"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Tôi cần được hỗ trợ thêm về vấn đề này"
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
              />
            )}
          />

          <Controller
            name="needCallback"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Tôi muốn được gọi điện trao đổi trực tiếp"
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
              />
            )}
          />

          <Controller
            name="isUrgent"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Đây là vấn đề khẩn cấp"
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
              />
            )}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          {useModal && (
            <Button variant="subtle" onClick={close} disabled={isSubmitting}>
              Hủy
            </Button>
          )}
          <Button type="submit" loading={isSubmitting}>
            Gửi phản ánh
          </Button>
        </Group>
      </Stack>
    </form>
  );

  if (useModal) {
    return (
      <>
        <Button onClick={open} variant="light" size="sm">
          Báo cáo sai sót
        </Button>

        <Modal
          opened={opened}
          onClose={close}
          title={<Title order={4}>Gửi phản ánh</Title>}
          size="md"
          centered
        >
          <FormContent />
        </Modal>
      </>
    );
  }

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">Gửi phản ánh</Title>
      <FormContent />
    </Paper>
  );
} 
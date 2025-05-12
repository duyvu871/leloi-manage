import { Alert, Space, Stack, Text } from "@mantine/core";
import FeedbackForm from "./FeedbackForm";

export default function FeedbackCard({}) {
    return (
        <Alert
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
        </Alert>
    );
}

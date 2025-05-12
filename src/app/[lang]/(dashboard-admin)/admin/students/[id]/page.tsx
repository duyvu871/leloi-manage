'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Card,
    Group,
    Text,
    Badge,
    Button,
    Table,
    LoadingOverlay,
    Alert,
    Stack,
    Grid,
    Divider,
    Modal,
    Select,
    Textarea,
    TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconCheck, IconX, IconArrowLeft } from '@tabler/icons-react';
import * as adminApi from '@/libs/apis/admin';
import useToast from '@/hooks/client/use-toast-notification';
import { useRouter } from 'next/navigation';
import StudentDocuments from '@/components/admin/student-documents';

interface Props {
    params: {
        id: string;
    };
}

export default function StudentDetailsPage({ params }: Props) {
    const router = useRouter();
    const { showSuccessToast, showErrorToast } = useToast();
    const [opened, { open, close }] = useDisclosure(false);

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [student, setStudent] = useState<adminApi.StudentDetailDto | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [reason, setReason] = useState('');
    const [examInfo, setExamInfo] = useState({
        sbd: '',
        room: '',
        date: '',
        time: '',
    });

    // Load student details
    useEffect(() => {
        loadStudentDetails();
    }, [params.id]);

    const loadStudentDetails = async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.getStudentDetails(params.id);
            setStudent(response);
        } catch (error: any) {
            showErrorToast(error.message || 'Failed to load student details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            setIsLoading(true);
            await adminApi.updateStudentStatus(params.id, {
                status: newStatus as any,
                reason: reason || undefined,
                examInfo: newStatus === 'eligible' || newStatus === 'confirmed' ? examInfo : undefined,
            });

            showSuccessToast('Cập nhật trạng thái thành công');
            close();
            loadStudentDetails();
        } catch (error: any) {
            showErrorToast(error.message || 'Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
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

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    if (!student) {
        return (
            <Container size="xl" py="xl">
                <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                    Loading student details...
                </Alert>
            </Container>
        );
    }

    return (
        <Container
            size="xl"
            pb="2xl"
        >
            <Stack gap="lg">
                {/* Back Button */}
                <Button
                    variant="subtle"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={() => router.back()}
                    style={{ alignSelf: 'flex-start' }}
                >
                    Quay lại
                </Button>

                {/* Basic Information */}
                <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
                    <LoadingOverlay visible={isLoading} />

                    <Group justify="space-between" mb="xl">
                        <Title order={2}>Thông tin học sinh</Title>
                        <Button onClick={open}>Cập nhật trạng thái</Button>
                    </Group>

                    <Grid>
                        <Grid.Col span={6}>
                            <Stack>
                                <div>
                                    <Text size="sm" c="dimmed">Mã học sinh</Text>
                                    <Text fw={500}>{student.student.id}</Text>
                                </div>
                                <div>
                                    <Text size="sm" c="dimmed">Họ tên</Text>
                                    <Text fw={500}>{student.student.fullName}</Text>
                                </div>
                                <div>
                                    <Text size="sm" c="dimmed">Ngày sinh</Text>
                                    <Text fw={500}>{formatDate(student.student.dateOfBirth)}</Text>
                                </div>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Stack>
                                <div>
                                    <Text size="sm" c="dimmed">Giới tính</Text>
                                    <Text fw={500}>{student.student.gender === 'male' ? 'Nam' : 'Nữ'}</Text>
                                </div>
                                <div>
                                    <Text size="sm" c="dimmed">Trường</Text>
                                    <Text fw={500}>{student.student.educationDepartment}</Text>
                                </div>
                                <div>
                                    <Text size="sm" c="dimmed">Trạng thái</Text>
                                    <Badge color={getStatusColor(student.status.currentStatus)}>
                                        {student.status.currentStatus === 'eligible' ? 'Đủ điều kiện'
                                            : student.status.currentStatus === 'ineligible' ? 'Không đủ điều kiện'
                                                : student.status.currentStatus === 'pending' ? 'Đang xét duyệt'
                                                    : 'Đã xác nhận'
                                        }
                                    </Badge>
                                </div>
                            </Stack>
                        </Grid.Col>
                    </Grid>

                    {student.status.reason && (
                        <Alert icon={<IconAlertCircle size={16} />} color="red" mt="md">
                            <Text fw={500}>Lý do:</Text>
                            {student.status.reason}
                        </Alert>
                    )}

                    {student.status.examInfo && (
                        <Alert icon={<IconCheck size={16} />} color="green" mt="md">
                            <Text fw={500}>Thông tin thi:</Text>
                            <Text>Số báo danh: {student.status.examInfo.sbd}</Text>
                            <Text>Phòng thi: {student.status.examInfo.room}</Text>
                            <Text>Ngày thi: {student.status.examInfo.date}</Text>
                            <Text>Giờ thi: {student.status.examInfo.time}</Text>
                        </Alert>
                    )}
                </Card>

                {/* Parent Information */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="xl">Thông tin phụ huynh</Title>

                    <Stack>
                        {student.parent.fatherName && (
                            <div>
                                <Text fw={500}>Cha:</Text>
                                <Text>Họ tên: {student.parent.fatherName}</Text>
                                <Text>Số điện thoại: {student.parent.fatherPhone}</Text>
                            </div>
                        )}

                        {student.parent.motherName && (
                            <div>
                                <Text fw={500}>Mẹ:</Text>
                                <Text>Họ tên: {student.parent.motherName}</Text>
                                <Text>Số điện thoại: {student.parent.motherPhone}</Text>
                            </div>
                        )}

                        {student.parent.guardianName && (
                            <div>
                                <Text fw={500}>Người giám hộ:</Text>
                                <Text>Họ tên: {student.parent.guardianName}</Text>
                                <Text>Số điện thoại: {student.parent.guardianPhone}</Text>
                            </div>
                        )}
                    </Stack>
                </Card>

                {/* Academic Records */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="xl">Kết quả học tập</Title>

                    <Table withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Lớp</Table.Th>
                                <Table.Th>Môn Toán</Table.Th>
                                <Table.Th>Tiếng Việt</Table.Th>
                                <Table.Th>Tiếng Anh</Table.Th>
                                <Table.Th>Khoa học</Table.Th>
                                <Table.Th>Lịch sử và Địa lí</Table.Th>
                                <Table.Th>Khen thưởng</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {student.academicRecords.grades.map((grade, index) => (
                                <Table.Tr key={index}>
                                    <Table.Td>{grade.grade}</Table.Td>
                                    <Table.Td>{grade.math ?? '—'}</Table.Td>
                                    <Table.Td>{grade.vietnamese ?? '—'}</Table.Td>
                                    <Table.Td>{grade.grade <= 2 ? '—' : grade.english ?? '—'}</Table.Td>
                                    <Table.Td>{grade.grade === 1 ? '—' : grade.science ?? '—'}</Table.Td>
                                    <Table.Td>{grade.grade <= 3 ? '—' : grade.history ?? '—'}</Table.Td>
                                    <Table.Td>{'—'}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {student.transcriptData.behavior && (
                        <Text mt="md">
                            <Text span fw={500}>Hạnh kiểm:</Text> {student.transcriptData.behavior}
                        </Text>
                    )}

                    {student.transcriptData.attendanceRate && (
                        <Text mt="xs">
                            <Text span fw={500}>Tỷ lệ chuyên cần:</Text> {student.transcriptData.attendanceRate}
                        </Text>
                    )}

                    {student.transcriptData.teacherComments && (
                        <Text mt="xs">
                            <Text span fw={500}>Nhận xét của giáo viên:</Text> {student.transcriptData.teacherComments}
                        </Text>
                    )}
                </Card>

                {/* Certificates */}
                {student.certificates.length > 0 && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="xl">Chứng chỉ</Title>

                        <Stack>
                            {student.certificates.map((cert, index) => (
                                <Text key={index}>{cert}</Text>
                            ))}
                        </Stack>
                    </Card>
                )}

                <StudentDocuments studentId={params.id} />
            </Stack>



            {/* Update Status Modal */}
            <Modal opened={opened} onClose={close} title="Cập nhật trạng thái" size="lg">
                <Stack>
                    <Select
                        label="Trạng thái mới"
                        placeholder="Chọn trạng thái"
                        value={newStatus}
                        onChange={(value) => {
                            setNewStatus(value || '');
                            // Reset reason when changing status
                            if (value !== 'ineligible') {
                                setReason('');
                            }
                        }}
                        data={[
                            { value: 'eligible', label: 'Đủ điều kiện' },
                            { value: 'ineligible', label: 'Không đủ điều kiện' },
                            { value: 'pending', label: 'Đang xét duyệt' },
                            { value: 'confirmed', label: 'Đã xác nhận' },
                        ]}
                        required
                    />

                    {newStatus === 'ineligible' && (
                        <Textarea
                            label="Lý do"
                            placeholder="Nhập lý do không đủ điều kiện"
                            value={reason}
                            onChange={(e) => setReason(e.currentTarget.value)}
                            required
                        />
                    )}

                    {(newStatus === 'eligible' || newStatus === 'confirmed') && (
                        <>
                            <TextInput
                                label="Số báo danh"
                                placeholder="Nhập số báo danh"
                                value={examInfo.sbd}
                                onChange={(e) => setExamInfo({ ...examInfo, sbd: e.currentTarget.value })}
                                required
                            />
                            <TextInput
                                label="Phòng thi"
                                placeholder="Nhập phòng thi"
                                value={examInfo.room}
                                onChange={(e) => setExamInfo({ ...examInfo, room: e.currentTarget.value })}
                                required
                            />
                            <TextInput
                                label="Ngày thi"
                                placeholder="Nhập ngày thi"
                                value={examInfo.date}
                                onChange={(e) => setExamInfo({ ...examInfo, date: e.currentTarget.value })}
                                required
                            />
                            <TextInput
                                label="Giờ thi"
                                placeholder="Nhập giờ thi"
                                value={examInfo.time}
                                onChange={(e) => setExamInfo({ ...examInfo, time: e.currentTarget.value })}
                                required
                            />
                        </>
                    )}

                    <Group justify="flex-end" mt="xl">
                        <Button variant="light" onClick={close}>Hủy</Button>
                        <Button onClick={handleUpdateStatus}>Cập nhật</Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
} 
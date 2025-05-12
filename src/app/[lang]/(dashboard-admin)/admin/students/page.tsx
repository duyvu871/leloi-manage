'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  Group,
  TextInput,
  Select,
  Button,
  Badge,
  ActionIcon,
  Card,
  Text,
  LoadingOverlay,
  Pagination,
} from '@mantine/core';
import { IconSearch, IconEye, IconEdit } from '@tabler/icons-react';
import * as adminApi from '@/libs/apis/admin';
import useToast from '@/hooks/client/use-toast-notification';
import { useRouter } from 'next/navigation';

export default function AdminStudentsPage() {
  const router = useRouter();
  const { showErrorToast } = useToast();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<adminApi.StudentListItemDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  // Load students
  useEffect(() => {
    loadStudents();
  }, [currentPage, statusFilter, genderFilter]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getStudentList({
        page: currentPage,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
        gender: genderFilter || undefined,
      });

      setStudents(response.data);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadStudents();
  };

  const handleViewDetails = (id: string) => {
    router.push(`/admin/students/${id}`);
  };

  const handleEditStatus = (id: string) => {
    router.push(`/admin/students/${id}/edit`);
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <Container size="xl" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={isLoading} />
        
        <Title order={2} mb="xl">Quản lý học sinh</Title>

        {/* Filters */}
        <Group mb="lg">
          <TextInput
            placeholder="Tìm kiếm theo tên hoặc mã học sinh"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            rightSection={
              <ActionIcon onClick={handleSearch}>
                <IconSearch size={16} />
              </ActionIcon>
            }
            style={{ flex: 1 }}
          />
          
          <Select
            placeholder="Trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            data={[
              { value: '', label: 'Tất cả' },
              { value: 'eligible', label: 'Đủ điều kiện' },
              { value: 'ineligible', label: 'Không đủ điều kiện' },
              { value: 'pending', label: 'Đang xét duyệt' },
              { value: 'confirmed', label: 'Đã xác nhận' },
            ]}
            clearable
          />

          <Select
            placeholder="Giới tính"
            value={genderFilter}
            onChange={setGenderFilter}
            data={[
              { value: '', label: 'Tất cả' },
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
            ]}
            clearable
          />
        </Group>

        {/* Students Table */}
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Mã học sinh</Table.Th>
              <Table.Th>Họ tên</Table.Th>
              <Table.Th>Ngày sinh</Table.Th>
              <Table.Th>Giới tính</Table.Th>
              <Table.Th>Trường</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Cập nhật</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {students.map((student) => (
              <Table.Tr key={student.id}>
                <Table.Td>{student.studentId}</Table.Td>
                <Table.Td>{student.name}</Table.Td>
                <Table.Td>{formatDate(student.dob)}</Table.Td>
                <Table.Td>{student.gender === 'male' ? 'Nam' : 'Nữ'}</Table.Td>
                <Table.Td>{student.currentSchool}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(student.status)}>
                    {student.status === 'eligible' ? 'Đủ điều kiện'
                      : student.status === 'ineligible' ? 'Không đủ điều kiện'
                      : student.status === 'pending' ? 'Đang xét duyệt'
                      : 'Đã xác nhận'
                    }
                  </Badge>
                </Table.Td>
                <Table.Td>{formatDate(student.lastUpdated)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleViewDetails(String(student.id))}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="yellow"
                      onClick={() => handleEditStatus(String(student.id))}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {/* Pagination */}
        <Group justify="center" mt="xl">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
          />
        </Group>
      </Card>
    </Container>
  );
} 
'use client';

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Text, 
  TextInput, 
  Button, 
  Select, 
  Badge, 
  Table, 
  Group, 
  ActionIcon,
  Pagination,
  Collapse 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconSearch, 
  IconFilter, 
  IconEye,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import StudentDetailModal from './student-detail-modal';
// import StudentDetailModal from './student-detail-modal';

interface Student {
  id: string;
  name: string;
  dob: string;
  school: string;
  status: 'eligible' | 'ineligible' | 'pending' | 'confirmed';
}

export default function StudentsList() {
  const t = useTranslations('admin');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, { toggle: toggleFilters }] = useDisclosure(false);
  
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [schoolFilter, setSchoolFilter] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // Fetch students from API
    // This is a mock implementation
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('/api/admin/students');
        // const data = await response.json();
        
        // For now, using mock data
        setTimeout(() => {
          const mockStudents = Array(28).fill(null).map((_, index) => ({
            id: `HS${10000 + index}`,
            name: `Học sinh ${index + 1}`,
            dob: '15/03/2010',
            school: `Trường THCS ${['Nguyễn Trãi', 'Lê Quý Đôn', 'Chu Văn An'][index % 3]}`,
            status: ['eligible', 'ineligible', 'pending', 'confirmed'][index % 4] as 'eligible' | 'ineligible' | 'pending' | 'confirmed'
          }));

          setStudents(mockStudents.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE));
          setTotalStudents(mockStudents.length);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [activePage]);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleApplyFilters = () => {
    // Implement filter functionality
    console.log('Applying filters:', { statusFilter, genderFilter, schoolFilter });
    toggleFilters();
  };
  
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'eligible':
        return <Badge color="green">{t('students.statusEligible')}</Badge>;
      case 'ineligible':
        return <Badge color="red">{t('students.statusIneligible')}</Badge>;
      case 'pending':
        return <Badge color="yellow">{t('students.statusPending')}</Badge>;
      case 'confirmed':
        return <Badge color="blue">{t('students.statusConfirmed')}</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Text fw={500} className="text-primary text-xl">{t('students.listTitle')}</Text>
      </Card.Section>
      
      <div className="mb-6 mt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <TextInput
              placeholder={t('students.searchPlaceholder')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconFilter size={16} />}
            onClick={toggleFilters}
          >
            {t('students.advancedFilters')}
          </Button>
        </div>
        
        <Collapse in={showFilters}>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label={t('students.filterStatus')}
                placeholder={t('students.filterAllStatus')}
                data={[
                  { value: 'eligible', label: t('students.statusEligible') },
                  { value: 'ineligible', label: t('students.statusIneligible') },
                  { value: 'pending', label: t('students.statusPending') },
                  { value: 'confirmed', label: t('students.statusConfirmed') }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
              />
              <Select
                label={t('students.filterGender')}
                placeholder={t('students.filterAllGenders')}
                data={[
                  { value: 'male', label: t('students.genderMale') },
                  { value: 'female', label: t('students.genderFemale') }
                ]}
                value={genderFilter}
                onChange={setGenderFilter}
                clearable
              />
              <TextInput
                label={t('students.filterSchool')}
                placeholder={t('students.filterSchoolPlaceholder')}
                value={schoolFilter}
                onChange={(event) => setSchoolFilter(event.currentTarget.value)}
              />
            </div>
            <Group justify="flex-end" mt="md">
              <Button onClick={handleApplyFilters} color="blue">
                {t('students.applyFilters')}
              </Button>
            </Group>
          </div>
        </Collapse>
      </div>
      
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('students.columnID')}</Table.Th>
              <Table.Th>{t('students.columnName')}</Table.Th>
              <Table.Th>{t('students.columnDOB')}</Table.Th>
              <Table.Th>{t('students.columnSchool')}</Table.Th>
              <Table.Th>{t('students.columnStatus')}</Table.Th>
              <Table.Th>{t('students.columnActions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center py-4">{t('students.loading')}</Table.Td>
              </Table.Tr>
            ) : students.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center py-4">{t('students.noStudentsFound')}</Table.Td>
              </Table.Tr>
            ) : (
              students.map((student) => (
                <Table.Tr key={student.id}>
                  <Table.Td>{student.id}</Table.Td>
                  <Table.Td>{student.name}</Table.Td>
                  <Table.Td>{student.dob}</Table.Td>
                  <Table.Td>{student.school}</Table.Td>
                  <Table.Td>{getStatusBadge(student.status)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon 
                        variant="subtle" 
                        color="blue"
                        onClick={() => handleViewStudent(student)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red">
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>
      
      <Group justify="space-between" mt="md">
        <Text size="sm" c="dimmed">
          {t('students.showingRecords', {
            showing: Math.min(ITEMS_PER_PAGE, totalStudents - (activePage - 1) * ITEMS_PER_PAGE),
            total: totalStudents
          })}
        </Text>
        <Pagination
          total={Math.ceil(totalStudents / ITEMS_PER_PAGE)}
          value={activePage}
          onChange={handlePageChange}
          withEdges
        />
      </Group>
      
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          opened={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      )}
    </Card>
  );
}
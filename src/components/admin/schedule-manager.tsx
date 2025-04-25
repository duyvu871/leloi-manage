'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Text, 
  Button, 
  Group, 
  Collapse,
  TextInput,
  NumberInput,
  Select,
  Badge,
  ActionIcon,
  Paper
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconCalendar, IconClock, IconUsers, IconEdit, IconTrash } from '@tabler/icons-react';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { useTranslations } from 'next-intl';

interface ScheduleSlot {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  totalSlots: number;
  maxStudentsPerSlot: number;
  availableSlots: number;
  registeredStudents: number;
}

export default function ScheduleManager() {
  const t = useTranslations('admin');
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showForm, { toggle: toggleForm }] = useDisclosure(false);
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [totalSlots, setTotalSlots] = useState<number | string>(5);
  const [maxStudentsPerSlot, setMaxStudentsPerSlot] = useState<number | string>(10);
  
  useEffect(() => {
    // Fetch schedules from API
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch('/api/admin/schedules');
        // const data = await response.json();
        
        // Mock data
        setTimeout(() => {
          const currentDate = new Date();
          const mockSchedules: ScheduleSlot[] = [
            {
              id: 1,
              date: new Date(currentDate.setDate(currentDate.getDate() + 7)),
              startTime: '08:00',
              endTime: '11:30',
              totalSlots: 5,
              maxStudentsPerSlot: 10,
              availableSlots: 3,
              registeredStudents: 12
            },
            {
              id: 2,
              date: new Date(currentDate.setDate(currentDate.getDate() + 1)),
              startTime: '13:30',
              endTime: '16:00',
              totalSlots: 4,
              maxStudentsPerSlot: 10,
              availableSlots: 0,
              registeredStudents: 40
            },
            {
              id: 3,
              date: new Date(currentDate.setDate(currentDate.getDate() + 3)),
              startTime: '08:00',
              endTime: '16:00',
              totalSlots: 8,
              maxStudentsPerSlot: 15,
              availableSlots: 6,
              registeredStudents: 34
            }
          ];
          setSchedules(mockSchedules);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
        setLoading(false);
      }
    };
    
    fetchSchedules();
  }, []);
  
  const handleSaveSchedule = () => {
    if (!date || totalSlots === '' || maxStudentsPerSlot === '') {
      // Show validation error
      return;
    }
    
    const newSchedule: ScheduleSlot = {
      id: schedules.length + 1,
      date: date,
      startTime,
      endTime,
      totalSlots: +totalSlots,
      maxStudentsPerSlot: +maxStudentsPerSlot,
      availableSlots: +totalSlots,
      registeredStudents: 0
    };
    
    setSchedules([...schedules, newSchedule]);
    
    // Reset form
    setDate(null);
    setStartTime('08:00');
    setEndTime('16:00');
    setTotalSlots(5);
    setMaxStudentsPerSlot(10);
    toggleForm();
    
    // Call API to save schedule
    // await fetch('/api/admin/schedules', { method: 'POST', body: JSON.stringify(newSchedule) })
  };
  
  const handleCancelForm = () => {
    // Reset form
    setDate(null);
    setStartTime('08:00');
    setEndTime('16:00');
    setTotalSlots(5);
    setMaxStudentsPerSlot(10);
    toggleForm();
  };
  
  const handleDeleteSchedule = (id: number) => {
    if (window.confirm(t('schedule.deleteConfirmation'))) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      // Call API to delete schedule
      // await fetch(`/api/admin/schedules/${id}`, { method: 'DELETE' })
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Text fw={500} className="text-primary text-xl">{t('schedule.title')}</Text>
      </Card.Section>
      
      <div className="mb-6 mt-6">
        <Button
          onClick={toggleForm}
          leftSection={<IconPlus size={16} />}
          color="blue"
        >
          {t('schedule.addNewButton')}
        </Button>
      </div>
      
      <Collapse in={showForm}>
        <Paper withBorder p="md" radius="md" className="mb-6 bg-gray-50">
          <Text fw={500} mb="md">{t('schedule.formTitle')}</Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <DatePickerInput
              label={t('schedule.date')}
              placeholder={t('schedule.datePlaceholder')}
              value={date}
              onChange={setDate}
              leftSection={<IconCalendar size={16} />}
              minDate={new Date()}
              required
            />
            <NumberInput
              label={t('schedule.totalSlots')}
              placeholder={t('schedule.totalSlotsPlaceholder')}
              value={totalSlots}
              onChange={setTotalSlots}
              min={1}
              max={10}
              required
            />
          </div>
          
          <div className="mb-4">
            <Text size="sm" fw={500} mb={5}>{t('schedule.timeRange')}</Text>
            <Group grow>
              <TimeInput
                label={t('schedule.startTime')}
                value={startTime}
                onChange={(event) => setStartTime(event.currentTarget.value)}
                leftSection={<IconClock size={16} />}
              />
              <TimeInput
                label={t('schedule.endTime')}
                value={endTime}
                onChange={(event) => setEndTime(event.currentTarget.value)}
                leftSection={<IconClock size={16} />}
              />
            </Group>
          </div>
          
          <div className="mb-4">
            <NumberInput
              label={t('schedule.maxStudentsPerSlot')}
              placeholder={t('schedule.maxStudentsPlaceholder')}
              value={maxStudentsPerSlot}
              onChange={setMaxStudentsPerSlot}
              min={1}
              max={50}
              leftSection={<IconUsers size={16} />}
              required
            />
          </div>
          
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" color="gray" onClick={handleCancelForm}>
              {t('schedule.cancel')}
            </Button>
            <Button color="blue" onClick={handleSaveSchedule}>
              {t('schedule.save')}
            </Button>
          </Group>
        </Paper>
      </Collapse>
      
      <div className="space-y-4">
        {loading ? (
          <Text className="text-center py-4">{t('schedule.loading')}</Text>
        ) : schedules.length === 0 ? (
          <Text className="text-center py-4">{t('schedule.noSchedules')}</Text>
        ) : (
          schedules.map(schedule => (
            <Paper key={schedule.id} withBorder p="md" radius="md" className="relative">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <Text fw={500} size="lg" className="mb-1">{formatDate(schedule.date)}</Text>
                  <Text size="sm" c="dimmed" className="mb-3">
                    {schedule.startTime} - {schedule.endTime} | {schedule.totalSlots} {t('schedule.slots')}
                  </Text>
                  
                  <Group mb="sm">
                    <Badge color={schedule.availableSlots > 0 ? 'green' : 'red'}>
                      {schedule.availableSlots} / {schedule.totalSlots} {t('schedule.availableSlots')}
                    </Badge>
                    <Badge color="blue">
                      {schedule.registeredStudents} {t('schedule.registeredStudents')}
                    </Badge>
                  </Group>
                  
                  <Text size="sm">
                    {t('schedule.maxStudentsLabel')}: {schedule.maxStudentsPerSlot} {t('schedule.studentsPerSlot')}
                  </Text>
                </div>
                
                <div>
                  <Group>
                    <ActionIcon variant="subtle" color="blue">
                      <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="subtle" 
                      color="red"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </div>
              </div>
            </Paper>
          ))
        )}
      </div>
    </Card>
  );
}
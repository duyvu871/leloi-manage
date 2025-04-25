'use client';

import React, { useState } from 'react';
import { Button, Text, Card, Group, JsonInput, Progress, TextInput } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFileText, IconX } from '@tabler/icons-react';

export default function CertificateUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    const uploadFile = files[0];
    setFile(uploadFile);
    setIsUploading(true);
    setUploadProgress(10);
    setError(null);

    // Simulate progress with interval
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const url = `https://api.connectedbrain.com.vn/api/v1/leloi/certificate?name=${encodeURIComponent(studentName)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setUploadProgress(100);
    } catch (err) {
      console.error('Error uploading certificate:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={500}>Xử lý chứng chỉ học sinh</Text>
          </Group>
        </Card.Section>

        <Text size="sm" color="dimmed" mt="md">
          Tải lên chứng chỉ của học sinh dưới dạng ảnh để xác thực thông tin.
        </Text>

        <TextInput
          label="Họ tên học sinh"
          placeholder="Nhập họ tên học sinh"
          value={studentName}
          onChange={(event) => setStudentName(event.currentTarget.value)}
          required
          mt="md"
        />

        {isUploading ? (
          <div className="w-full py-6">
            <Text size="sm" mb="xs">
              Đang xử lý...
            </Text>
            <Progress
              value={uploadProgress}
              color={uploadProgress === 100 ? 'green' : 'blue'}
              size="md"
            />
            <Text size="sm" color="dimmed" mt="xs">
              {uploadProgress === 100
                ? 'Xử lý hoàn tất!'
                : `Đang xử lý: ${uploadProgress}%`}
            </Text>
          </div>
        ) : file && !result ? (
          <div className="mt-4">
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <IconFileText size={20} className="text-blue-500 mr-2" />
                <Text size="sm">{file.name}</Text>
              </div>
              <Button
                variant="subtle"
                color="red"
                onClick={resetUpload}
                leftSection={<IconX size={16} />}
              >
                Xóa
              </Button>
            </div>
          </div>
        ) : !result ? (
          <Dropzone
            onDrop={handleUpload}
            onReject={(fileRejections) => {
              setError(fileRejections[0]?.errors[0]?.message || 'Invalid file type or size');
            }}
            maxSize={5 * 1024 ** 2}
            accept={['image/jpeg', 'image/png', 'image/jpg']}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 mt-4"
            disabled={!studentName.trim()}
          >
            <div className="flex flex-col items-center">
              <IconUpload size={40} stroke={1.5} className="text-gray-500 mb-4" />
              <Text size="lg" className="mb-2">
                Kéo thả ảnh chứng chỉ vào đây
              </Text>
              <Text size="sm" color="dimmed" className="mb-4">
                {studentName.trim() 
                  ? 'Tải lên chứng chỉ để xác thực thông tin'
                  : 'Vui lòng nhập họ tên học sinh trước khi tải ảnh lên'}
              </Text>
              <Button disabled={!studentName.trim()}>Chọn ảnh</Button>
            </div>
          </Dropzone>
        ) : null}

        {error && (
          <Text color="red" size="sm" mt="md">
            {error}
          </Text>
        )}

        {result && (
          <div className="mt-4 space-y-4">
            <Group justify="space-between">
              <Text fw={500} size="lg">Kết quả xác thực:</Text>
              <Button 
                onClick={resetUpload}
                variant="outline"
                leftSection={<IconUpload size={16} />}
              >
                Tải lên chứng chỉ khác
              </Button>
            </Group>
            
            <Card withBorder p="md">
              <Group mb="md">
                <Text fw={500}>Tên học sinh đã nhập:</Text>
                <Text>{result.name}</Text>
              </Group>
              
              <Group mb="md">
                <Text fw={500}>Tên nhận diện từ chứng chỉ:</Text>
                <Text>{result.extracted_name}</Text>
              </Group>
              
              <Group mb="md">
                <Text fw={500}>Cấp chứng chỉ:</Text>
                <Text>{result.level}</Text>
              </Group>
              
              <Group>
                <Text fw={500}>Trạng thái xác thực:</Text>
                <Text color={result.correct ? 'green' : 'red'}>
                  {result.correct ? 'Đã xác thực' : 'Không khớp'}
                </Text>
              </Group>
            </Card>
            
            <div className="mt-4">
              <JsonInput
                label="Dữ liệu chi tiết"
                value={JSON.stringify(result, null, 2)}
                formatOnBlur
                autosize
                minRows={5}
                maxRows={10}
                readOnly
                className="w-full"
                styles={{ input: { fontFamily: 'monospace' } }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Button, Text, Card, Group, JsonInput, Loader, Progress, Code } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFileText, IconCheck, IconX } from '@tabler/icons-react';

export default function TranscriptUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

      const response = await fetch('https://api.connectedbrain.com.vn/api/v1/leloi/upload-pdf/', {
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
      console.error('Error uploading transcript:', err);
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
            <Text fw={500}>Xử lý học bạ scan</Text>
          </Group>
        </Card.Section>

        <Text size="sm" color="dimmed" mt="md">
          Tải lên học bạ của học sinh dạng PDF để trích xuất thông tin điểm số từ các lớp học.
        </Text>

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
            maxSize={10 * 1024 ** 2}
            accept={['application/pdf']}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 mt-4"
          >
            <div className="flex flex-col items-center">
              <IconUpload size={40} stroke={1.5} className="text-gray-500 mb-4" />
              <Text size="lg" className="mb-2">
                Kéo thả tập tin PDF vào đây
              </Text>
              <Text size="sm" color="dimmed" className="mb-4">
                Tải lên học bạ của học sinh để trích xuất thông tin
              </Text>
              <Button>Chọn tập tin</Button>
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
              <Text fw={500} size="lg">Kết quả trích xuất:</Text>
              <Button 
                onClick={resetUpload}
                variant="outline"
                leftSection={<IconUpload size={16} />}
              >
                Tải lên học bạ khác
              </Button>
            </Group>
            
            <div className="max-h-[400px] overflow-auto">
              <JsonInput
                value={JSON.stringify(result, null, 2)}
                formatOnBlur
                autosize
                minRows={10}
                maxRows={20}
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
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Group, Image, Paper, Text, ActionIcon, Loader, Center } from '@mantine/core';
import { IconZoomIn, IconZoomOut, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Cấu hình worker cho PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type FileViewerProps = {
  file: string | File | null; // URL hoặc File object
  fileType?: 'pdf' | 'image' | null; // Loại file
  width?: number | string; // Chiều rộng của viewer
  height?: number | string; // Chiều cao của viewer
  className?: string; // CSS class
  onError?: (error: Error) => void; // Callback khi có lỗi
};

export const FileViewer = ({
  file,
  fileType,
  width = '100%',
  height = 500,
  className,
  onError,
}: FileViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [detectedFileType, setDetectedFileType] = useState<'pdf' | 'image' | null>(fileType || null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Reset lại các state khi file thay đổi
    setPageNumber(1);
    setScale(1);
    
    // Xử lý file
    if (!file) {
      setError('Không có file được cung cấp');
      setLoading(false);
      return;
    }
    
    // Xác định loại file và tạo URL
    const determineFileTypeAndCreateUrl = async () => {
      try {
        let url: string;
        let type: 'pdf' | 'image' | null | undefined = fileType;
        
        if (typeof file === 'string') {
          // Nếu file là URL
          url = file;
          if (!type) {
            // Nếu không có fileType, cố gắng đoán từ đuôi file
            if (url.toLowerCase().endsWith('.pdf')) {
              type = 'pdf';
            } else if (
              url.toLowerCase().match(/\.(jpeg|jpg|png|gif|bmp|webp|svg|avif)$/)
            ) {
              type = 'image';
            } else {
              throw new Error('Không thể xác định loại file từ URL');
            }
          }
        } else {
          // Nếu file là File object
          url = URL.createObjectURL(file);
          if (!type) {
            // Xác định loại file từ MIME type
            if (file.type === 'application/pdf') {
              type = 'pdf';
            } else if (file.type.startsWith('image/')) {
              type = 'image';
            } else {
              throw new Error('Loại file không được hỗ trợ');
            }
          }
        }
        
        setFileUrl(url);
        setDetectedFileType(type);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi xử lý file:', err);
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        if (onError && err instanceof Error) onError(err);
        setLoading(false);
      }
    };
    
    determineFileTypeAndCreateUrl();
    
    // Cleanup URL khi component unmount hoặc file thay đổi
    return () => {
      if (fileUrl && typeof file !== 'string') {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, fileType, onError]);
  
  // Xử lý khi PDF load thành công
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };
  
  // Xử lý khi có lỗi load PDF
  const onDocumentLoadError = (err: Error) => {
    console.error('Lỗi khi tải PDF:', err);
    setError('Không thể tải file PDF');
    setLoading(false);
    if (onError) onError(err);
  };
  
  // Xử lý khi có lỗi load ảnh
  const onImageLoadError = () => {
    setError('Không thể tải file ảnh');
    setLoading(false);
    if (onError) onError(new Error('Không thể tải file ảnh'));
  };
  
  // Thay đổi trang
  const changePage = (offset: number) => {
    if (!numPages) return;
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    }
  };
  
  // Zoom in/out
  const zoom = (factor: number) => {
    setScale((prevScale) => {
      const newScale = prevScale * factor;
      // Giới hạn scale từ 0.5 đến 2.5
      return Math.min(Math.max(newScale, 0.5), 2.5);
    });
  };
  
  return (
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      style={{ width, height, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      className={className}
    >
      {loading && (
        <Center style={{ width: '100%', height: '100%' }}>
          <Loader size="lg" />
        </Center>
      )}
      
      {error && (
        <Center style={{ width: '100%', height: '100%' }}>
          <Text color="red">{error}</Text>
        </Center>
      )}
      
      {!loading && !error && fileUrl && (
        <>
          <Box style={{ flex: 1, overflow: 'auto', textAlign: 'center' }}>
            {detectedFileType === 'pdf' ? (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<Center><Loader /></Center>}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  loading={<Center style={{ height: '100%' }}><Loader /></Center>}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            ) : detectedFileType === 'image' ? (
              <Image
                src={fileUrl}
                onError={onImageLoadError}
                style={{ transform: `scale(${scale})`, transformOrigin: 'center', maxWidth: '100%' }}
                fit="contain"
                alt="Hình ảnh xem trước"
              />
            ) : null}
          </Box>
          
          <Group mt={10}>
            <Group>
              <ActionIcon 
                disabled={scale <= 0.5} 
                onClick={() => zoom(0.8)}
                variant="subtle"
                color="blue"
              >
                <IconZoomOut size={20} />
              </ActionIcon>
              <Text size="sm">{Math.round(scale * 100)}%</Text>
              <ActionIcon 
                disabled={scale >= 2.5} 
                onClick={() => zoom(1.25)}
                variant="subtle"
                color="blue"
              >
                <IconZoomIn size={20} />
              </ActionIcon>
            </Group>
            
            {detectedFileType === 'pdf' && numPages && numPages > 1 && (
              <Group>
                <ActionIcon 
                  disabled={pageNumber <= 1} 
                  onClick={() => changePage(-1)}
                  variant="subtle"
                  color="blue"
                >
                  <IconChevronLeft size={20} />
                </ActionIcon>
                <Text size="sm">
                  Trang {pageNumber} / {numPages}
                </Text>
                <ActionIcon 
                  disabled={pageNumber >= numPages} 
                  onClick={() => changePage(1)}
                  variant="subtle"
                  color="blue"
                >
                  <IconChevronRight size={20} />
                </ActionIcon>
              </Group>
            )}
          </Group>
        </>
      )}
    </Paper>
  );
};

export default FileViewer;
import { Document, TranscriptData } from '@type/document';
// import { mockDocuments } from '../data/applications';

// Mảng lưu trữ dữ liệu tài liệu
let documentData: Document[] = [];

// Hàm lấy danh sách tài liệu của học sinh
export const getStudentDocuments = (studentId: string) => {
  return documentData.filter((doc) => doc.studentId === studentId);
};

// Hàm lấy thông tin tài liệu theo ID
export const getDocumentById = (id: string) => {
  const document = documentData.find((doc) => doc.id === id);
  if (!document) {
    throw new Error('Không tìm thấy tài liệu');
  }
  return document;
};

// Hàm tải lên tài liệu mới
export const uploadDocument = (studentId: string, document: Omit<Document, 'id' | 'studentId' | 'uploadedAt'>) => {
  const newDocument: Document = {
    id: Math.random().toString(36).substr(2, 9),
    studentId,
    uploadedAt: new Date().toISOString(),
    ...document,
  };
  documentData.push(newDocument);
  return newDocument;
};

// Hàm xóa tài liệu
export const deleteDocument = (id: string) => {
  const index = documentData.findIndex((doc) => doc.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy tài liệu');
  }
  documentData = documentData.filter((doc) => doc.id !== id);
  return true;
};

// Hàm cập nhật thông tin tài liệu
export const updateDocument = (id: string, document: Partial<Document>) => {
  const index = documentData.findIndex((doc) => doc.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy tài liệu');
  }
  documentData[index] = { ...documentData[index], ...document };
  return documentData[index];
};

// Hàm trích xuất dữ liệu từ học bạ
export const extractTranscriptData = (documentId: string): TranscriptData | null => {
  const document = getDocumentById(documentId);
  if (document.type !== 'transcript') {
    throw new Error('Tài liệu không phải là học bạ');
  }
  // Mô phỏng việc trích xuất dữ liệu từ PDF
  return {
    subjects: [
      { name: 'Toán', score: 9.0, evaluation: 'Hoàn thành tốt' },
      { name: 'Văn', score: 8.5, evaluation: 'Hoàn thành tốt' },
      { name: 'Anh', score: 8.0, evaluation: 'Hoàn thành tốt' },
    ],
    behavior: 'Tốt',
    attendanceRate: '95%',
    teacherComments: 'Học sinh có tinh thần học tập tốt, tích cực tham gia các hoạt động',
  };
};

// Hàm kiểm tra tính hợp lệ của tài liệu
export const validateDocument = (document: Document) => {
  // Kiểm tra kích thước file
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const fileSize = Buffer.from(document.fileUrl).length;
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error('Kích thước file vượt quá giới hạn cho phép');
  }

  // Kiểm tra định dạng file
  const allowedTypes = ['application/pdf'];
  const fileType = document.fileUrl.split(';')[0].split(':')[1];
  if (!allowedTypes.includes(fileType)) {
    throw new Error('Định dạng file không được hỗ trợ');
  }

  return true;
};
import { API_ROUTES } from "@/constants/path";
import { axiosRequestWithException } from "@lib/apis/base";
import { SuccessResponse } from "@/types/api/response";
import { Document, ExtractedData } from "@/types/registration";

// Interface for document upload response
export type DocumentUploadResponse = {
  id: string;
  jobId?: string;
  status: string;
}

// Upload a document and get extracted data
export const uploadAndProcessDocument = async (
  applicationId: number,
  file: File,
  type: string
): Promise<DocumentUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('applicationId', applicationId.toString());
  
  const requestConfig = {
    method: 'post',
    url: API_ROUTES.v1.REGISTRATION.DOCUMENT_UPLOAD,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  
  return (await axiosRequestWithException<SuccessResponse<DocumentUploadResponse>>(
    requestConfig,
    () => console.log("Tài liệu đã được tải lên và xử lý thành công")
  )).data;
};

// Get all documents for an application
export const getApplicationDocuments = async (
  applicationId: number
): Promise<Document[]> => {
  const requestConfig = {
    method: 'get',
    url: `${API_ROUTES.v1.REGISTRATION.APPLICATION}/${applicationId}/documents`,
  };
  
  return (await axiosRequestWithException<SuccessResponse<{ documents: Document[] }>>(
    requestConfig,
    () => console.log("Đã lấy tài liệu thành công")
  )).data.documents;
};

// Get extracted data for a document
export const getExtractedData = async (
  documentId: number
): Promise<ExtractedData> => {
  const requestConfig = {
    method: 'get',
    url: `${API_ROUTES.v1.REGISTRATION.DOCUMENT_UPLOAD}/${documentId}/extracted-data`,
  };
  
  return (await axiosRequestWithException<SuccessResponse<{ extractedData: ExtractedData }>>(
    requestConfig,
    () => console.log("Đã lấy dữ liệu trích xuất thành công")
  )).data.extractedData;
};

// Verify extracted data
export const verifyExtractedData = async (
  extractedDataId: number,
  isVerified: boolean
): Promise<ExtractedData> => {
  const requestConfig = {
    method: 'patch',
    url: `${API_ROUTES.v1.REGISTRATION.DOCUMENT_UPLOAD}/extracted-data/${extractedDataId}`,
    data: { isVerified }
  };
  
  return (await axiosRequestWithException<SuccessResponse<{ extractedData: ExtractedData }>>(
    requestConfig,
    () => console.log("Đã cập nhật trạng thái xác minh dữ liệu trích xuất")
  )).data.extractedData;
};
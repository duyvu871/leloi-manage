import { useState, useCallback } from 'react';
import * as documentApi from '@/libs/apis/documents';
import { Document, ExtractedData } from '@/types/registration';
import useToast from '@/hooks/client/use-toast-notification';

interface UseDocumentManagementProps {
  applicationId?: number;
}

export const useDocumentManagement = ({ applicationId }: UseDocumentManagementProps = {}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [extractedData, setExtractedData] = useState<Record<number, ExtractedData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showErrorToast, showSuccessToast } = useToast();
  // Load all documents for an application
  const loadDocuments = useCallback(async (appId?: number) => {
    const targetAppId = appId || applicationId;
    if (!targetAppId) {
      setError('Application ID is required to load documents');
      showErrorToast('Application ID is required to load documents');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const docs = await documentApi.getApplicationDocuments(targetAppId);
      setDocuments(docs);
      
      // Also load extracted data for each document
      const extractedDataMap: Record<number, ExtractedData> = {};
      for (const doc of docs) {
        try {
          const data = await documentApi.getExtractedData(doc.id);
          extractedDataMap[doc.id] = data;
        } catch (err) {
          console.warn(`Failed to load extracted data for document ${doc.id}:`, err);
        }
      }
      
      setExtractedData(extractedDataMap);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
      showErrorToast('Không thể tải tài liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);
  
  // Upload a document and process it
  const uploadDocument = useCallback(async (file: File, type: string, appId?: number) => {
    const targetAppId = appId || applicationId;
    if (!targetAppId) {
      setError('Application ID is required to upload documents');
      showErrorToast('Không thể tải lên tài liệu: Thiếu ID đơn đăng ký');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await documentApi.uploadAndProcessDocument(targetAppId, file, type);
      
      // Add the new document to our state
      setDocuments(prev => [...prev, response.document]);
      
      // Add extracted data if available
      if (response.extractedData) {
        setExtractedData(prev => ({
          ...prev,
          [response.document.id]: response.extractedData!
        }));
      }
      
      showSuccessToast('Tài liệu đã được tải lên thành công');
      return response.document;
    } catch (err) {
      console.error('Failed to upload document:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      showErrorToast('Không thể tải lên tài liệu. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);
  
  // Verify extracted data
  const verifyExtractedData = useCallback(async (extractedDataId: number, isVerified: boolean) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedData = await documentApi.verifyExtractedData(extractedDataId, isVerified);
      
      // Update our local state
      setExtractedData(prev => {
        const newMap = { ...prev };
        // Find the document ID that this extracted data belongs to
        const docId = Object.keys(prev).find(
          key => prev[Number(key)]?.id === extractedDataId
        );
        
        if (docId) {
          newMap[Number(docId)] = updatedData;
        }
        
        return newMap;
      });
      
      showSuccessToast(
        isVerified 
          ? 'Dữ liệu đã được xác minh thành công' 
          : 'Dữ liệu đã được đánh dấu là không xác minh'
      );
      
      return updatedData;
    } catch (err) {
      console.error('Failed to verify extracted data:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify extracted data');
      showErrorToast('Không thể cập nhật trạng thái xác minh. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    documents,
    extractedData,
    isLoading,
    error,
    loadDocuments,
    uploadDocument,
    verifyExtractedData
  };
};
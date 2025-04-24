import React, { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { Student } from '@/types/student';
import useToast from '@/hooks/client/use-toast-notification';
import { getStudentById, updateStudent as apiUpdateStudent } from '@/libs/apis/registration';
import { uploadAndProcessDocument } from '@/libs/apis/documents';

export type StudentContextType = {
	student: Student | null;
	isLoading: boolean;
	error: string | null;
	loadStudent: (studentId: number) => Promise<void>;
	updateStudent: (studentId: number, data: Partial<Student>) => Promise<void>;
	uploadDocument: (applicationId: number, file: File, type: string) => Promise<any>;
	setStudent: (student: Student | null) => void;
};

const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children, id }: { children: React.ReactNode; id: number }) {
	const toast = useToast();
	const [student, setStudent] = useState<Student | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			loadStudent(id);
		}
	}, [id]);

	const loadStudent = async (studentId: number) => {
		try {
			setIsLoading(true);
			setError(null);
			
			const studentData = await getStudentById(studentId);
			setStudent(studentData);
			
		} catch (err) {
			setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
			toast.showErrorToast("Không thể tải thông tin học sinh");
			console.error("Error loading student:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const updateStudent = async (studentId: number, data: Partial<Student>) => {
		try {
			setIsLoading(true);
			setError(null);
			
			const response = await apiUpdateStudent(studentId, data);
			
			// await loadStudent(studentId);
            setStudent((prev) => (prev ? { ...prev, ...data } : null));
			toast.showSuccessToast("Cập nhật thông tin học sinh thành công");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
			toast.showErrorToast("Không thể cập nhật thông tin học sinh");
			console.error("Error updating student:", err);
		} finally {
			setIsLoading(false);
		}
	};
	
	const uploadDocument = async (applicationId: number, file: File, type: string) => {
		try {
			setIsLoading(true);
			setError(null);
			
			const response = await uploadAndProcessDocument(applicationId, file, type);
			
			toast.showSuccessToast(`Tải lên tài liệu ${type} thành công`);
			return response;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
			toast.showErrorToast(`Không thể tải lên tài liệu ${type}`);
			console.error("Error uploading document:", err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const value: StudentContextType = {
		student,
		isLoading,
		error,
		loadStudent,
		updateStudent,
		uploadDocument,
		setStudent
	};

	return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
	const context = useContext(StudentContext);
	if (!context) {
		throw new Error('useStudent must be used within a StudentProvider');
	}
	return context;
}

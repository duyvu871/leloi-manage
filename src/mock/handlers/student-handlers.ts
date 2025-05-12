// import { Student } from '@type/student';
import { Application } from '@type/application';
// import {mockStudents} from '../data/students';
import { mockApplications } from '../data/applications';
import { Student } from '@/schemas/user/dto';

// Mảng lưu trữ dữ liệu học sinh
let studentData: any[] = [];

// Hàm lấy danh sách học sinh
export const getStudents = () => {
  return studentData;
};

// Hàm lấy thông tin học sinh theo ID
export const getStudentById = (id: string) => {
  const student = studentData.find((s) => s.id === id);
  if (!student) {
    throw new Error('Không tìm thấy học sinh');
  }
  return student;
};

// Hàm tạo học sinh mới
export const createStudent = (student: Omit<Student, 'id'>) => {
  const newStudent: Student = {
    id: parseInt(Math.random().toString(36).substr(2, 9)),
    ...student,
  };
  studentData.push(newStudent);
  return newStudent;
};

// Hàm cập nhật thông tin học sinh
export const updateStudent = (id: string, student: Partial<Student>) => {
  const index = studentData.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy học sinh');
  }
  studentData[index] = { ...studentData[index], ...student };
  return studentData[index];
};

// Hàm xóa học sinh
export const deleteStudent = (id: string) => {
  const index = studentData.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy học sinh');
  }
  studentData = studentData.filter((s) => s.id !== id);
  return true;
};

// Hàm lấy thông tin đơn đăng ký của học sinh
export const getStudentApplication = (id: string) => {
  const application = mockApplications.find((a) => a.studentId === id);
  if (!application) {
    throw new Error('Không tìm thấy đơn đăng ký');
  }
  return application;
};

// Hàm tìm kiếm học sinh theo tên hoặc trường học
export const searchStudents = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return studentData.filter(
    (student) =>
      student.name.toLowerCase().includes(lowercaseQuery) ||
      student.currentSchool.name.toLowerCase().includes(lowercaseQuery)
  );
};
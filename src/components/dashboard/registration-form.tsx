// 'use client';

// import { useEffect } from 'react';
// import { z } from 'zod';
// import { useAtom } from 'jotai';
// import { studentInfoAtom, updateStudentInfoAtom, registrationStepAtom } from '@/stores/registration';
// import { Student } from '@/schemas/user/dto';
// import { FormBuilder } from '@/components/forms/form-builder';
// import { useTranslation } from 'react-i18next';

// // Registration schema for student info
// const studentRegistrationSchema = z.object({
//   student: z.object({
//     name: z.string().min(1, 'Họ và tên học sinh không được để trống'),
//     dob: z.date({
//       required_error: 'Ngày sinh không được để trống',
//       invalid_type_error: 'Ngày sinh không hợp lệ',
//     }).refine(date => date <= new Date(), {
//       message: 'Ngày sinh không hợp lệ',
//     }),
//     gender: z.enum(['male', 'female'], {
//       errorMap: () => ({ message: 'Vui lòng chọn giới tính' }),
//     }),
//     address: z.string().min(1, 'Địa chỉ không được để trống'),
//     currentSchool: z.object({
//       name: z.string().min(1, 'Tên trường không được để trống'),
//       address: z.string().min(1, 'Địa chỉ trường không được để trống'),
//     }),
//   }),
//   parent: z.object({
//     name: z.string().min(1, 'Họ và tên phụ huynh không được để trống'),
//     phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
//     email: z.string().email('Email không hợp lệ'),
//     relationship: z.enum(['father', 'mother', 'guardian'], {
//       errorMap: () => ({ message: 'Vui lòng chọn mối quan hệ' }),
//     }),
//   }),
// });

// type StudentRegistrationFormValues = z.infer<typeof studentRegistrationSchema>;

// export function RegistrationForm() {
//   const { t } = useTranslation();
//   const [studentInfo] = useAtom(studentInfoAtom);
//   const [, updateStudentInfo] = useAtom(updateStudentInfoAtom);
//   const [step] = useAtom(registrationStepAtom);

//   // Submit form data to Jotai store
//   const handleSubmit = (data: StudentRegistrationFormValues) => {
//     // Combine student and school info as per the Student type
//     const studentData: Student = {
//       name: data.student.name,
//       dob: data.student.dob.toISOString(),
//       gender: data.student.gender,
//       address: data.student.address,
//       currentSchool: data.student.currentSchool,
//     };

//     // Update the student info in the store
//     updateStudentInfo(studentData);
//   };

//   const defaultValues = studentInfo 
//     ? {
//         student: {
//           name: studentInfo.name || '',
//           dob: new Date(studentInfo.dob) || new Date(),
//           gender: studentInfo.gender || 'male',
//           address: studentInfo.address || '',
//           currentSchool: {
//             name: studentInfo.currentSchool?.name || '',
//             address: studentInfo.currentSchool?.address || '',
//           },
//         },
//         parent: {
//           // In a real application, this would come from the user profile
//           name: '',
//           phone: '',
//           email: '',
//           relationship: 'father' as const,
//         },
//       }
//     : undefined;

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h2 className="text-xl font-bold mb-6 text-primary">Phiếu đăng ký dự tuyển</h2>
      
//       <FormBuilder
//         schema={studentRegistrationSchema}
//         onSubmit={handleSubmit}
//         defaultValues={defaultValues}
//         submitText="Lưu thông tin"
//         spacing="lg"
//         gridGutter={24}
//         fields={[
//           // Student section
//           {
//             type: 'title',
//             title: ( <h3 className="font-bold text-gray-700">Thông tin học sinh</h3>),
        
//             colSpan: 12,
//           },
//           {
//             type: 'text',
//             name: 'student.name',
//             label: 'Họ và tên học sinh',
//             placeholder: 'Nhập họ và tên của học sinh',
//             required: true,
//             colSpan: 6,
//           },
//           {
//             type: 'date',
//             name: 'student.dob',
//             label: 'Ngày sinh',
//             required: true,
//             colSpan: 6,
//           },
//           {
//             type: 'select',
//             name: 'student.gender',
//             label: 'Giới tính',
//             options: [
//               { value: 'male', label: 'Nam' },
//               { value: 'female', label: 'Nữ' },
//             ],
//             required: true,
//             colSpan: 6,
//           },
//           {
//             type: 'text',
//             name: 'student.address',
//             label: 'Địa chỉ',
//             placeholder: 'Nhập địa chỉ của học sinh',
//             required: true,
//             colSpan: 6,
//           },
          
//           // Parent section
//           {
//             type: 'title',
//             title: (
//               <h3 className="font-bold text-gray-700 mt-4">Thông tin phụ huynh</h3>
//             ),
//             colSpan: 12,
//           },
//           {
//             type: 'text',
//             name: 'parent.name',
//             label: 'Họ và tên phụ huynh',
//             placeholder: 'Nhập họ và tên của phụ huynh',
//             required: true,
//             colSpan: 6,
//           },
//           {
//             type: 'tel',
//             name: 'parent.phone',
//             label: 'Số điện thoại',
//             placeholder: 'Nhập số điện thoại',
//             required: true,
//             colSpan: 6,
//           },
//           {
//             type: 'email',
//             name: 'parent.email',
//             label: 'Email',
//             placeholder: 'Nhập email',
//             required: true,
//             colSpan: 6,
//           },
//           {
//             type: 'select',
//             name: 'parent.relationship',
//             label: 'Quan hệ với học sinh',
//             options: [
//               { value: 'father', label: 'Bố' },
//               { value: 'mother', label: 'Mẹ' },
//               { value: 'guardian', label: 'Người giám hộ' },
//             ],
//             required: true,
//             colSpan: 6,
//           },
          
//           // School section
//           {
//             type: 'title',
//             title: <h3 className="font-bold text-gray-700 mt-4">Thông tin trường hiện tại</h3>,
//             colSpan: 12,
//           },
//           {
//             type: 'text',
//             name: 'student.currentSchool.name',
//             label: 'Trường hiện tại',
//             placeholder: 'Nhập tên trường hiện tại',
//             required: true,
//             colSpan: 6,
//           },
//           {
//             type: 'text',
//             name: 'student.currentSchool.address',
//             label: 'Địa chỉ trường',
//             placeholder: 'Nhập địa chỉ trường',
//             required: true,
//             colSpan: 6,
//           },
//         ]}
//       />
//     </div>
//   );
// }

// export default RegistrationForm;
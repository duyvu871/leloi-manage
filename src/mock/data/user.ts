// import type { ParentUser, ManagerUser, ApplicationStatus } from 'src/schemas/user/dto';

// export const mockParents: (ParentUser & { password: string })[] = [
//     {
//         id: "P2025001",
//         name: "Nguyễn Văn Cha",
//         email: "nguyen.cha@example.com",
//         phone: "0912345678",
//         role: "parent",
//         relationship: "father",
//         password: "password123",
//         isActive: true,
//         lastLogin: new Date("2025-04-22T08:30:00"),
//         lastUpdated: new Date("2025-04-22T08:30:00"),
//         student: {
//             name: "Nguyễn Văn Em",
//             dob: "2010-05-15",
//             gender: "male",
//             address: "123 Đường Lê Lợi, Quận 1, TP HCM",
//             currentSchool: {
//                 name: "THCS Lê Lợi",
//                 address: "456 Đường Nguyễn Huệ, Quận 1, TP HCM"
//             }
//         },
//         transcriptData: {
//             subjects: [
//                 { name: "Toán", score: 9.0, evaluation: "Học sinh có khả năng tư duy logic tốt" },
//                 { name: "Văn", score: 8.5, evaluation: "Học sinh có năng khiếu viết văn và kỹ năng diễn đạt tốt" },
//                 { name: "Anh", score: 9.5, evaluation: "Học sinh có khả năng giao tiếp tiếng Anh tốt" },
//                 { name: "Lịch sử", score: 8.0, evaluation: "Học sinh có kiến thức lịch sử khá" },
//                 { name: "Địa lý", score: 8.5, evaluation: "Học sinh hiểu biết tốt về các vấn đề địa lý" }
//             ],
//             behavior: "Tốt",
//             attendanceRate: "95%",
//             teacherComments: "Học sinh chăm chỉ, hoà đồng với bạn bè và tích cực tham gia các hoạt động của trường."
//         },
//         applicationStatus: {
//             currentStatus: "eligible",
//             reason: "",
//             lastUpdated: "2025-04-15",
//             examInfo: {
//                 sbd: "TS2025001",
//                 room: "P201",
//                 date: "2025-05-20",
//                 time: "08:00 - 11:30"
//             }
//         },
//         documents: {
//             transcript: "/documents/P2025001/transcript.pdf",
//             certificates: [
//                 "/documents/P2025001/cert1.pdf",
//                 "/documents/P2025001/cert2.pdf"
//             ]
//         }
//     },
//     {
//         id: "P2025002",
//         name: "Trần Văn Cha",
//         email: "tran.cha@example.com",
//         phone: "0923456789",
//         role: "parent",
//         relationship: "father",
//         password: "password123",
//         isActive: true,
//         lastLogin: new Date("2025-04-21T14:15:00"),
//         lastUpdated: new Date("2025-04-21T14:15:00"),
//         student: {
//             name: "Trần Thị Nữ",
//             dob: "2010-08-20",
//             gender: "female",
//             address: "789 Đường Nguyễn Du, Quận 3, TP HCM",
//             currentSchool: {
//                 name: "THCS Quang Trung",
//                 address: "321 Đường Hai Bà Trưng, Quận 3, TP HCM"
//             }
//         },
//         transcriptData: {
//             subjects: [
//                 { name: "Toán", score: 8.0, evaluation: "Học sinh có khả năng làm toán tốt" },
//                 { name: "Văn", score: 9.0, evaluation: "Học sinh có năng khiếu văn học và sáng tác" },
//                 { name: "Anh", score: 8.5, evaluation: "Học sinh có khả năng giao tiếp tiếng Anh khá" },
//                 { name: "Lịch sử", score: 8.5, evaluation: "Học sinh nắm vững kiến thức lịch sử" },
//                 { name: "Địa lý", score: 8.0, evaluation: "Học sinh hiểu biết tốt về các vấn đề địa lý" }
//             ],
//             behavior: "Tốt",
//             attendanceRate: "98%",
//             teacherComments: "Học sinh ngoan ngoãn, có tinh thần học tập tốt và luôn giúp đỡ bạn bè."
//         },
//         applicationStatus: {
//             currentStatus: "ineligible",
//             reason: "Điểm trung bình môn Toán không đạt yêu cầu tối thiểu",
//             lastUpdated: "2025-04-14"
//         }
//     }
// ];

// export const mockManagers: (ManagerUser & { password: string })[] = [
//     {
//         id: "M2025001",
//         name: "Admin Trường",
//         email: "admin@leloi.edu.vn",
//         phone: "0987654321",
//         role: "manager",
//         password: "admin123",
//         isActive: true,
//         lastLogin: new Date("2025-04-23T09:00:00"),
//         lastUpdated: new Date("2025-04-23T09:00:00"),
//         permissions: [
//             'manage_applications',
//             'manage_schedules',
//             'manage_users',
//             'send_notifications',
//             'view_reports',
//             'approve_applications'
//         ]
//     },
//     {
//         id: "M2025002",
//         name: "Quản Lý Tuyển Sinh",
//         email: "admission@leloi.edu.vn",
//         phone: "0976543210",
//         role: "manager",
//         password: "admin123",
//         isActive: true,
//         lastLogin: new Date("2025-04-22T10:30:00"),
//         lastUpdated: new Date("2025-04-22T10:30:00"),
//         permissions: [
//             'manage_applications',
//             'manage_schedules',
//             'send_notifications',
//             'approve_applications'
//         ]
//     }
// ];

// // Helper function to find user by email (for auth mock)
// export function findUserByEmail(email: string) {
//     return [...mockParents, ...mockManagers].find(user => user.email === email);
// }

// // Helper function to find user by ID
// export function findUserById(id: string) {
//     return [...mockParents, ...mockManagers].find(user => user.id === id);
// }

// // Helper function to get parent by student ID
// export function findParentByStudentId(studentId: string) {
//     return mockParents.find(parent => 
//         parent.student?.name.toLowerCase().includes(studentId.toLowerCase()) ||
//         parent.applicationStatus?.examInfo?.sbd === studentId
//     );
// }

// // Export application status types for use in other parts of the application
// export const applicationStatusTypes = {
//     ELIGIBLE: 'eligible',
//     INELIGIBLE: 'ineligible',
//     PENDING: 'pending',
//     CONFIRMED: 'confirmed'
// } as const;
# Kế hoạch phát triển hệ thống quản lý tuyển sinh

## Tổng quan dự án

Dự án xây dựng hệ thống quản lý tuyển sinh cho trường THCS Lê Lợi, bao gồm hai loại tài khoản: Phụ huynh và Người quản lý, với các chức năng tương ứng theo yêu cầu đã đề ra.

## Công nghệ sử dụng

- **Frontend Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Form Handling**: React Hook Form + Zod
- **API Handling**: Axios + TanStack Query
- **Authentication**: JWT Authentication với Backend Riêng
- **File Upload & Processing**: react-dropzone + pdf.js

## Cấu trúc dự án

```
/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   │   ├── parent/           # Parent dashboard
│   │   └── manager/          # Manager dashboard
│   └── layout.tsx            # Root layout
├── components/               # Shared components
│   ├── ui/                   # UI components (shadcn)
│   ├── forms/                # Form components
│   ├── dashboard/            # Dashboard components
│   └── shared/               # Shared components
├── lib/                      # Utility functions
│   ├── api/                  # API utilities
│   ├── auth/                 # Auth utilities
│   ├── pdf/                  # PDF processing utilities
│   └── validators/           # Zod schemas
├── store/                    # Jotai store
├── types/                    # TypeScript types
├── mock/                     # Mock API data
├── public/                   # Static assets
└── styles/                   # Global styles
```

## Giai đoạn phát triển

### Giai đoạn 1: Thiết lập dự án và cấu trúc cơ bản

#### Công nghệ sử dụng
- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui
- TypeScript

#### Các bước thực hiện
1. Khởi tạo dự án Next.js với TypeScript
   ```bash
   npx create-next-app@latest le-loi-admission --typescript --tailwind --app
   ```

2. Cài đặt shadcn/ui và các dependencies cần thiết
   ```bash
   npx shadcn-ui@latest init
   ```

3. Thiết lập cấu trúc thư mục dự án
4. Cấu hình theme và màu sắc theo palette trong demo
   - Chỉnh sửa file `tailwind.config.js` để thêm các màu chính:
     ```js
     theme: {
       extend: {
         colors: {
           primary: '#1e40af',
           secondary: '#60a5fa',
           accent: '#3b82f6',
         }
       }
     }
     ```

5. Tạo các components UI cơ bản từ shadcn/ui
   ```bash
   npx shadcn-ui@latest add button card form input select textarea
   ```

### Giai đoạn 2: Xây dựng hệ thống xác thực và phân quyền

#### Công nghệ sử dụng
- NextAuth.js
- Jotai
- Axios

#### Các bước thực hiện
1. Cài đặt NextAuth.js và cấu hình
   ```bash
   npm install next-auth
   ```

2. Thiết lập API routes cho xác thực
   - Tạo file `app/api/auth/[...nextauth]/route.ts`

3. Tạo các trang đăng nhập và đăng ký
   - Tạo file `app/auth/login/page.tsx`
   - Tạo file `app/auth/register/page.tsx`

4. Thiết lập Jotai store để quản lý trạng thái người dùng
   ```bash
   npm install jotai
   ```
   - Tạo file `store/auth.ts` để lưu trữ thông tin người dùng

5. Tạo middleware để bảo vệ các route cần xác thực
   - Tạo file `middleware.ts` ở thư mục gốc

### Giai đoạn 3: Xây dựng giao diện và chức năng cho Phụ huynh

#### Công nghệ sử dụng
- React Hook Form
- Zod
- TanStack Query
- react-dropzone
- pdf.js

#### Các bước thực hiện
1. Cài đặt các thư viện cần thiết
   ```bash
   npm install react-hook-form zod @hookform/resolvers @tanstack/react-query axios react-dropzone pdfjs-dist
   ```

2. Xây dựng schema validation với Zod
   - Tạo file `lib/validators/registration.ts` cho form đăng ký
   - Tạo file `lib/validators/document-upload.ts` cho form tải lên tài liệu

3. Xây dựng các components form với React Hook Form
   - Tạo component `components/forms/RegistrationForm.tsx`
   - Tạo component `components/forms/DocumentUploadForm.tsx`

4. Xây dựng chức năng tải lên và xử lý file PDF
   - Tạo component `components/forms/PdfUploader.tsx`
   - Tạo utility `lib/pdf/extract-data.ts` để trích xuất dữ liệu từ PDF

5. Xây dựng trang xem trạng thái hồ sơ
   - Tạo file `app/dashboard/parent/status/page.tsx`

### Giai đoạn 4: Xây dựng giao diện và chức năng cho Người quản lý

#### Công nghệ sử dụng
- TanStack Table
- shadcn/ui (Dialog, Popover, etc.)
- TanStack Query

#### Các bước thực hiện
1. Cài đặt các thư viện cần thiết
   ```bash
   npm install @tanstack/react-table
   ```

2. Xây dựng trang danh sách học sinh
   - Tạo file `app/dashboard/manager/students/page.tsx`
   - Tạo component `components/dashboard/StudentTable.tsx`

3. Xây dựng trang quản lý lịch nộp hồ sơ
   - Tạo file `app/dashboard/manager/schedule/page.tsx`
   - Tạo component `components/dashboard/ScheduleManager.tsx`

4. Xây dựng trang xem chi tiết hồ sơ học sinh
   - Tạo file `app/dashboard/manager/students/[id]/page.tsx`
   - Tạo component `components/dashboard/StudentDetail.tsx`

5. Xây dựng trang xác nhận hồ sơ trực tiếp
   - Tạo file `app/dashboard/manager/confirmation/page.tsx`
   - Tạo component `components/dashboard/ConfirmationForm.tsx`

### Giai đoạn 5: Xây dựng Mock API và tích hợp

#### Công nghệ sử dụng
- Axios
- TanStack Query
- MSW (Mock Service Worker) - tùy chọn

#### Các bước thực hiện
1. Thiết kế các interface và type cho dữ liệu
   - Tạo file `types/student.ts`
   - Tạo file `types/application.ts`
   - Tạo file `types/schedule.ts`

2. Tạo các mock data
   - Tạo thư mục `mock/data`
   - Tạo file `mock/data/students.ts`
   - Tạo file `mock/data/applications.ts`

3. Tạo các API service
   - Tạo file `lib/api/student-service.ts`
   - Tạo file `lib/api/application-service.ts`
   - Tạo file `lib/api/document-service.ts`

4. Tích hợp TanStack Query
   - Tạo file `lib/api/query-client.ts`
   - Tạo các custom hooks cho các API calls

### Giai đoạn 6: Hoàn thiện và tối ưu

#### Công nghệ sử dụng
- Next.js Image Optimization
- React Error Boundary
- Suspense

#### Các bước thực hiện
1. Tối ưu hiệu suất
   - Sử dụng Next.js Image component
   - Lazy loading components
   - Sử dụng Suspense và Error Boundary

2. Cải thiện UX/UI
   - Thêm loading states
   - Thêm error handling
   - Thêm animations và transitions

3. Kiểm thử
   - Unit tests cho các utility functions
   - Integration tests cho các form và API calls

4. Deployment
   - Cấu hình production build
   - Thiết lập CI/CD pipeline

## Chi tiết các chức năng

### Chức năng dành cho Phụ huynh

1. **Điền phiếu đăng ký dự tuyển**
   - Form với các trường thông tin cá nhân và học sinh
   - Validation với React Hook Form + Zod
   - Lưu trữ dữ liệu với Jotai và gửi lên server với Axios

2. **Tải lên học bạ (dạng PDF)**
   - Sử dụng react-dropzone để tải lên file
   - Sử dụng pdf.js để trích xuất dữ liệu từ PDF
   - Hiển thị preview của file đã tải lên

3. **Tải lên các chứng chỉ, giấy khen**
   - Tương tự như tải lên học bạ
   - Hỗ trợ tải lên nhiều file

4. **Xem lại thông tin đã cung cấp**
   - Hiển thị tất cả thông tin đã nhập và tải lên
   - Hiển thị trạng thái hồ sơ
   - Cho phép chỉnh sửa thông tin nếu cần

### Chức năng dành cho Người quản lý

1. **Lên lịch nộp hồ sơ trực tiếp**
   - Form tạo và quản lý các khung thời gian
   - Gửi thông báo đến phụ huynh

2. **Quản lý danh sách học sinh đăng ký**
   - Bảng danh sách với các chức năng lọc và tìm kiếm
   - Xem chi tiết từng hồ sơ

3. **Xem chi tiết từng hồ sơ học sinh**
   - Hiển thị tất cả thông tin của học sinh
   - Cho phép thay đổi trạng thái hồ sơ

4. **Xác nhận hồ sơ tại vòng nộp trực tiếp**
   - Form xác nhận với các trường thông tin cần thiết
   - Gửi email thông báo tự động

## Kết luận

Dự án sẽ được phát triển theo các giai đoạn trên, với mỗi giai đoạn tập trung vào một phần cụ thể của hệ thống. Việc sử dụng các công nghệ hiện đại như Next.js 14, shadcn/ui, Tailwind CSS, Jotai, React Hook Form + Zod, và TanStack Query sẽ giúp xây dựng một hệ thống quản lý tuyển sinh hiệu quả, dễ sử dụng và dễ bảo trì.
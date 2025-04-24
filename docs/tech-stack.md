# Công nghệ sử dụng trong dự án hệ thống quản lý tuyển sinh

## Tổng quan công nghệ

Dự án hệ thống quản lý tuyển sinh được xây dựng dựa trên các công nghệ hiện đại, mạnh mẽ và phổ biến trong cộng đồng phát triển web. Dưới đây là chi tiết về các công nghệ chính được sử dụng và lý do chọn chúng.

## Frontend Framework

### Next.js 14 (App Router)

**Lý do chọn:**
- **Server Components**: Next.js 14 cung cấp React Server Components giúp tối ưu hiệu suất bằng cách render các components trên server.
- **App Router**: Cấu trúc định tuyến mới dựa trên hệ thống thư mục, giúp tổ chức code rõ ràng và dễ bảo trì.
- **Streaming và Suspense**: Hỗ trợ streaming và suspense giúp cải thiện trải nghiệm người dùng khi tải dữ liệu.
- **SEO tốt**: Hỗ trợ server-side rendering (SSR) và static site generation (SSG) giúp tối ưu hóa SEO.
- **API Routes**: Tích hợp sẵn API routes giúp dễ dàng tạo các endpoint API.

**Cách sử dụng trong dự án:**
- Tổ chức cấu trúc dự án theo App Router với các thư mục `/app/dashboard/parent` và `/app/dashboard/manager`.
- Sử dụng Server Components cho các trang không cần tương tác phía client.
- Sử dụng Client Components cho các phần cần tương tác như forms và tables.
- Tận dụng API Routes để tạo các mock API endpoints.

## UI Components

### shadcn/ui

**Lý do chọn:**
- **Không phải là thư viện**: shadcn/ui không phải là một thư viện mà là một tập hợp các components có thể tái sử dụng, giúp bạn có toàn quyền kiểm soát code.
- **Dễ tùy biến**: Các components dễ dàng tùy biến theo nhu cầu cụ thể của dự án.
- **Thiết kế đẹp**: Các components có thiết kế hiện đại, đẹp mắt và thân thiện với người dùng.
- **Accessibility**: Các components được xây dựng với tính năng accessibility tốt.
- **Tích hợp tốt với Tailwind CSS**: Được thiết kế để hoạt động liền mạch với Tailwind CSS.

**Cách sử dụng trong dự án:**
- Sử dụng các components như Button, Card, Form, Input, Select, Table, Dialog, etc. để xây dựng giao diện.
- Tùy chỉnh theme và màu sắc để phù hợp với palette màu trong demo.
- Kết hợp các components để tạo ra các form phức tạp như form đăng ký và form tải lên tài liệu.

## Styling

### Tailwind CSS

**Lý do chọn:**
- **Utility-first**: Cung cấp các utility classes giúp xây dựng UI nhanh chóng mà không cần viết CSS riêng.
- **Hiệu suất tốt**: Chỉ tạo ra CSS cần thiết, giúp giảm kích thước bundle.
- **Responsive design**: Dễ dàng xây dựng giao diện responsive với các breakpoint classes.
- **Tùy biến dễ dàng**: Dễ dàng tùy chỉnh theme, màu sắc, spacing, etc. thông qua file cấu hình.
- **Cộng đồng lớn**: Có cộng đồng lớn và nhiều tài liệu hướng dẫn.

**Cách sử dụng trong dự án:**
- Tùy chỉnh theme trong `tailwind.config.js` để thêm các màu chính: primary (#1e40af), secondary (#60a5fa), accent (#3b82f6).
- Sử dụng các utility classes để xây dựng layout, spacing, typography, và responsive design.
- Kết hợp với shadcn/ui để tạo giao diện nhất quán.

## State Management

### Jotai

**Lý do chọn:**
- **Nhẹ và đơn giản**: Jotai có API đơn giản và kích thước nhỏ (< 3KB).
- **Atomic**: Quản lý state theo mô hình atomic, giúp tránh re-render không cần thiết.
- **TypeScript**: Hỗ trợ TypeScript tốt, giúp code an toàn hơn.
- **Không cần context providers**: Không cần bọc ứng dụng trong context providers như Redux.
- **Tích hợp tốt với React**: Được thiết kế đặc biệt cho React và hoạt động tốt với React Suspense.

**Cách sử dụng trong dự án:**
- Quản lý trạng thái người dùng và phân quyền.
- Lưu trữ dữ liệu form tạm thời giữa các bước.
- Quản lý trạng thái ứng dụng như loading, error, etc.
- Chia sẻ dữ liệu giữa các components không liên quan trực tiếp.

## Form Handling

### React Hook Form + Zod

**Lý do chọn React Hook Form:**
- **Hiệu suất cao**: Giảm thiểu re-renders không cần thiết.
- **Uncontrolled components**: Sử dụng uncontrolled components giúp tăng hiệu suất.
- **Validation linh hoạt**: Hỗ trợ nhiều phương pháp validation khác nhau.
- **TypeScript**: Hỗ trợ TypeScript tốt.
- **Kích thước nhỏ**: Bundle size nhỏ (~9KB).

**Lý do chọn Zod:**
- **TypeScript-first**: Được thiết kế đặc biệt cho TypeScript.
- **Schema validation**: Cung cấp API mạnh mẽ để định nghĩa và validate schemas.
- **Type inference**: Tự động suy luận types từ schemas.
- **Error messages**: Cung cấp error messages rõ ràng và dễ tùy chỉnh.
- **Composable**: Dễ dàng kết hợp và mở rộng schemas.

**Cách sử dụng trong dự án:**
- Sử dụng React Hook Form để quản lý các form như đăng ký, đăng nhập, tải lên tài liệu, etc.
- Sử dụng Zod để định nghĩa schemas validation cho các form.
- Kết hợp với shadcn/ui Form components để tạo form UI đẹp và dễ sử dụng.
- Tự động hiển thị error messages khi validation fails.

## API Handling

### Axios + TanStack Query

**Lý do chọn Axios:**
- **API đơn giản**: Cung cấp API đơn giản và dễ sử dụng.
- **Interceptors**: Hỗ trợ request và response interceptors.
- **Automatic transforms**: Tự động transform request và response data.
- **Error handling**: Xử lý lỗi tốt hơn fetch API.
- **Cancellation**: Hỗ trợ cancel requests.

**Lý do chọn TanStack Query:**
- **Caching**: Caching và invalidation thông minh.
- **Background fetching**: Tự động fetch dữ liệu trong background.
- **Pagination và infinite scrolling**: Hỗ trợ sẵn pagination và infinite scrolling.
- **Prefetching**: Hỗ trợ prefetching data.
- **Devtools**: Có devtools để debug.

**Cách sử dụng trong dự án:**
- Sử dụng Axios để tạo API client và gọi các API endpoints.
- Sử dụng TanStack Query để quản lý data fetching, caching, và invalidation.
- Tạo các custom hooks cho các API calls phổ biến.
- Sử dụng TanStack Query's mutations để xử lý POST, PUT, DELETE requests.

## File Upload & Processing

### react-dropzone + pdf.js

**Lý do chọn react-dropzone:**
- **Drag & drop**: Hỗ trợ drag & drop files.
- **File validation**: Validation file type, size, etc.
- **Multiple files**: Hỗ trợ upload nhiều files.
- **Customizable**: Dễ dàng tùy chỉnh UI.
- **Hooks API**: Cung cấp hooks API dễ sử dụng.

**Lý do chọn pdf.js:**
- **Rendering PDF**: Render PDF files trực tiếp trên browser.
- **Extracting data**: Trích xuất text và metadata từ PDF files.
- **Cross-browser**: Hoạt động trên nhiều browsers khác nhau.
- **Open source**: Được phát triển và bảo trì bởi Mozilla.

**Cách sử dụng trong dự án:**
- Sử dụng react-dropzone để tạo UI upload học bạ và chứng chỉ.
- Sử dụng pdf.js để render preview của PDF files.
- Trích xuất dữ liệu từ học bạ PDF như điểm học tập và nhận xét/đánh giá rèn luyện.

## Table Management

### TanStack Table

**Lý do chọn:**
- **Headless**: Không có UI mặc định, cho phép tùy chỉnh hoàn toàn.
- **Feature-rich**: Hỗ trợ sorting, filtering, pagination, row selection, etc.
- **Composable**: Dễ dàng kết hợp với các UI libraries khác.
- **TypeScript**: Hỗ trợ TypeScript tốt.
- **Virtual scrolling**: Hỗ trợ virtual scrolling cho large datasets.

**Cách sử dụng trong dự án:**
- Hiển thị danh sách học sinh trong trang quản lý.
- Thêm các tính năng sorting, filtering, và pagination.
- Kết hợp với shadcn/ui Table components để tạo UI đẹp và dễ sử dụng.

## Authentication

### JWT Authentication với Backend Riêng

**Lý do chọn:**
- **Tích hợp với backend riêng**: Cho phép sử dụng hệ thống authentication từ backend hiện có.
- **Bảo mật cao**: JWT cung cấp cơ chế bảo mật mạnh mẽ với signature verification.
- **Stateless**: Không cần lưu trữ session trên server, giảm tải cho database.
- **Hiệu suất tốt**: Xác thực nhanh chóng thông qua token mà không cần truy vấn database.
- **Khả năng mở rộng**: Dễ dàng mở rộng hệ thống khi cần thiết.

**Cách sử dụng trong dự án:**
- Tích hợp với API backend để xác thực người dùng và nhận JWT token.
- Lưu trữ JWT token trong HTTP-only cookies để tăng tính bảo mật.
- Validate session bằng cách gửi token đến API backend để kiểm tra tính hợp lệ.
- Xử lý logout bằng cách xóa token khỏi cookies.
- Khong xu ly auth o middleware
- Tạo custom hooks để kiểm tra trạng thái đăng nhập và phân quyền.
- Tạo custom hooks để lấy thông tin user từ JWT token.
- Tạo custom hooks để gửi token đến API backend để xác thực.
- Trích xuất thông tin user và phân quyền từ JWT payload.

## Kết luận

Việc lựa chọn stack công nghệ trên giúp xây dựng một hệ thống quản lý tuyển sinh hiện đại, hiệu suất cao, và dễ bảo trì. Các công nghệ này hoạt động liền mạch với nhau, tạo ra một trải nghiệm phát triển tốt và một sản phẩm cuối cùng chất lượng cao.

Stack công nghệ này cũng rất phổ biến trong cộng đồng phát triển web, có nhiều tài liệu hướng dẫn và hỗ trợ, giúp giảm thiểu rủi ro và tăng tốc độ phát triển.
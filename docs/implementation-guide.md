# Hướng dẫn triển khai hệ thống quản lý tuyển sinh

## Cài đặt và khởi tạo dự án

### Bước 1: Khởi tạo dự án Next.js 14

```bash
# Tạo dự án Next.js mới với TypeScript, Tailwind CSS và App Router
npx create-next-app@latest le-loi-admission --typescript --tailwind --app

# Di chuyển vào thư mục dự án
cd le-loi-admission
```

### Bước 2: Cài đặt các dependencies cần thiết

```bash
# Cài đặt shadcn/ui
npx shadcn-ui@latest init

# Cài đặt các components UI cần thiết từ shadcn/ui
npx shadcn-ui@latest add button card form input select textarea table tabs dialog popover dropdown-menu toast alert avatar badge

# Cài đặt các thư viện quản lý state và form
npm install jotai react-hook-form @hookform/resolvers zod

# Cài đặt thư viện xử lý API và data fetching
npm install axios @tanstack/react-query @tanstack/react-table

# Cài đặt thư viện xử lý file và PDF
npm install react-dropzone pdfjs-dist

# Cài đặt các tiện ích khác
npm install date-fns lucide-react next-auth
```

### Bước 3: Cấu hình Tailwind CSS với palette màu từ demo

Chỉnh sửa file `tailwind.config.ts` để thêm các màu chính:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: '#1e40af', // Blue color as primary
        secondary: '#60a5fa',
        accent: '#3b82f6',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

## Triển khai từng giai đoạn

### Giai đoạn 1: Thiết lập cấu trúc dự án

#### Tạo cấu trúc thư mục

```bash
# Tạo các thư mục cần thiết
mkdir -p app/api/auth/[...nextauth] app/auth/login app/auth/register app/dashboard/parent app/dashboard/manager
mkdir -p components/ui components/forms components/dashboard/parent components/dashboard/manager components/shared
mkdir -p lib/api lib/auth lib/pdf lib/validators
mkdir -p store types mock/data public/images
```

#### Thiết lập các types cơ bản

Tạo file `types/index.ts`:

```typescript
// types/index.ts

// Định nghĩa các loại tài khoản
export type UserRole = 'parent' | 'manager';

// Định nghĩa trạng thái hồ sơ
export type ApplicationStatus = 'pending' | 'eligible' | 'ineligible' | 'confirmed';

// Định nghĩa giới tính
export type Gender = 'male' | 'female';

// Định nghĩa mối quan hệ với học sinh
export type Relationship = 'father' | 'mother' | 'guardian' | 'other';

// Định nghĩa loại tài liệu
export type DocumentType = 'transcript' | 'certificate' | 'other';
```

### Giai đoạn 2: Xây dựng hệ thống xác thực

#### Thiết lập NextAuth.js

Tạo file `app/api/auth/[...nextauth]/route.ts`:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/types';

// Mock users for demonstration
const users = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'parent@example.com',
    password: 'password',
    role: 'parent' as UserRole,
  },
  {
    id: '2',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'manager' as UserRole,
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find(user => user.email === credentials.email);

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
```

#### Tạo trang đăng nhập

Tạo file `app/auth/login/page.tsx`:

```tsx
// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setError(null);

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Email hoặc mật khẩu không chính xác');
      return;
    }

    // Redirect based on user role
    // In a real app, you would get this from the session
    if (data.email === 'parent@example.com') {
      router.push('/dashboard/parent');
    } else if (data.email === 'admin@example.com') {
      router.push('/dashboard/manager');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Hệ thống Quản lý Tuyển sinh</CardTitle>
          <CardDescription>Đăng nhập để tiếp tục</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Giai đoạn 3: Xây dựng giao diện cho Phụ huynh

#### Tạo layout cho dashboard

Tạo file `app/dashboard/layout.tsx`:

```tsx
// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Sidebar />
          </div>
          <div className="w-full md:w-3/4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Tạo component Header

Tạo file `components/shared/Header.tsx`:

```tsx
// components/shared/Header.tsx
'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Hệ thống Quản lý Tuyển sinh
          {session?.user?.role === 'manager' && ' - Quản lý'}
        </h1>
        <div className="flex items-center space-x-4">
          <span>{session?.user?.name}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### Tạo component Sidebar cho Phụ huynh

Tạo file `components/shared/Sidebar.tsx`:

```tsx
// components/shared/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isParent = session?.user?.role === 'parent';
  const isManager = session?.user?.role === 'manager';

  const parentLinks = [
    { href: '/dashboard/parent', label: 'Phiếu đăng ký dự tuyển' },
    { href: '/dashboard/parent/documents', label: 'Tải lên học bạ & chứng chỉ' },
    { href: '/dashboard/parent/status', label: 'Xem trạng thái hồ sơ' },
  ];

  const managerLinks = [
    { href: '/dashboard/manager', label: 'Danh sách học sinh' },
    { href: '/dashboard/manager/schedule', label: 'Quản lý lịch nộp hồ sơ' },
    { href: '/dashboard/manager/pending', label: 'Hồ sơ cần xử lý' },
    { href: '/dashboard/manager/confirmation', label: 'Xác nhận hồ sơ trực tiếp' },
  ];

  const links = isParent ? parentLinks : isManager ? managerLinks : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold mb-4 text-primary">
        {isParent ? 'Menu' : 'Menu Quản lý'}
      </h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'block p-2 rounded transition-colors',
                pathname === link.href
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Tạo trang đăng ký cho Phụ huynh

Tạo file `app/dashboard/parent/page.tsx`:

```tsx
// app/dashboard/parent/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistrationForm } from '@/components/forms/RegistrationForm';

export default function ParentDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Phiếu đăng ký dự tuyển</CardTitle>
        <CardDescription>
          Vui lòng điền đầy đủ thông tin cá nhân và thông tin học sinh.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegistrationForm />
      </CardContent>
    </Card>
  );
}
```

### Giai đoạn 4: Xây dựng giao diện cho Người quản lý

#### Tạo trang danh sách học sinh

Tạo file `app/dashboard/manager/page.tsx`:

```tsx
// app/dashboard/manager/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentTable } from '@/components/dashboard/manager/StudentTable';

export default function ManagerDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Danh sách học sinh đăng ký</CardTitle>
        <CardDescription>
          Quản lý và xem thông tin của tất cả học sinh đã đăng ký.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StudentTable />
      </CardContent>
    </Card>
  );
}
```

### Giai đoạn 5: Xây dựng Mock API

#### Thiết lập Axios client

Tạo file `lib/api/client.ts`:

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Tạo mock data

Tạo file `mock/data/students.ts`:

```typescript
// mock/data/students.ts
import { Student } from '@/types/student';
import { Application } from '@/types/application';

export const mockStudents: Student[] = [
  {
    id: 'HS2025001',
    name: 'Nguyễn Văn Em',
    dob: '2010-05-15',
    gender: 'male',
    address: '123 Đường Lê Lợi, Quận 1, TP HCM',
    currentSchool: {
      name: 'THCS Lê Lợi',
      address: '456 Đường Nguyễn Huệ, Quận 1, TP HCM',
    },
  },
  // Thêm các học sinh khác
];

export const mockApplications: Application[] = [
  {
    id: 'APP2025001',
    studentId: 'HS2025001',
    parentId: 'PH2025001',
    status: 'eligible',
    lastUpdated: '2025-04-15',
    examInfo: {
      sbd: 'TS2025001',
      room: 'P201',
      date: '2025-05-20',
      time: '08:00 - 11:30',
    },
    documents: [],
  },
  // Thêm các hồ sơ khác
];
```

## Hướng dẫn chạy và triển khai

### Chạy dự án trong môi trường phát triển

```bash
npm run dev
```

Sau khi chạy lệnh trên, ứng dụng sẽ được khởi chạy tại địa chỉ http://localhost:3000.

### Build và triển khai

```bash
# Build dự án
npm run build

# Chạy phiên bản production
npm start
```

## Kết luận

Tài liệu này cung cấp hướng dẫn chi tiết về cách triển khai hệ thống quản lý tuyển sinh sử dụng Next.js 14, ShadCN, Tailwind CSS và các công nghệ khác. Bằng cách tuân theo các bước trong tài liệu này, bạn có thể xây dựng một hệ thống quản lý tuyển sinh hoàn chỉnh với đầy đủ chức năng cho cả phụ huynh và người quản lý.
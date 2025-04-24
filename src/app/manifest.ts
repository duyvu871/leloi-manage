import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Hệ thống quản lý tuyển sinh THCS Lê Lợi',
        short_name: 'TS Lê Lợi',
        description: 'Hệ thống quản lý tuyển sinh trực tuyến dành cho trường THCS Lê Lợi, giúp đơn giản hóa quy trình tuyển sinh lớp 6.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1d4ed8',
        icons: [
            {
                src: '/images/logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/images/logo.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ],
    }
}
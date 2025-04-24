import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/auth/', 
        '/dashboard-admin/', 
        '/dashboard-user/',
        '/api/'
      ],
    },
    sitemap: 'https://leloi.edu.vn/sitemap.xml',
  };
}
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    BLOG: '/blog',
    CONTACT: '/contact',

    USER_LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/admin/login',
    USER_DASHBOARD: '/dashboard-user',
    ADMIN_DASHBOARD: '/dashboard-admin',
    USER_PROFILE: '/dashboard-user/profile',
    ADMIN_PROFILE: '/dashboard-admin/profile',
};

export const getLocalizedPath = (lang: string, path: string) => `/${lang}${path}`;

export const API_ROUTES = {
    v1: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            REFRESH_TOKEN: '/auth/refresh-token',
            PROFILE: '/auth/profile',
            UPDATE_PROFILE: '/auth/profile/update',
            CHANGE_PASSWORD: '/auth/change-password',
            RESET_PASSWORD: '/auth/reset-password',
            FORGOT_PASSWORD: '/auth/forgot-password',
        },
        REGISTRATION: {
            GET_RESTRATION: '/registration',
            SUBMIT: '/registration/submit',
            STATUS: '/registration/status',
            STUDENT: '/registration/student',
            PARENT_INFO: '/registration/parent-info',
            COMMITMENT: '/registration/commitment',
            PRIORITY_POINT: '/registration/priority-point',
            COMPETITION_RESULTS: '/registration/competition-results',
            DOCUMENT_UPLOAD: '/process/document-upload',
            APPLICATION: '/registration/application',
        },
        TIMELINE: {
            LIST: '/timeline',
            ITEM: '/timeline/item',
            IMPORT: '/timeline/import',
            EXPORT: '/timeline/export',
            REORDER: '/timeline/reorder',
            BATCH: '/timeline/batch',
            PUBLIC: '/timeline/public',
        },  
        USER: {
            PROFILE: '/user/profile',
            SETTINGS: '/user/settings',
        },
        ADMIN: {
            LOGIN: '/admin/login',
            LOGOUT: '/admin/logout',
            PROFILE: '/admin/profile',
            DASHBOARD: '/admin/dashboard',
            USERS: '/admin/users',
            STATS: '/admin/stats',
            STUDENTS: '/admin/students',
            PENDING: '/admin/pending',
            VERIFY: '/admin/verify', 
            STATS_DETAILED: '/admin/stats/detailed',
        },
    },
    FEEDBACK: {
        CREATE: '/api/v1/feedback',
        LIST: '/api/v1/feedback',
        DETAIL: '/api/v1/feedback',
        UPDATE: '/api/v1/feedback',
        DELETE: '/api/v1/feedback',
    },
} as const;

export const getApiRoute = (version: string, route: string) => `/api/${version}${route}`;

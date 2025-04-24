import { atom } from 'jotai';
import { AdminInput } from '@schema/admin/dto';

export type AdminRole = 'superadmin' | 'moderator';

export interface Admin extends AdminInput {
    id: string;
    role: AdminRole;
}

// admin atom
export const adminAtom = atom<Admin | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isLoadingAtom = atom<boolean>(true);

// check if admin is superadmin
export const isSuperAdminAtom = atom<boolean>(
    (get) => get(adminAtom)?.role === 'superadmin'
);

// check if admin is moderator
export const isModeratorAtom = atom<boolean>(
    (get) => get(adminAtom)?.role === 'moderator'
);

// get admin username from adminAtom if admin is not null, otherwise return null
export const adminUsernameAtom = atom<string | null>(
    (get) => get(adminAtom)?.username ?? null
);

// get admin email from adminAtom if admin is not null, otherwise return null
export const adminEmailAtom = atom<string | null>(
    (get) => get(adminAtom)?.email ?? null
);

// get admin id from adminAtom if admin is not null, otherwise return null
export const adminIdAtom = atom<string | null>(
    (get) => get(adminAtom)?.id ?? null
);
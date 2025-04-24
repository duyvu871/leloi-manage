import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Auth token management
export const authTokenAtom = atomWithStorage<string | null>('auth_token', null);
export const refreshTokenAtom = atomWithStorage<string | null>('refresh_token', null);
export const isAuthenticatedAtom = atom<boolean>(false);

// Loading state
export const isLoadingAtom = atom<boolean>(false);

// Auth state validation
export const hasValidTokenAtom = atom<boolean>(get => {
  const token = get(authTokenAtom);
  return token !== null && token.length > 0;
});

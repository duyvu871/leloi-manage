'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { axiosRequestWithException } from '@lib/apis/base';
import { isAuthenticatedAtom, isLoadingAtom } from '@store/auth';
import { ROUTES } from '@constant/path';
import { checkCookie } from '@lib/apis/base';
import { useMock } from 'config';
import RingLoader from '@component/ui/loader';
import { userAtom } from '@store/user';
import { mockParents } from '@/mock/data/user';
import { getProfile } from '@/libs/apis/auth';

export default function AuthProvider({ children }: PropsWithChildren) {
  const [, setUser] = useAtom(userAtom);
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log('Auth verification started');
        
        const { hasCookie } = checkCookie();
        
        if (!hasCookie) {
          setIsLoading(false);
          return;
        }

        const response = await getProfile(); // Thay thế bằng hàm gọi API của bạn

        setUser(response);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        setUser(null);
        setIsAuthenticated(false);
        router.push(ROUTES.USER_LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [setUser, setIsAuthenticated, setIsLoading, router]);

  if (isLoading) {
    return <RingLoader />; // Có thể thay bằng loading component của bạn
  }

  return <>{children}</>;
}
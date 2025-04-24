import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { API_ENDPOINT } from 'config';
import { getCookie, removeCookie, setCookie } from '@util/cookie';
import router from 'next/router';
import { API_ROUTES, ROUTES } from '@constant/path';
import { CookieAccessToken, CookieRefreshToken } from '@type/token';
import { parseJson } from '@util/parse-json';

type CheckCookieResult =
	| {
			hasCookie: true;
			cookie: string;
	  }
	| {
			hasCookie: false;
			cookie: undefined;
	  };

const publicPaths = [
	API_ROUTES.v1.AUTH.LOGIN,
	API_ROUTES.v1.AUTH.REGISTER,
	API_ROUTES.v1.AUTH.FORGOT_PASSWORD,
	API_ROUTES.v1.AUTH.RESET_PASSWORD,
	API_ROUTES.v1.ADMIN.LOGIN,
	API_ROUTES.v1.ADMIN.LOGOUT,
];

export interface APIV1 {
	signin: (signinData: any, callback?: (data: any) => void) => Promise<any>;
	register: (signinData: any, callback?: (data: any) => void) => Promise<any>;
}

export const baseURL = `${API_ENDPOINT}/api/v1`;

const axiosRequestConfig: AxiosRequestConfig = {
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
};

export const checkCookie = (): CheckCookieResult => {
	const cookie = getCookie('token' as string);

	return cookie ? { hasCookie: true, cookie: cookie } : { hasCookie: false, cookie: undefined };
};

const getRefreshToken = () => {
	const refreshToken = getCookie('refreshToken' as string);
	return refreshToken ? parseJson<CookieRefreshToken>(refreshToken) : null;
};

const axiosWithAuth = axios.create(axiosRequestConfig);

const requestInterceptor = axiosWithAuth.interceptors.request.use(
	async requestConfig => {
		const currentPath = window.location.pathname;

		const loginPath = currentPath.startsWith('/admin') ? ROUTES.ADMIN_LOGIN : ROUTES.USER_LOGIN;

		const isPublicPath = publicPaths.some(path => currentPath.includes(path));
		if (!isPublicPath) {
			const { cookie, hasCookie } = checkCookie();
			if (!hasCookie) {
				window.location.href = loginPath;
				return requestConfig; // stop request
			}

			requestConfig.headers['Authorization'] = `Bearer ${cookie}`;
		}

		return requestConfig;
	},
	error => {
		return Promise.reject(error);
	},
);

const responseInterceptor = axiosWithAuth.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		// Handle specific status codes first
		switch (error?.response?.status) {
			case 401:
				removeCookie('token');
				const isAdmin = window.location.pathname.includes('admin');
				window.location.href = isAdmin ? ROUTES.ADMIN_LOGIN : ROUTES.USER_LOGIN;
				break;
			case 400:
				// Handle 400 specifically if needed (even without errorMessage)
				break;
		}

		// Handle error message extraction after status code handling
		if (error.response?.data?.errorMessage) {
			const serverError = new Error(error.response.data.errorMessage);
			return Promise.reject(serverError);
		}

		return Promise.reject(error);
	},
);

export const axiosRequestWithException = async <T>(
	config: AxiosRequestConfig,
	callback?: (data: T) => void,
) => {
	try {
		const response = await axiosWithAuth.request<T>(config);
		callback?.(response.data);
		return response.data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else if (error instanceof axios.AxiosError) {
			throw new Error(error.response?.data?.errorMessage || 'Unknown error');
		}
		throw error;
	}
};

export default axiosWithAuth;

import { API_ROUTES } from "@/constants/path";
import { AuthLoginSuccessResponse, ExternalLoginAPIResponse } from "@/types/api/auth";
import { SuccessResponse } from "@/types/api/response";
import { axiosRequestWithException } from "@lib/apis/base"
import { AuthCredentialSchema, ProfileResponse } from "@schema/auth/dto";
import { RegisterUserDto } from "@schema/user/dto";

export type DirectOption = {
    direct?: boolean,
    directPath?: string
}

export const signIn = async (type: 'credentials', dto: AuthCredentialSchema, config?: DirectOption) => {
    if (type === 'credentials') {
        const requestConfig = {
            method: 'post',
            url: API_ROUTES.v1.AUTH.LOGIN,
            data: {
                ...dto,
            }
        }
        return (await axiosRequestWithException<SuccessResponse<ExternalLoginAPIResponse>>(
            requestConfig,
            () => {
                console.log("Sign in success");
                if (config?.direct) {
                    window.location.href = config.directPath || '/';
                }
            }
        )).data;
    }

    throw new Error('Invalid login type. Expected "credentials".');
}

export const signUp = async (dto: RegisterUserDto) => {
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.AUTH.REGISTER,
        data: {
            type: 'user',
            ...dto,
        }
    }
    return await axiosRequestWithException(
        requestConfig,
        () => {
            console.log("Sign up success");
        }
    )
}

export const logout = async () => {
    const requestConfig = {
        method: 'post',
        url: API_ROUTES.v1.AUTH.LOGOUT,
    }
    return await axiosRequestWithException(
        requestConfig,
        () => {
            console.log("Logout success");
        }
    )
}

export const getProfile = async () => {
    const requestConfig = {
        method: 'get',
        url: API_ROUTES.v1.AUTH.PROFILE,
    }
    return (await axiosRequestWithException<SuccessResponse<ProfileResponse>>(
        requestConfig,
        () => {
            console.log("Get profile success");
        }
    )).data;
}
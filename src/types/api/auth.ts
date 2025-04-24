export type ExternalLoginAPIResponse = {
	tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
	user: {
        id: number;
        username: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
	};
}

export type ExternalRefreshTokenAPIResponse = {
	accessToken: {
		token: string;
		expire_access_token: number;
		token_type: string;
	};
}

export type AuthLoginSuccessResponse = {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: 'user' | 'admin';
}
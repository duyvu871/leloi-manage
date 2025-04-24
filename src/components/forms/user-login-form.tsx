import { FormBuilder } from './form-builder';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { DirectOption, signIn } from '@lib/apis/auth';
import { useLocale } from 'next-intl';
import { Button } from '@mantine/core';
import useToast from '@/hooks/client/use-toast-notification';
import { useRouter } from '@/i18n/navigation';
import { setCookie } from '@/utils/cookie';

const userLoginSchema = z
	.object({
		email: z.string().email('Email không hợp lệ'),
		password: z.string().min(1, 'Mật khẩu không được để trống'),
		rememberMe: z.boolean().optional(),
	})

type UserLoginValues = z.infer<typeof userLoginSchema>;

export function UserLoginForm() {
	const router = useRouter();
	const lang = useLocale();
	const {showErrorToast, showSuccessToast} = useToast();

	const { mutate: login, isPending } = useMutation({
		mutationFn: async (data: UserLoginValues) => {
			// Don't redirect directly from the auth library; let React handle it
			const directOption: DirectOption = {
				direct: false, // Keep this false to prevent the auth library from redirecting
				directPath: `/${lang}/dashboard`,
			};

			// Handle the authentication
			const result = await signIn(
				'credentials',
				{
					...data,
					type: 'user',
				},
				directOption,
			);

			// Set the token in cookies
			setCookie('token', result.tokens.accessToken, result.tokens.expiresIn.toString());

			return result;
		},
		onSuccess: (data) => {
			showSuccessToast('Đăng nhập thành công!');
			// Use the i18n-aware router for navigation after successful login
			// Add a small delay to ensure the toast is shown before navigation
			setTimeout(() => {
				router.push(`/dashboard`);
			}, 500);
		},
		onError: error => {
			if (error instanceof Error) {
				console.error('Login error:', error.message);
				showErrorToast(error.message);
			} else {
				console.error('An unknown error occurred during login:', error);
				showErrorToast('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.');
			}
		},
	});

	return (
		<div className='w-full max-w-sm mx-auto mt-10'>
			<FormBuilder
				schema={userLoginSchema}
				fields={[
					{
						type: 'email',
						name: 'email',
						label: 'Email',
						placeholder: 'Nhập email của bạn',
						required: true,
					},
					{
						type: 'password',
						name: 'password',
						label: 'Mật khẩu',
						placeholder: 'Nhập mật khẩu',
						required: true,
					},
					{
						type: 'checkbox',
						name: 'rememberMe',
						label: 'Ghi nhớ đăng nhập',
						placeholder: 'Nhớ tôi',
						customProps: {
							color: 'blue',
						},
					},
				]}
				onSubmit={data => login(data as UserLoginValues)}
				submitText='Đăng nhập'
				spacing='40px'
				actions={
					<Button type='submit' disabled={isPending} loading={isPending} color='blue' fullWidth>
						Đăng nhập
					</Button>
				}
			/>
			<div className='text-center mt-4'>
				<span className='text-sm text-gray-500'>Chưa có tài khoản? </span>
				<a href={`/${lang}/auth/register`} className='text-blue-500 hover:underline'>
					Đăng ký ngay
				</a>
			</div>
			<div className='text-center mt-2'>
				<a href={`/${lang}/auth/forgot-password`} className='text-blue-500 hover:underline'>
					Quên mật khẩu?
				</a>
			</div>
		</div>
	);
}

import { FormBuilder } from './form-builder';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DirectOption, signUp } from '@lib/apis/auth';
import { SignUpSchema, signUpSchema } from '@lib/validators/auth';
import { useLocale } from 'next-intl';
import { Button, Group } from '@mantine/core';

export function RegistrationForm() {
	const router = useRouter();
	const lang = useLocale();
	const { mutate: register, isPending } = useMutation({
		mutationFn: async (data: SignUpSchema) => {
			const { terms, confirmPassword, ...rest } = data;
			if (terms !== true) {
				throw new Error('Bạn cần đồng ý với các điều khoản và điều kiện');
				}
			
			// Add the required role and relationship fields for RegisterParentDto
			const registerData = {
				...rest,
				role: 'parent' as const,
				relationship: 'father' as const, // Default to 'father', can be modified by user selection
			};
			
			const result = await signUp(registerData);

			if (result?.error) throw new Error(result.error);
			return result;
		},
		onSuccess: () => {
			router.push('/login');
		},
	});

	return (
		<div className='w-full max-w-2xl mx-auto mt-10'>
			<FormBuilder
				schema={signUpSchema}
				fields={[
					{
						type: 'text',
						name: 'name',
						label: 'Họ và tên',
						placeholder: 'Nhập họ và tên của bạn',
						required: true,
						colSpan: 6,
					},
					{
						type: 'email',
						name: 'email',
						label: 'Email',
						placeholder: 'Nhập email của bạn',
						required: true,
						colSpan: 6,
					},
					{
						type: 'text',
						name: 'address',
						label: 'Địa chỉ',
						placeholder: 'Nhập địa chỉ của bạn',
						required: true,
						colSpan: 6,
					},
					{
						type: 'tel',
						name: 'phone',
						label: 'Số điện thoại',
						placeholder: 'Nhập số điện thoại',
						required: true,
						colSpan: 6,
					},
					{
						type: 'select',
						name: 'relationship',
						label: 'Mối quan hệ với học sinh',
						placeholder: 'Chọn mối quan hệ',
						required: true,
						options: [
							{ label: 'Cha', value: 'father' },
							{ label: 'Mẹ', value: 'mother' },
							{ label: 'Người giám hộ', value: 'guardian' },
						],
						colSpan: 12,
					},
					{
						type: 'password',
						name: 'password',
						label: 'Mật khẩu',
						placeholder: 'Nhập mật khẩu',
						required: true,
					},
					{
						type: 'password',
						name: 'confirmPassword',
						label: 'Xác nhận mật khẩu',
						placeholder: 'Nhập lại mật khẩu',
						required: true,
					},
					{
						type: 'checkbox',
						name: 'terms',
						label: 'Tôi đồng ý với các điều khoản và điều kiện',
						placeholder: 'Tôi đồng ý với các điều khoản và điều kiện',
						required: true,
						customProps: {
							color: 'blue',
						},
						colSpan: 12,
					},
				]}
				onSubmit={data => register(data as SignUpSchema)}
				submitText='Đăng ký'
                spacing='40px'
				actions={
					<Button type='submit' disabled={isPending} loading={isPending} color='blue' fullWidth>
						Đăng ký
					</Button>
				}
			/>
			<div className='text-center mt-4'>
				<span className='text-sm text-gray-500'>Đã có tài khoản? </span>
				<a href={`/${lang}/auth/login`} className='text-blue-500 hover:underline'>
					Đăng nhập ngay
				</a>
			</div>
		</div>
	);
}

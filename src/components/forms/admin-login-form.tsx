import { FormBuilder } from './form-builder';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DirectOption, signIn } from '@lib/apis/auth';
import { AuthCredentialSchema } from '@schema/auth/dto';
import { signInSchema } from '@lib/validators/auth';

export function AdminLoginForm() {
	const router = useRouter();

	const { mutate: login, isPending } = useMutation({
		mutationFn: async (data: AuthCredentialSchema) => {
            const directOption: DirectOption = {
                direct: false,
                directPath: '/admin/dashboard',
            }

			const result = await signIn('credentials', {
				...data,
				type: 'admin',
			}, directOption);

			return result;
		},
		onSuccess: () => {
			router.push('/admin/dashboard');
		},
	});

	return (
		<FormBuilder
			schema={signInSchema}
			fields={[
				{
					type: 'email',
					name: 'email',
					label: 'Email',
					placeholder: 'Nhập email',
					required: true,
				},
				{
					type: 'password',
					name: 'password',
					label: 'Mật khẩu',
					placeholder: 'Nhập mật khẩu',
					required: true,
				},
			]}
			onSubmit={data => login({
				...data,
				type: 'admin',
			})}
			submitText='Đăng nhập'
		/>
	);
}

import { phoneRegex } from '@/utils/validator';
import { z } from 'zod';

// Schema for sign in
export const signInSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	password: z.string().min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }),
	remember: z.boolean().optional(),
});

export type SignInSchema = z.infer<typeof signInSchema>;

// Schema for sign up
export const signUpSchema = z
	.object({
		fullName: z.string().min(2, { message: 'Họ và tên phải chứa ít nhất 2 ký tự' }),
		email: z.string().email({ message: 'Email không hợp lệ' }),
		password: z.string().min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }),
		confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu phải chứa ít nhất 6 ký tự' }),
		phone: z.string().regex(phoneRegex, {
			message: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ',
		}),
		address: z.string().min(5, { message: 'Địa chỉ phải chứa ít nhất 5 ký tự' }),
		relationship: z.enum(['father', 'mother', 'guardian'], {
			errorMap: () => ({ message: 'Vui lòng chọn mối quan hệ với học sinh' }),
		}),
		terms: z.boolean().refine(val => val === true, {
			message: 'Bạn phải đồng ý với các điều khoản và điều kiện',
		}),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Mật khẩu và xác nhận mật khẩu không khớp',
		path: ['confirmPassword'],
	});

export type SignUpSchema = z.infer<typeof signUpSchema>;

// Schema for password reset request
export const resetPasswordRequestSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
});

export type ResetPasswordRequestSchema = z.infer<typeof resetPasswordRequestSchema>;

// Schema for setting new password
export const resetPasswordSchema = z
	.object({
		password: z.string().min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }),
		confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu phải chứa ít nhất 6 ký tự' }),
		token: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Mật khẩu và xác nhận mật khẩu không khớp',
		path: ['confirmPassword'],
	});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

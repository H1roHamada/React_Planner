'use client';

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { App, Button, Card, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import { errorCatch } from '@/api/error-catch';

import { IAuthForm } from '@/shared/interfaces/auth.interface';
import { authService } from '@/shared/services/auth.service';

export function Auth() {
	const { message } = App.useApp();
	const key = 'updatable';

	const [isLoginForm, setIsLoginForm] = useState(true);

	const { push } = useRouter();

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) => {
			message.open({
				key,
				type: 'loading',
				content: isLoginForm ? 'Вход...' : 'Регистрация...'
			});
			return authService.main(isLoginForm ? 'login ' : 'register', data);
		},
		onSuccess() {
			message.open({
				key,
				type: 'success',
				content: isLoginForm ? 'Успешный вход!' : 'Успешная регистрация!',
				duration: 2
			});
			push(DASHBOARD_PAGES.HOME);
		},
		onError(error) {
			message.open({
				key,
				type: 'error',
				content: errorCatch(error),
				duration: 2
			});
		}
	});

	const onFinish = (data: IAuthForm) => {
		mutate(data);
	};

	return (
		<>
			<div className='flex min-h-screen'>
				<Card
					title='Вход'
					className='m-auto'
					style={{ width: '300px' }}
				>
					<Form
						name='auth'
						onFinish={onFinish}
					>
						<Form.Item
							name='email'
							rules={[
								{
									required: true,
									message: 'Введите Email!'
								},
								{
									type: 'email',
									message: 'Некорректный email!'
								}
							]}
						>
							<Input
								prefix={<MailOutlined className='site-form-item-icon' />}
								placeholder='Email'
							/>
						</Form.Item>
						<Form.Item
							name='password'
							rules={[
								{ required: true, message: 'Введите пароль!' },
								{ min: 6, message: 'Минимум 6 символов!' }
							]}
						>
							<Input
								prefix={<LockOutlined className='site-form-item-icon' />}
								type='password'
								placeholder='Пароль'
							/>
						</Form.Item>

						<Form.Item>
							<div className='flex gap-5'>
								<Button
									type='primary'
									htmlType='submit'
									className='flex-1'
									onClick={() => setIsLoginForm(true)}
								>
									Вход
								</Button>
								<Button
									htmlType='submit'
									className='flex-1'
									onClick={() => setIsLoginForm(false)}
								>
									Регистрация
								</Button>
							</div>
						</Form.Item>
					</Form>
				</Card>
			</div>{' '}
		</>
	);
}
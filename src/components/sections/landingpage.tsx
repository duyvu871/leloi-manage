'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	IconArrowRight,
	IconCalendar,
	IconFileUpload,
	IconUserCheck,
	IconUsers,
} from '@tabler/icons-react';
import {
	Button,
	Card,
	Container,
	Text,
	Title,
	Group,
	Badge,
	Accordion,
	Divider,
	Box,
} from '@mantine/core';
import { useLocale, useTranslations } from 'next-intl';

export const LandingHero = () => {
	const t = useTranslations();
	const lang = useLocale();
	const router = useRouter();

	const timelineStart = t('landing.hero.timeline.registration_start');
	const timelineEnd = t('landing.hero.timeline.registration_end');

	return (
		<div className='relative bg-gradient-to-b from-blue-50 to-white overflow-hidden min-h-[90vh] flex items-center'>
			{/* Hero Background Pattern */}
			<div className='absolute inset-0 z-0'>
				<div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10"></div>
			</div>

			{/* Hero Content */}
			<Container size='xl' className='pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 relative z-10'>
				<div className='flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12'>
					<div className='w-full md:w-1/2 space-y-4 sm:space-y-5 md:space-y-6 px-4 sm:px-6 md:px-0'>
						<Badge size='lg' radius='sm' color='blue' className='mb-2 sm:mb-4'>
							{t('common.year')}
						</Badge>
						<Title order={1} className='text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900'>
							{t('landing.hero.title')}
						</Title>
						<Text size='lg' className='text-gray-600 mt-2 sm:mt-4 sm:text-lg md:text-xl'>
							{t('landing.hero.description')}
						</Text>
						<Group mt='md' className='flex flex-col sm:flex-row gap-4 sm:mt-6'>
							<Button
								fullWidth
								size='lg'
								radius='md'
								className='bg-blue-700 hover:bg-blue-800'
								rightSection={<IconArrowRight size={18} />}
								onClick={() => router.push(`/${lang}/auth/login`)}>
								{t('landing.hero.login_button')}
							</Button>
							<Button
								fullWidth
								size='lg'
								variant='outline'
								radius='md'
								className='border-blue-600 text-blue-600 hover:bg-blue-50'
								onClick={() => router.push(`/${lang}/auth/register`)}>
								{t('landing.hero.register_button')}
							</Button>
						</Group>
					</div>
					<div className='w-full md:w-1/2 mt-8 md:mt-0 px-4 sm:px-6 md:px-0'>
						<div 
							className='relative w-full max-w-md mx-auto aspect-[1/1] rounded-lg shadow-lg'
							style={{ 
								backgroundImage: 'url(/images/student-hero.webp)',
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat',
								backgroundPosition: 'center',
							}}    
						>
							<div className='absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white rounded-lg shadow-lg p-3 sm:p-4 z-10'>
								<div className='flex items-center gap-2 sm:gap-3'>
									<div className='p-1.5 sm:p-2 bg-blue-100 rounded-full'>
										<IconCalendar size={20} className='text-blue-600 sm:text-[24px]' />
									</div>
									<div>
										<Text size='xs' fw={500}>
											{t('landing.hero.timeline_title')}
										</Text>
										<Text size='sm' fw={700}>
											{t('landing.hero.timeline.registration', {
												start: timelineStart,
												end: timelineEnd
											})}
										</Text>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};

export const Features = () => {
	const t = useTranslations();

	const features = [
		{
			icon: <IconFileUpload size={36} className='text-blue-600' />,
			title: t('landing.features.online_registration.title'),
			description: t('landing.features.online_registration.description'),
		},
		{
			icon: <IconUserCheck size={36} className='text-green-600' />,
			title: t('landing.features.auto_verification.title'),
			description: t('landing.features.auto_verification.description'),
		},
		{
			icon: <IconCalendar size={36} className='text-orange-600' />,
			title: t('landing.features.clear_schedule.title'),
			description: t('landing.features.clear_schedule.description'),
		},
	];

	return (
		<div className='py-20 bg-white sm:h-[800px] flex items-center justify-center'>
			<Container size='xl'>
				<div className='text-center max-w-3xl mx-auto mb-16'>
					<Badge size='lg' radius='sm' color='blue' className='mb-4'>
						{t('landing.sections.features.badge')}
					</Badge>
					<Title order={2} className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
						{t('landing.features.title')}
					</Title>
					<Text size='lg' className='text-gray-600'>
						{t('landing.features.description')}
					</Text>
				</div>

				<div className='grid md:grid-cols-3 gap-8'>
					{features.map((feature, index) => (
						<Card
							key={index}
							shadow='sm'
							padding='xl'
							radius='md'
							className='border border-gray-100 hover:shadow-md transition duration-300'>
							<div className='p-3 bg-gray-50 inline-flex rounded-full mb-6'>{feature.icon}</div>
							<Text size='xl' fw={600} className='mb-3'>
								{feature.title}
							</Text>
							<Text className='text-gray-600'>{feature.description}</Text>
						</Card>
					))}
				</div>
			</Container>
		</div>
	);
};

export const HowItWorks = () => {
	const t = useTranslations();

	const steps = [
		{
			number: '01',
			title: t('landing.how_it_works.steps.register.title'),
			description: t('landing.how_it_works.steps.register.description'),
		},
		{
			number: '02',
			title: t('landing.how_it_works.steps.fill_form.title'),
			description: t('landing.how_it_works.steps.fill_form.description'),
		},
		{
			number: '03',
			title: t('landing.how_it_works.steps.upload.title'),
			description: t('landing.how_it_works.steps.upload.description'),
		},
		{
			number: '04',
			title: t('landing.how_it_works.steps.check_status.title'),
			description: t('landing.how_it_works.steps.check_status.description'),
		},
		{
			number: '05',
			title: t('landing.how_it_works.steps.submit.title'),
			description: t('landing.how_it_works.steps.submit.description'),
		},
		{
			number: '06',
			title: t('landing.how_it_works.steps.result.title'),
			description: t('landing.how_it_works.steps.result.description'),
		},
	];

	return (
		<div className='py-20 bg-gray-50 sm:h-[900px] flex items-center'>
			<Container size='xl'>
				<div className='text-center max-w-3xl mx-auto mb-16'>
					<Badge size='lg' radius='sm' color='blue' className='mb-4'>
						{t('landing.sections.how_it_works.badge')}
					</Badge>
					<Title order={2} className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
						{t('landing.how_it_works.title')}
					</Title>
					<Text size='lg' className='text-gray-600'>
						{t('landing.how_it_works.description')}
					</Text>
				</div>

				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 md:px-0'>
					{steps.map((step, index) => (
						<div key={index} className='p-6 bg-white rounded-lg border border-gray-200 relative'>
							<div className='absolute -top-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold'>
								{step.number}
							</div>
							<div className='pt-4'>
								<Text size='xl' fw={700} className='mb-2'>
									{step.title}
								</Text>
								<Text className='text-gray-600'>{step.description}</Text>
							</div>
						</div>
					))}
				</div>
			</Container>
		</div>
	);
};

export const UserTypes = () => {
	const t = useTranslations();

	return (
		<div className='py-20 bg-white sm:h-[800px] flex items-center justify-center'>
			<Container size='xl'>
				<div className='text-center max-w-3xl mx-auto mb-16'>
					<Badge size='lg' radius='sm' color='blue' className='mb-4'>
						{t('landing.sections.user_types.badge')}
					</Badge>
					<Title order={2} className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
						{t('landing.sections.user_types.title')}
					</Title>
					<Text size='lg' className='text-gray-600'>
						{t('landing.sections.user_types.description')}
					</Text>
				</div>

				<div className='grid md:grid-cols-2 gap-12'>
					<Card shadow='sm' radius='lg' className='overflow-hidden border border-gray-200'>
						<div className='p-6 bg-blue-50 flex items-center gap-4'>
							<div className='p-3 bg-blue-100 rounded-full'>
								<IconUsers size={36} className='text-blue-600' />
							</div>
							<Title order={3} className='text-xl font-bold'>
								{t('landing.user_types.parent.title')}
							</Title>
						</div>
						<Divider />
						<div className='p-6'>
							<ul className='space-y-4'>
								<li className='flex gap-3'>
									<div className='p-1 bg-blue-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-blue-600' />
									</div>
									<Text>{t('landing.user_types.parent.features.fill_form')}</Text>
								</li>
								<li className='flex gap-3'>
									<div className='p-1 bg-blue-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-blue-600' />
									</div>
									<Text>{t('landing.user_types.parent.features.upload_docs')}</Text>
								</li>
								<li className='flex gap-3'>
									<div className='p-1 bg-blue-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-blue-600' />
									</div>
									<Text>{t('landing.user_types.parent.features.check_status')}</Text>
								</li>
								<li className='flex gap-3'>
									<div className='p-1 bg-blue-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-blue-600' />
									</div>
									<Text>{t('landing.user_types.parent.features.notifications')}</Text>
								</li>
							</ul>
							<Button
								fullWidth
								size='md'
								radius='md'
								className='mt-6 bg-blue-600 hover:bg-blue-700'>
								{t('landing.sections.user_types.parent_login')}
							</Button>
						</div>
					</Card>

					<Card shadow='sm' radius='lg' className='overflow-hidden border border-gray-200'>
						<div className='p-6 bg-green-50 flex items-center gap-4'>
							<div className='p-3 bg-green-100 rounded-full'>
								<IconUserCheck size={36} className='text-green-600' />
							</div>
							<Title order={3} className='text-xl font-bold'>
								{t('landing.user_types.admin.title')}
							</Title>
						</div>
						<Divider />
						<div className='p-6'>
							<ul className='space-y-4'>
								<li className='flex gap-3'>
									<div className='p-1 bg-green-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-green-600' />
									</div>
									<Text>{t('landing.user_types.admin.features.schedule')}</Text>
								</li>
								<li className='flex gap-3'>
									<div className='p-1 bg-green-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-green-600' />
									</div>
									<Text>{t('landing.user_types.admin.features.manage_students')}</Text>
								</li>
								<li className='flex gap-3'>
									<div className='p-1 bg-green-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-green-600' />
									</div>
									<Text>{t('landing.user_types.admin.features.view_details')}</Text>
								</li>
								<li className='flex gap-3'>
									<div className='p-1 bg-green-100 rounded-full h-fit'>
										<IconArrowRight size={16} className='text-green-600' />
									</div>
									<Text>{t('landing.user_types.admin.features.confirm_results')}</Text>
								</li>
							</ul>
							<Button
								fullWidth
								size='md'
								radius='md'
								className='mt-6 bg-green-600 hover:bg-green-700'>
								{t('landing.sections.user_types.admin_login')}
							</Button>
						</div>
					</Card>
				</div>
			</Container>
		</div>
	);
};

export const FAQ = () => {
	const t = useTranslations();

	const faqItems = [
		{
			question: t('landing.faq.items.pdf_upload.question'),
			answer: t('landing.faq.items.pdf_upload.answer'),
		},
		{
			question: t('landing.faq.items.eligibility.question'),
			answer: t('landing.faq.items.eligibility.answer'),
		},
		{
			question: t('landing.faq.items.inaccurate_info.question'),
			answer: t('landing.faq.items.inaccurate_info.answer'),
		},
		{
			question: t('landing.faq.items.documents.question'),
			answer: t('landing.faq.items.documents.answer'),
		},
		{
			question: t('landing.faq.items.exam_info.question'),
			answer: t('landing.faq.items.exam_info.answer'),
		},
	];

	return (
		<div className='py-20 bg-gray-50 sm:h-[800px] flex items-center'>
			<Container size='xl'>
				<div className='text-center max-w-3xl mx-auto mb-16'>
					<Badge size='lg' radius='sm' color='blue' className='mb-4'>
						{t('landing.sections.faq.badge')}
					</Badge>
					<Title order={2} className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
						{t('landing.faq.title')}
					</Title>
					<Text size='lg' className='text-gray-600'>
						{t('landing.faq.description')}
					</Text>
				</div>

				<Card shadow='sm' radius='md' className='border border-gray-200'>
					<Accordion>
						{faqItems.map((item, index) => (
							<Accordion.Item key={index} value={`item-${index}`}>
								<Accordion.Control>
									<Text fw={600}>{item.question}</Text>
								</Accordion.Control>
								<Accordion.Panel>
									<Text className='text-gray-600'>{item.answer}</Text>
								</Accordion.Panel>
							</Accordion.Item>
						))}
					</Accordion>
				</Card>
			</Container>
		</div>
	);
};

export const CallToAction = () => { 
	const t = useTranslations();
	const lang = useLocale();
	const router = useRouter();

	return (
		<div className='py-20 sm:h-[600px] bg-blue-700 text-white flex items-center justify-center'>
			<Container size='xl'>
				<div className='text-center max-w-3xl mx-auto'>
					<Title order={2} className='text-3xl md:text-4xl font-bold mb-6'>
						{t('landing.sections.cta.title')}
					</Title>
					<Text size='lg' className='mb-8 text-blue-100'>
						{t('landing.sections.cta.description')}
					</Text>
					<Group justify='center' gap='md'>
						<Button
							size='lg'
							radius='md'
							className='bg-white text-blue-700 hover:bg-blue-50'
							onClick={() => router.push(`/${lang}/auth/register`)}>
							{t('landing.sections.cta.register')}
						</Button>
						<Button
							size='lg'
							variant='outline'
							radius='md'
							className='border-white text-white hover:bg-blue-600'
							onClick={() => router.push(`/${lang}/auth/login`)}>
							{t('landing.sections.cta.login')}
						</Button>
					</Group>
				</div>
			</Container>
		</div>
	);
};

export const Footer = () => {
	const t = useTranslations();

	return (
		<div className='py-12 bg-gray-900 text-gray-300'>
			<Container size='xl'>
				<div className='grid md:grid-cols-3 gap-8'>
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<Image src='/images/logo.png' alt={t('common.school_name')} width={40} height={40} />
							<Text size='xl' fw={700} className='text-white'>
								{t('common.school_name')}
							</Text>
						</div>
						<Text className='mb-4'>{t('landing.footer.description')}</Text>
						<Text>
							{t('common.copyright', { year: new Date().getFullYear() })}
						</Text>
					</div>

					<div>
						<Text size='lg' fw={600} className='text-white mb-4'>
							{t('landing.footer.quick_links.title')}
						</Text>
						<div className='space-y-2'>
							<Link href='/about' className='block text-gray-400 hover:text-white'>
								{t('landing.footer.quick_links.about')}
							</Link>
							<Link href='/guides' className='block text-gray-400 hover:text-white'>
								{t('landing.footer.quick_links.guides')}
							</Link>
							<Link href='/news' className='block text-gray-400 hover:text-white'>
								{t('landing.footer.quick_links.news')}
							</Link>
							<Link href='/contact' className='block text-gray-400 hover:text-white'>
								{t('landing.footer.quick_links.contact')}
							</Link>
						</div>
					</div>

					<div>
						<Text size='lg' fw={600} className='text-white mb-4'>
							{t('landing.footer.contact_info.title')}
						</Text>
						<div className='space-y-2'>
							<Text>{t('landing.footer.contact_info.address')}</Text>
							<Text>{t('landing.footer.contact_info.email')}</Text>
							<Text>{t('landing.footer.contact_info.phone')}</Text>
							<div className='flex gap-4 mt-4'>
								<Link href='#' className='text-gray-400 hover:text-white'>
									<svg
										className='w-5 h-5'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path
											fillRule='evenodd'
											d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
											clipRule='evenodd'></path>
									</svg>
								</Link>
								{/* <Link href='#' className='text-gray-400 hover:text-white'>
									<svg
										className='w-5 h-5'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'></path>
									</svg>
								</Link>
								<Link href='#' className='text-gray-400 hover:text-white'>
									<svg
										className='w-5 h-5'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path
											fillRule='evenodd'
											d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
											clipRule='evenodd'></path>
									</svg>
								</Link> */}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};

const LandingPage = () => {
	return (
		<div className='min-h-screen'>
			<LandingHero />
			<Features />
			<HowItWorks />
			<UserTypes />
			<FAQ />
			<CallToAction />
			<Footer />
		</div>
	);
};

export default LandingPage;

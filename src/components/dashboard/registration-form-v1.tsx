import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	TextInput,
	NumberInput,
	Select,
	Button,
	Group,
	Box,
	Paper,
	Title,
	Grid,
	Radio,
	Text,
	Stack,
	Container,
	Table,
	Modal,
	List,
	Alert,
	Space,
	NativeSelect,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import {
	selectedStudentAtom,
	updateStudentAtom,
	selectedStudentIndexAtom,
	parentInfoAtom,
	updateParentInfoAtom,
} from '@/stores/user';
import useToast from '@/hooks/client/use-toast-notification';
import { registrationSchema } from '@/schemas/registration/schema';
import { RegistrationFormData } from '@/schemas/registration/dto';
import { getLocalStorageItem, setLocalStorageItem, clearAllDraftData } from '@/utils/localstorage';
import { DraftFormData } from '@/types/storage';
import { STORAGE_KEYS } from '@/constants/storage';
import { set } from 'zod';

const competitionResults = [
	{
		competitionId: 'creativityContest',
		name: 'Cuộc thi sáng tạo khoa học kỹ thuật',
	},
	{
		competitionId: 'upuLetterContest',
		name: 'Cuộc thi viết thư UPU',
	},
	{
		competitionId: 'sportsCompetition',
		name: 'Cuộc thi thể thao',
	},
	{
		competitionId: 'englishOlympiad',
		name: 'Olympic tiếng Anh',
	},
] as const;

const levelOptions = [
	{ value: 'city', label: 'Cấp Thành phố', disabled: false },
	{ value: 'national', label: 'Cấp Quốc gia', disabled: false },
] as const;

const achievementOptions = {
	city: [
		{ value: 'none', label: 'Không có' },
		{ value: 'first', label: 'Nhất (0.75 điểm)' },
		{ value: 'second', label: 'Nhì (0.5 điểm)' },
		{ value: 'third', label: 'Ba (0.25 điểm)' },
	],
	national: [
		{ value: 'none', label: 'Không có' },
		{ value: 'first', label: 'Nhất (1.0 điểm)' },
		{ value: 'second', label: 'Nhì (0.75 điểm)' },
		{ value: 'third', label: 'Ba (0.5 điểm)' },
	],
} as const;

export default function RegistrationFormV1() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] =
		useDisclosure(false);
	const [formValues, setFormValues] = useState<RegistrationFormData | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);

	// User store atoms
	const [selectedStudent] = useAtom(selectedStudentAtom);
	const [selectedStudentIndex] = useAtom(selectedStudentIndexAtom);
	const [, updateStudent] = useAtom(updateStudentAtom);
	const [parentInfo] = useAtom(parentInfoAtom);
	const [, updateParentInfo] = useAtom(updateParentInfoAtom);

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		register,
		setValue,
		getFieldState,
		...form
	} = useForm<RegistrationFormData>({
		resolver: zodResolver(registrationSchema),
		defaultValues: {
			studentInfo: {
				gender: (selectedStudent?.gender as 'male' | 'female') || 'male',
				fullName: selectedStudent?.fullName || '',
				dateOfBirth: selectedStudent?.dateOfBirth || new Date(),
				placeOfBirth: selectedStudent?.placeOfBirth || '',
				educationDepartment: selectedStudent?.educationDepartment || '',
				primarySchool: selectedStudent?.primarySchool || '',
				grade: selectedStudent?.grade || '',
			},
			competitionResults: [],
			priorityPoint: {
				type: 'none',
				points: 0,
			},
		},
	});

	// toastify
	const { showErrorToast, showInfoToast, showSuccessToast } = useToast();

	// Watch for parent info to display validation message
	const fatherName = watch('parentInfo.fatherName');
	const fatherPhone = watch('parentInfo.fatherPhone');
	const motherName = watch('parentInfo.motherName');
	const motherPhone = watch('parentInfo.motherPhone');
	const guardianName = watch('parentInfo.guardianName');
	const guardianPhone = watch('parentInfo.guardianPhone');

	// Check if at least one parent/guardian info is provided
	const hasAtLeastOneContact =
		(!!fatherName && !!fatherPhone) ||
		(!!motherName && !!motherPhone) ||
		(!!guardianName && !!guardianPhone);

	// Load draft data on mount
	useEffect(() => {
		// Khởi tạo dữ liệu competitionResults với year đúng
		const currentYear = new Date().getFullYear();

		// Tạo từng phần tử riêng biệt với year được đặt chính xác
		const compResults = competitionResults
			.map((competition, compIndex) => {
				return levelOptions.map((level, levelIndex) => {
					const i = compIndex * levelOptions.length + levelIndex;
					return {
						competitionId: competition.competitionId,
						level: level.value,
						achievement: 'none',
						year: currentYear,
					};
				});
			})
			.flat() as RegistrationFormData['competitionResults'];

		const draftData = getLocalStorageItem<DraftFormData>(STORAGE_KEYS.REGISTRATION_FORM_DRAFT);
		if (draftData) {
			const currentValues = form.getValues();
			form.reset({
				...currentValues,
				studentInfo: {
					...currentValues.studentInfo,
					...(draftData.studentInfo || {}),
				},
				parentInfo: {
					...currentValues.parentInfo,
					...(draftData.parentInfo || {}),
				},
				residenceInfo: {
					...currentValues.residenceInfo,
					...(draftData.residenceInfo || {}),
				},
				commitment: draftData.commitment
					? {
							...currentValues.commitment,
							...draftData.commitment,
					  }
					: currentValues.commitment,
				competitionResults: draftData ? compResults : [],
			});

			const lastSaved = getLocalStorageItem<string>(STORAGE_KEYS.LAST_SAVED);
			if (lastSaved) {
				const lastSavedDate = new Date(lastSaved);
				showInfoToast(`Đã tải lại bản nháp (Lưu lúc: ${lastSavedDate.toLocaleString('vi-VN')})`);
			}
		}
	}, []);

	// Auto-save draft when form values change (debounced)
	useEffect(() => {
		const saveTimeout = 1000; // 1 second
		let timeoutId: NodeJS.Timeout;

		const subscription = watch(value => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				const currentValues = form.getValues();
				const draftData: DraftFormData = {
					studentInfo: {
						fullName: currentValues.studentInfo.fullName,
						dateOfBirth: currentValues.studentInfo.dateOfBirth,
						gender: currentValues.studentInfo.gender,
						educationDepartment: currentValues.studentInfo.educationDepartment,
						primarySchool: currentValues.studentInfo.primarySchool,
						grade: currentValues.studentInfo.grade,
						placeOfBirth: currentValues.studentInfo.placeOfBirth,
						ethnicity: currentValues.studentInfo.ethnicity,
					},
					parentInfo: {
						fatherName: currentValues.parentInfo.fatherName,
						fatherBirthYear: currentValues.parentInfo.fatherBirthYear,
						fatherPhone: currentValues.parentInfo.fatherPhone,
						fatherIdCard: currentValues.parentInfo.fatherIdCard,
						fatherOccupation: currentValues.parentInfo.fatherOccupation,
						fatherWorkplace: currentValues.parentInfo.fatherWorkplace,
						motherName: currentValues.parentInfo.motherName,
						motherBirthYear: currentValues.parentInfo.motherBirthYear,
						motherPhone: currentValues.parentInfo.motherPhone,
						motherIdCard: currentValues.parentInfo.motherIdCard,
						motherOccupation: currentValues.parentInfo.motherOccupation,
						motherWorkplace: currentValues.parentInfo.motherWorkplace,
						guardianName: currentValues.parentInfo.guardianName,
						guardianBirthYear: currentValues.parentInfo.guardianBirthYear,
						guardianPhone: currentValues.parentInfo.guardianPhone,
						guardianIdCard: currentValues.parentInfo.guardianIdCard,
						guardianOccupation: currentValues.parentInfo.guardianOccupation,
						guardianWorkplace: currentValues.parentInfo.guardianWorkplace,
						guardianRelationship: currentValues.parentInfo.guardianRelationship,
					},
					residenceInfo: {
						permanentAddress: currentValues.residenceInfo.permanentAddress,
						temporaryAddress: currentValues.residenceInfo.temporaryAddress,
						currentAddress: currentValues.residenceInfo.currentAddress,
					},
					commitment: currentValues.commitment
						? {
								relationship: currentValues.commitment.relationship,
								signatureDate: currentValues.commitment.signatureDate,
								guardianName: currentValues.commitment.guardianName,
								applicantName: currentValues.commitment.applicantName,
						  }
						: undefined,
					competitionResults: currentValues.competitionResults,
				};
				setLocalStorageItem(STORAGE_KEYS.REGISTRATION_FORM_DRAFT, draftData);
			}, saveTimeout);
		});

		return () => {
			subscription.unsubscribe();
			clearTimeout(timeoutId);
		};
	}, [watch]);

	const onSubmit = async (data: RegistrationFormData) => {
		// Store form values to display in confirmation modal
		setFormValues(data);
		console.log('Form values:', data);

		// Open the confirmation modal
		openConfirmModal();
	};

	const onInvalid = (errors: any) => {
		console.error('Form validation errors:', errors);
		showErrorToast('Vui lòng kiểm tra lại thông tin đã nhập!');
	};

	const handleConfirmSubmission = async () => {
		if (!formValues) return;

		try {
			setIsSubmitting(true);

			console.log('Submitting form data:', formValues);

			// Update student info in the store
			updateStudent({
				index: selectedStudentIndex,
				updates: {
					fullName: formValues.studentInfo.fullName,
					dateOfBirth: formValues.studentInfo.dateOfBirth,
					gender: formValues.studentInfo.gender,
					educationDepartment: formValues.studentInfo.educationDepartment,
					primarySchool: formValues.studentInfo.primarySchool,
					grade: formValues.studentInfo.grade,
					placeOfBirth: formValues.studentInfo.placeOfBirth,
					ethnicity: formValues.studentInfo.ethnicity,
					permanentAddress: formValues.residenceInfo.permanentAddress,
					temporaryAddress: formValues.residenceInfo.temporaryAddress || null,
					currentAddress: formValues.residenceInfo.currentAddress,
				},
			});

			// Update parent info in the store
			updateParentInfo({
				fatherName: formValues.parentInfo.fatherName,
				fatherPhone: formValues.parentInfo.fatherPhone,
				motherName: formValues.parentInfo.motherName,
				motherPhone: formValues.parentInfo.motherPhone,
				guardianName: formValues.parentInfo.guardianName,
				guardianPhone: formValues.parentInfo.guardianPhone,
				guardianRelationship: formValues.parentInfo.guardianRelationship,
			});

			// Clear draft data after successful submission
			// clearAllDraftData();

			// Close the modal
			closeConfirmModal();
			showSuccessToast('Đăng ký thành công!');
		} catch (error) {
			console.error('Error submitting form:', error);
			showErrorToast('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Helper function to render field error
	const getErrorMessage = (path: string) => {
		const pathParts = path.split('.');
		let error: any = errors;
		for (const part of pathParts) {
			if (!error[part]) return null;
			error = error[part];
		}
		return error.message;
	};

	// Helper function to create bonus point options
	const createBonusPointOptions = (level: string) => [
		{ value: 'none', label: 'Không có' },
		{ value: 'first', label: level === 'city' ? 'Nhất (0.75 điểm)' : 'Nhất (1.0 điểm)' },
		{ value: 'second', label: level === 'city' ? 'Nhì (0.5 điểm)' : 'Nhì (0.75 điểm)' },
		{ value: 'third', label: level === 'city' ? 'Ba (0.25 điểm)' : 'Ba (0.5 điểm)' },
	];

	const updateCompetitionResults = (
		competitionId: string,
		level: 'city' | 'national',
		achievement: 'none' | 'first' | 'second' | 'third',
		index: number,
	) => {
		setValue(`competitionResults.${index}.competitionId`, competitionId);
		setValue(`competitionResults.${index}.level`, level);
		setValue(`competitionResults.${index}.achievement`, achievement);
	};

	// Format address for display in confirmation modal
	const formatAddress = (address: string) => {
		return address || 'Không có';
	};

	return (
		<Container size='xl' p={0} pb='xl' mt='xl'>
			<Paper p='0' className='bg-zinc-50'>
				<form onSubmit={handleSubmit(onSubmit, onInvalid)}>
					<Title order={2} mb='md' ta='center'>
						PHIẾU ĐĂNG KÝ DỰ TUYỂN VÀO LỚP 6
					</Title>
					<Title order={4} mb='md' ta='center'>
						TRƯỜNG THCS LÊ LỢI NĂM HỌC 2025–2026
					</Title>
					<Space h='md' />
					{/* A. THÔNG TIN HỌC SINH */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							A. THÔNG TIN HỌC SINH
						</Title>
						<Grid pl='md'>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='studentInfo.educationDepartment'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Phòng GDĐT'
											placeholder='Nhập tên phòng giáo dục và đào tạo'
											error={getErrorMessage('studentInfo.educationDepartment')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='studentInfo.primarySchool'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Trường tiểu học'
											placeholder='Nhập tên trường tiểu học'
											error={getErrorMessage('studentInfo.primarySchool')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='studentInfo.grade'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Lớp'
											placeholder='Ví dụ: 5A'
											error={getErrorMessage('studentInfo.grade')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='studentInfo.gender'
									control={control}
									render={({ field }) => (
										<Radio.Group
											label='Giới tính'
											error={getErrorMessage('studentInfo.gender')}
											required
											{...field}>
											<Group mt='xs'>
												<Radio value='male' label='Nam' />
												<Radio value='female' label='Nữ' />
											</Group>
										</Radio.Group>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Controller
									name='studentInfo.fullName'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Họ và tên học sinh'
											placeholder='VIẾT IN HOA'
											error={getErrorMessage('studentInfo.fullName')}
											required
											styles={{ input: { textTransform: 'uppercase' } }}
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<Controller
									name='studentInfo.dateOfBirth'
									control={control}
									render={({ field }) => (
										<DatePickerInput
											label='Ngày, tháng, năm sinh'
											placeholder='DD/MM/YYYY'
											error={getErrorMessage('studentInfo.dateOfBirth')}
											required
											valueFormat='DD/MM/YYYY'
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<Controller
									name='studentInfo.placeOfBirth'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Nơi sinh'
											placeholder='Tỉnh/Thành phố'
											error={getErrorMessage('studentInfo.placeOfBirth')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<Controller
									name='studentInfo.ethnicity'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Dân tộc'
											placeholder='Ví dụ: Kinh'
											error={getErrorMessage('studentInfo.ethnicity')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
						</Grid>
					</Paper>

					{/* B. THÔNG TIN HỘ KHẨU, CƯ TRÚ */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							B. THÔNG TIN HỘ KHẨU, CƯ TRÚ
						</Title>
						<Grid pl='md'>
							<Grid.Col span={12}>
								<Controller
									name='residenceInfo.permanentAddress'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Nơi thường trú'
											placeholder='Ghi rõ địa chỉ đầy đủ'
											error={getErrorMessage('residenceInfo.permanentAddress')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Controller
									name='residenceInfo.temporaryAddress'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Nơi tạm trú'
											placeholder='Ghi rõ địa chỉ đầy đủ (nếu có)'
											error={getErrorMessage('residenceInfo.temporaryAddress')}
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Controller
									name='residenceInfo.currentAddress'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Nơi ở hiện tại'
											placeholder='Ghi rõ địa chỉ đầy đủ'
											error={getErrorMessage('residenceInfo.currentAddress')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
						</Grid>
					</Paper>

					{/* C. THÔNG TIN PHỤ HUYNH */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							C. THÔNG TIN PHỤ HUYNH
						</Title>

						{!hasAtLeastOneContact && (
							<Alert
								icon={<IconAlertCircle size={16} />}
								title='Lưu ý quan trọng'
								color='blue'
								mb='md'>
								Vui lòng cung cấp thông tin của ít nhất một trong ba: Cha, Mẹ hoặc Người giám hộ
								(bao gồm họ tên và số điện thoại)
							</Alert>
						)}

						{/* Father */}
						<Box mb='md'>
							<Title order={5} mb='sm'>
								1. Cha
							</Title>
							<Grid pl='md'>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherName'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Họ tên cha'
												placeholder='Họ và tên của cha'
												error={getErrorMessage('parentInfo.fatherName')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherBirthYear'
										control={control}
										render={({ field }) => (
											<NumberInput
												label='Năm sinh'
												placeholder='Ví dụ: 1980'
												error={getErrorMessage('parentInfo.fatherBirthYear')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherPhone'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Số điện thoại'
												placeholder='Số điện thoại liên hệ'
												error={getErrorMessage('parentInfo.fatherPhone')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherIdCard'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Số CCCD'
												placeholder='Số căn cước công dân'
												error={getErrorMessage('parentInfo.fatherIdCard')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherOccupation'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Nghề nghiệp'
												placeholder='Nghề nghiệp hiện tại'
												error={getErrorMessage('parentInfo.fatherOccupation')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherWorkplace'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Nơi công tác'
												placeholder='Nơi làm việc hiện tại'
												error={getErrorMessage('parentInfo.fatherWorkplace')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
							</Grid>
						</Box>

						{/* Mother */}
						<Box mb='md'>
							<Title order={5} mb='sm'>
								2. Mẹ
							</Title>
							<Grid pl='md'>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherName'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Họ tên mẹ'
												placeholder='Họ và tên của mẹ'
												error={getErrorMessage('parentInfo.motherName')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherBirthYear'
										control={control}
										render={({ field }) => (
											<NumberInput
												label='Năm sinh'
												placeholder='Ví dụ: 1985'
												error={getErrorMessage('parentInfo.motherBirthYear')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherPhone'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Số điện thoại'
												placeholder='Số điện thoại liên hệ'
												error={getErrorMessage('parentInfo.motherPhone')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherIdCard'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Số CCCD'
												placeholder='Số căn cước công dân'
												error={getErrorMessage('parentInfo.motherIdCard')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherOccupation'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Nghề nghiệp'
												placeholder='Nghề nghiệp hiện tại'
												error={getErrorMessage('parentInfo.motherOccupation')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherWorkplace'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Nơi công tác'
												placeholder='Nơi làm việc hiện tại'
												error={getErrorMessage('parentInfo.motherWorkplace')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
							</Grid>
						</Box>

						{/* Guardian */}
						<Box>
							<Title order={5} mb='sm'>
								3. Người giám hộ (nếu có)
							</Title>
							<Grid pl='md'>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianName'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Họ tên người giám hộ'
												placeholder='Họ và tên người giám hộ'
												error={getErrorMessage('parentInfo.guardianName')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianBirthYear'
										control={control}
										render={({ field }) => (
											<NumberInput
												label='Năm sinh'
												placeholder='Ví dụ: 1970'
												error={getErrorMessage('parentInfo.guardianBirthYear')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianPhone'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Số điện thoại'
												placeholder='Số điện thoại liên hệ'
												error={getErrorMessage('parentInfo.guardianPhone')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianIdCard'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Số CCCD'
												placeholder='Số căn cước công dân'
												error={getErrorMessage('parentInfo.guardianIdCard')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianOccupation'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Nghề nghiệp'
												placeholder='Nghề nghiệp hiện tại'
												error={getErrorMessage('parentInfo.guardianOccupation')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianWorkplace'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Nơi công tác'
												placeholder='Nơi làm việc hiện tại'
												error={getErrorMessage('parentInfo.guardianWorkplace')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={12}>
									<Controller
										name='parentInfo.guardianRelationship'
										control={control}
										render={({ field }) => (
											<TextInput
												label='Quan hệ với học sinh'
												placeholder='Ví dụ: Ông, Bà, Cô, Chú,...'
												error={getErrorMessage('parentInfo.guardianRelationship')}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
							</Grid>
						</Box>

						{
							// @ts-ignore
							errors.parentInfo && errors.parentInfo._errors && (
								<Alert icon={<IconAlertCircle size={16} />} color='red' mt='md'>
									{
										// @ts-ignore
										errors.parentInfo._errors.join(', ')
									}
								</Alert>
							)
						}
					</Paper>

					{/* D. ĐIỂM KHUYẾN KHÍCH */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							D. ĐIỂM KHUYẾN KHÍCH (nếu có)
						</Title>
						<Text size='sm' mb='md' c='dimmed'>
							Chỉ cộng điểm cao nhất nếu có nhiều thành tích
						</Text>

						<Box className='overflow-x-auto'>
							<Table striped withTableBorder mb='md'>
								<Table.Thead>
									<Table.Tr>
										<Table.Th miw={200}>Tên cuộc thi</Table.Th>
										{/* <Table.Th>Cấp Thành phố</Table.Th>
										<Table.Th>Cấp Quốc gia</Table.Th> */}
										{levelOptions.map(level => (
											<Table.Th key={level.value} className='text-center'>
												{level.label}
											</Table.Th>
										))}
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{competitionResults.map((competition, index) => (
										<Table.Tr key={competition.competitionId}>
											<Table.Td>
												{index + 1}, {competition.name}
											</Table.Td>
											{levelOptions.map((level, levelIndex) => (
												<Table.Td key={level.value} className='text-center'>
													{/* <Controller
														name={`competitionResults.${index * levelOptions.length + levelIndex}.level`}
														control={control}
														render={({ field }) => (
															<NativeSelect
																defaultValue={form.getValues(`competitionResults.${index * levelOptions.length + levelIndex}.achievement`) || 'none'}
																data={achievementOptions[level.value]}
																onChange={event => {
																	const selectedValue = event.currentTarget.value as 'none' | 'first' | 'second' | 'third';
																	updateCompetitionResults(
																		competition.competitionId,
																		level.value,
																		selectedValue,
																		index * levelOptions.length + levelIndex,
																	);
																}}
																disabled={level.disabled}
																styles={{ input: { minWidth: '140px' } }}
															/>
														)}
													/> */}
													<NativeSelect
														defaultValue={
															form.getValues(
																`competitionResults.${
																	index * levelOptions.length + levelIndex
																}.achievement`,
															) || 'none'
														}
														data={achievementOptions[level.value]}
														onChange={event => {
															const selectedValue = event.currentTarget.value as
																| 'none'
																| 'first'
																| 'second'
																| 'third';
															updateCompetitionResults(
																competition.competitionId,
																level.value,
																selectedValue,
																index * levelOptions.length + levelIndex,
															);
														}}
														disabled={level.disabled}
														styles={{ input: { minWidth: '140px' } }}
													/>
												</Table.Td>
											))}
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Box>

						<Text size='sm' c='dimmed' mb='xs'>
							Mức điểm khuyến khích:
						</Text>
						<Text size='sm' c='dimmed'>
							- <strong>Thành phố</strong>: Nhất (0.75), Nhì (0.5), Ba (0.25)
						</Text>
						<Text size='sm' c='dimmed'>
							- <strong>Quốc gia</strong>: Nhất (1.0), Nhì (0.75), Ba (0.5)
						</Text>
					</Paper>

					{/* E. ĐIỂM ƯU TIÊN */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							E. ĐIỂM ƯU TIÊN (nếu có)
						</Title>
						<Controller
							name='priorityPoint.type'
							control={control}
							render={({ field }) => (
								<Radio.Group {...field} pl='md'>
									<Stack>
										<Radio value='none' label='Không có điểm ưu tiên' />
										<Radio
											value='type1'
											label='Loại 1 (2.0 điểm): Con liệt sĩ, thương binh mất sức ≥81%,...'
										/>
										<Radio
											value='type2'
											label='Loại 2 (1.5 điểm): Con anh hùng LLVT, con Bà mẹ VN anh hùng, thương binh mất sức <81%,...'
										/>
										<Radio
											value='type3'
											label='Loại 3 (1.0 điểm): Học sinh hoặc cha/mẹ là người dân tộc thiểu số; vùng khó khăn theo QĐ 861/QĐ-TTg hoặc 497/QĐ-UBDT'
										/>
									</Stack>
								</Radio.Group>
							)}
						/>
					</Paper>

					{/* F. CAM KẾT & KÝ TÊN */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							F. CAM KẾT & KÝ TÊN
						</Title>
						<Grid pl='md'>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='commitment.relationship'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Quan hệ với học sinh'
											placeholder='Ví dụ: Cha/Mẹ/Người giám hộ'
											error={getErrorMessage('commitment.relationship')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='commitment.signatureDate'
									control={control}
									render={({ field }) => (
										<DatePickerInput
											label='Ngày tháng năm kê khai'
											placeholder='DD/MM/YYYY'
											error={getErrorMessage('commitment.signatureDate')}
											required
											valueFormat='DD/MM/YYYY'
											locale='vi'
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='commitment.guardianName'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Chữ ký Cha/Mẹ/Người giám hộ'
											placeholder='Ghi rõ họ tên'
											error={getErrorMessage('commitment.guardianName')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='commitment.applicantName'
									control={control}
									render={({ field }) => (
										<TextInput
											label='Chữ ký người viết phiếu đăng ký'
											placeholder='Ghi rõ họ tên'
											error={getErrorMessage('commitment.applicantName')}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
						</Grid>
					</Paper>

					{/* G. THÔNG TIN HỒ SƠ */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							G. THÔNG TIN HỒ SƠ (PHẦN BỔ SUNG)
						</Title>
						<Grid pl='md'>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.fileId'
									control={control}
									render={({ field }) => (
										<TextInput label='Mã hồ sơ' placeholder='LL...' {...field} />
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.studentCode'
									control={control}
									render={({ field }) => <TextInput label='Mã học sinh theo CSDL BGD' {...field} />}
								/>
							</Grid.Col>
							{/* <Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.password'
									control={control}
									render={({ field }) => <TextInput label='Mật khẩu' type='password' {...field} />}
								/>
							</Grid.Col> */}
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.identificationNumber'
									control={control}
									render={({ field }) => <TextInput label='Số định danh học sinh' {...field} />}
								/>
							</Grid.Col>
						</Grid>
					</Paper>

					<Group justify='start' mt='xl'>
						<Button type='submit' size='lg' loading={isSubmitting}>
							Nộp phiếu đăng ký
						</Button>
					</Group>
				</form>
			</Paper>

			{/* Confirmation Modal */}
			<Modal
				opened={confirmModalOpened}
				onClose={closeConfirmModal}
				title='Xác nhận nộp phiếu đăng ký'
				size='lg'
				centered>
				{formValues && (
					<>
						<Text mb='md'>Vui lòng xác nhận thông tin trước khi nộp phiếu đăng ký:</Text>

						<Paper withBorder className='p-4 sm:p-10' radius='md' mb='md'>
							<Title order={5} mb='xs'>
								Thông tin học sinh
							</Title>
							<List size='sm' spacing='xs'>
								<List.Item>
									<Text fw={500} span>
										Họ tên:
									</Text>{' '}
									{formValues.studentInfo.fullName}
								</List.Item>
								<List.Item>
									<Text fw={500} span>
										Giới tính:
									</Text>{' '}
									{formValues.studentInfo.gender === 'male' ? 'Nam' : 'Nữ'}
								</List.Item>
								<List.Item>
									<Text fw={500} span>
										Ngày sinh:
									</Text>{' '}
									{formValues.studentInfo.dateOfBirth.toLocaleDateString('vi-VN')}
								</List.Item>
								<List.Item>
									<Text fw={500} span>
										Nơi sinh:
									</Text>{' '}
									{formValues.studentInfo.placeOfBirth}
								</List.Item>
								<List.Item>
									<Text fw={500} span>
										Dân tộc:
									</Text>{' '}
									{formValues.studentInfo.ethnicity}
								</List.Item>
								<List.Item>
									<Text fw={500} span>
										Trường tiểu học:
									</Text>{' '}
									{formValues.studentInfo.primarySchool}
								</List.Item>
							</List>
						</Paper>

						<Paper withBorder className='p-4 sm:p-10' radius='md' mb='md'>
							<Title order={5} mb='xs'>
								Thông tin cư trú
							</Title>
							<List size='sm' spacing='xs'>
								<List.Item>
									<Text fw={500} span>
										Nơi thường trú:
									</Text>{' '}
									{formatAddress(formValues.residenceInfo.permanentAddress)}
								</List.Item>
								<List.Item>
									<Text fw={500} span>
										Nơi tạm trú:
									</Text>{' '}
									{formatAddress(formValues.residenceInfo.temporaryAddress || '')}
								</List.Item>
								<List.Item>
									<Text fw={500} span>
										Nơi ở hiện tại:
									</Text>{' '}
									{formatAddress(formValues.residenceInfo.currentAddress)}
								</List.Item>
							</List>
						</Paper>

						<Paper withBorder className='p-4 sm:p-10' radius='md' mb='md'>
							<Title order={5} mb='xs'>
								Thông tin liên hệ
							</Title>
							<Grid>
								<Grid.Col span={{ base: 12, md: formValues.parentInfo.guardianName ? 4 : 6 }}>
									<Text size='sm' fw={500}>
										Thông tin cha
									</Text>
									{formValues.parentInfo.fatherName ? (
										<List size='sm' spacing='xs'>
											<List.Item>
												<Text fw={500} span>
													Họ tên:
												</Text>{' '}
												{formValues.parentInfo.fatherName}
											</List.Item>
											<List.Item>
												<Text fw={500} span>
													SĐT:
												</Text>{' '}
												{formValues.parentInfo.fatherPhone || 'Không có'}
											</List.Item>
										</List>
									) : (
										<Text size='sm' c='dimmed'>
											Không có thông tin
										</Text>
									)}
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: formValues.parentInfo.guardianName ? 4 : 6 }}>
									<Text size='sm' fw={500}>
										Thông tin mẹ
									</Text>
									{formValues.parentInfo.motherName ? (
										<List size='sm' spacing='xs'>
											<List.Item>
												<Text fw={500} span>
													Họ tên:
												</Text>{' '}
												{formValues.parentInfo.motherName}
											</List.Item>
											<List.Item>
												<Text fw={500} span>
													SĐT:
												</Text>{' '}
												{formValues.parentInfo.motherPhone || 'Không có'}
											</List.Item>
										</List>
									) : (
										<Text size='sm' c='dimmed'>
											Không có thông tin
										</Text>
									)}
								</Grid.Col>
								{formValues.parentInfo.guardianName && (
									<Grid.Col span={{ base: 12, md: 4 }}>
										<Text size='sm' fw={500}>
											Người giám hộ
										</Text>
										<List size='sm' spacing='xs'>
											<List.Item>
												<Text fw={500} span>
													Họ tên:
												</Text>{' '}
												{formValues.parentInfo.guardianName}
											</List.Item>
											<List.Item>
												<Text fw={500} span>
													SĐT:
												</Text>{' '}
												{formValues.parentInfo.guardianPhone || 'Không có'}
											</List.Item>
											{formValues.parentInfo.guardianRelationship && (
												<List.Item>
													<Text fw={500} span>
														Quan hệ:
													</Text>{' '}
													{formValues.parentInfo.guardianRelationship}
												</List.Item>
											)}
										</List>
									</Grid.Col>
								)}
							</Grid>
						</Paper>

						<Group justify='end' mt='xl'>
							<Button variant='outline' onClick={closeConfirmModal}>
								Hủy
							</Button>
							<Button onClick={handleConfirmSubmission} loading={isSubmitting} color='blue'>
								Xác nhận và nộp phiếu
							</Button>
						</Group>
					</>
				)}
			</Modal>
		</Container>
	);
}

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { get } from 'lodash';
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
import { useRegistration } from '@/providers/registration-provider';
import DocumentUpload from './document-upload';
import FeedbackCard from '../feedback/feedback-card';

type AcademicSubjectId = 'math' | 'vietnamese' | 'english' | 'science' | 'history';
type StudentClassification = 'HTXS' | 'CTTVT' | 'CTTT' | '';

const academicSubjectsConfig: Array<{
	subjectId: AcademicSubjectId;
	name: string;
	disabledGrades: number[];
}> = [
	{ subjectId: 'math', name: 'Môn Toán', disabledGrades: [] },
	{ subjectId: 'vietnamese', name: 'Môn Tiếng Việt', disabledGrades: [] },
	{ subjectId: 'english', name: 'Môn Tiếng Anh', disabledGrades: [1, 2] },
	{ subjectId: 'science', name: 'Môn Khoa học', disabledGrades: [1, 2, 3] },
	{ subjectId: 'history', name: 'Lịch sử và Địa lý', disabledGrades: [1, 2, 3] },
];

const competitionResults = [
	{
		competitionId: 'creativityContest',
		name: 'Cuộc thi sáng tạo khoa học kỹ thuật',
		disabledLevel: ['city'],
	},
	{
		competitionId: 'upuLetterContest',
		name: 'Cuộc thi viết thư UPU',
		disabledLevel: ['city'],
	},
	{
		competitionId: 'sportsCompetition',
		name: 'Cuộc thi thể thao',
		disabledLevel: ['city'],
	},
	{
		competitionId: 'englishOlympiad',
		name: 'Olympic tiếng Anh',
		disabledLevel: [''],
	},
];

const levelOptions = [
	{ value: 'city', label: 'Cấp Thành phố', disabled: true },
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

const priorityPointsConfig = [
	{
		value: 'none',
		label: 'Không có điểm ưu tiên',
		points: 0,
	},
	{
		value: 'type1',
		label: '2.0 điểm',
		description:
			'Con liệt sĩ; con thương binh, bệnh binh mất sức lao động 81% trở lên; con của người được cấp "Giấy chứng nhận người hưởng chính sách như thương binh mà người được cấp Giấy chứng nhận người hưởng chính sách như thương binh bị suy giảm khả năng lao động 81% trở lên"; con của người hoạt động kháng chiến bị nhiễm chất độc hóa học.',
		points: 2.0,
	},
	{
		value: 'type2',
		label: '1.5 điểm',
		description:
			'Con của Anh hùng lực lượng vũ trang, con của Anh hùng lao động, con của Bà mẹ Việt Nam anh hùng; con thương binh, bệnh binh mất sức lao động dưới 81%; con của người được cấp "Giấy chứng nhận người hưởng chính sách như thương binh mà người được cấp Giấy chứng nhận người hưởng chính sách như thương binh bị suy giảm khả năng lao động dưới 81%".',
		points: 1.5,
	},
	{
		value: 'type3',
		label: '1.0 điểm',
		description:
			'Người có cha hoặc mẹ là người dân tộc thiểu số; người dân tộc thiểu số; học sinh ở vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn (được quy định tại Quyết định 861/QĐ-TTg ngày 04/06/2021 của Thủ tướng Chính phủ và Quyết định số 497/QĐ-UBDT ngày 30/7/2024 của Bộ trưởng, Chủ nhiệm Ủy ban Dân tộc về việc phê duyệt điều chỉnh, bổ sung và hiệu chỉnh tên huyện, xã, thôn đặc biệt khó khăn; thôn thuộc vùng dân tộc thiểu số và miền núi giai đoạn 2021-2025).',
		points: 1.0,
	},
];

// Helper function to determine student classification based on their grades
const determineStudentClassification = (
	gradeData: any,
	gradeNumber: number,
	competitionResults?: any[],
): StudentClassification => {
	if (!gradeData) return '';

	// Get the scores for this grade
	const scores = {
		math: gradeData.math,
		vietnamese: gradeData.vietnamese,
		english: gradeData.english,
		science: gradeData.science,
		history: gradeData.history,
	};

	// Case 1: All existing subjects have scores 9-10
	let allScoresExcellent = true;
	let allScoresPresent = true;

	for (const subject of academicSubjectsConfig) {
		// Skip subjects that are disabled for this grade
		if (subject.disabledGrades.includes(gradeNumber)) continue;

		const score = scores[subject.subjectId];

		// If any score is missing
		if (score === undefined || score === null) {
			allScoresPresent = false;
			break;
		}

		// If any score is less than 9
		if (score < 9) {
			allScoresExcellent = false;
			break;
		}
	}

	// For Case 1: All subjects must have excellent scores
	if (allScoresPresent && allScoresExcellent) {
		// Check if all scores are 9+ (for HTXS)
		const allNineOrAbove = Object.values(scores).every(
			score => score === undefined || score === null || score >= 9,
		);

		if (allNineOrAbove) {
			return 'HTXS'; // Hoàn Thành xuất sắc
		}
	}

	// Case 2: Special subjects have perfect scores
	if (gradeNumber >= 3 && gradeNumber <= 5) {
		// For grades 3-5, check if Math and Vietnamese are 10
		const mathPerfect = scores.math === 10;
		const vietnamesePerfect = scores.vietnamese === 10;

		// English must be 9+
		const englishExcellent =
			scores.english === undefined || scores.english === null || scores.english >= 9;

		if (mathPerfect && vietnamesePerfect && englishExcellent) {
			return 'CTTVT'; // Có thành tích vượt trội
		}
	}

	// // Case 3: Check for special achievements in competitions
	// if (competitionResults && competitionResults.length > 0) {
	// 	// Check for any national level achievements
	// 	const hasSignificantAchievement = competitionResults.some(
	// 		result => result.achievement !== 'none' &&
	// 				  (result.level === 'national' ||
	// 				   (result.level === 'city' && result.achievement === 'first'))
	// 	);

	// 	if (hasSignificantAchievement) {
	// 		return 'CTTT'; // Có thành tích thi đấu
	// 	}
	// }

	// No special classification
	return '';
};

export default function RegistrationFormV1() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isReady, setIsReady] = useState(false);
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

	const { submitRegistration } = useRegistration();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting: formIsSubmitting },
		watch,
		register,
		setValue,
		getFieldState,
		trigger,
		...form
	} = useForm<RegistrationFormData>({
		resolver: zodResolver(registrationSchema),
		mode: 'onChange',
		defaultValues: {
			studentInfo: {
				gender: (selectedStudent?.gender as 'male' | 'female') || 'male',
				fullName: selectedStudent?.fullName || '',
				dateOfBirth: selectedStudent?.dateOfBirth
					? new Date(selectedStudent?.dateOfBirth.toString())
					: new Date(),
				placeOfBirth: selectedStudent?.placeOfBirth || '',
				educationDepartment: selectedStudent?.educationDepartment || '',
				primarySchool: selectedStudent?.primarySchool || '',
				grade: selectedStudent?.grade || '',
			},
			competitionResults: selectedStudent?.competitionResults,
			priorityPoint: {
				type: 'none',
				points: 0,
			},
			academicRecords: {
				grades: [
					{
						grade: 1,
						math: undefined,
						vietnamese: undefined,
						english: undefined,
						science: undefined,
						history: undefined,
						award: undefined,
					},
					{
						grade: 2,
						math: undefined,
						vietnamese: undefined,
						english: undefined,
						science: undefined,
						history: undefined,
						award: undefined,
					},
					{
						grade: 3,
						math: undefined,
						vietnamese: undefined,
						english: undefined,
						science: undefined,
						history: undefined,
						award: undefined,
					},
					{
						grade: 4,
						math: undefined,
						vietnamese: undefined,
						english: undefined,
						science: undefined,
						history: undefined,
						award: undefined,
					},
					{
						grade: 5,
						math: undefined,
						vietnamese: undefined,
						english: undefined,
						science: undefined,
						history: undefined,
						award: undefined,
					},
				],
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

		// Tạo từng phần tử riêng biệt với year được đặt chính xác và đảm bảo tất cả trường đều có giá trị
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

		// Đặt giá trị cho competitionResults trước khi load draft data
		setValue('competitionResults', compResults);

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
				competitionResults:
					draftData.competitionResults && draftData.competitionResults.length > 0
						? draftData.competitionResults.map((item, index) => ({
								...(compResults ? (compResults[index] ? compResults[index] : {}) : {}), // Sử dụng giá trị mặc định từ compResults nếu có
								...(item
									? {
											...item,
											level: item.level as 'city' | 'national',
											achievement: item.achievement as 'none' | 'first' | 'second' | 'third',
											year: item.year || currentYear, // Đảm bảo year luôn có giá trị
									  }
									: {}), // Sử dụng giá trị từ draftData nếu có
						  }))
						: compResults,
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

	// Add a function to classify students after form loads
	const updateClassifications = useCallback(
		(gradeIndex: number) => {
			const grades = form.getValues('academicRecords.grades');
			const competitionResults = form.getValues('competitionResults');

			if (grades && grades[gradeIndex]) {
				const gradeNumber = gradeIndex + 1;
				const classification = determineStudentClassification(
					grades[gradeIndex],
					gradeNumber,
					competitionResults,
				);

				if (classification) {
					setValue(`academicRecords.grades.${gradeIndex}.award`, classification, {
						shouldValidate: false,
						shouldDirty: true,
						shouldTouch: false,
					});
				}
			}
		},
		[setValue, form],
	);

	// Watch specific fields for changes
	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name?.startsWith('academicRecords.grades.')) {
				const match = name.match(/academicRecords\.grades\.(\d+)\./);
				if (match) {
					const gradeIndex = parseInt(match[1]);
					// updateClassifications(gradeIndex);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [watch, updateClassifications]);

	const onSubmit = async (data: RegistrationFormData) => {
		try {
			// Store form values to display in confirmation modal
			setFormValues(data);
			console.log('Form values:', data);

			// Open the confirmation modal
			openConfirmModal();
		} catch (error) {
			// Handle validation errors
			if (error instanceof z.ZodError) {
				error.errors.forEach(err => {
					const fieldName = err.path.join('.');
					form.setError(fieldName as any, {
						type: 'manual',
						message: err.message,
					});
				});

				// Show error notification
				showErrorToast('Vui lòng kiểm tra và điền đầy đủ thông tin!');

				// Scroll to first error
				const firstErrorField = document.querySelector('.mantine-Input-error');
				firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	};

	const onInvalid = (errors: any) => {
		console.error('Form validation errors:', errors);

		// Show error notification
		showErrorToast('Vui lòng kiểm tra lại thông tin đã nhập!');

		// Scroll to first error
		const firstErrorField = document.querySelector('.mantine-Input-error');
		firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
					academicRecords: formValues.academicRecords,
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

			await submitRegistration(formValues);
			setIsReady(true);
			closeConfirmModal();
			showSuccessToast('Đăng ký thành công! Bây giờ bạn có thể tải lên các tài liệu cần thiết.');
		} catch (error: any) {
			console.error('Error submitting form:', error);
			showErrorToast(error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Helper function to render field error
	const getErrorMessage = (fieldName: string) => {
		const fieldError = get(errors, fieldName);
		return fieldError?.message as string | undefined;
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Phòng GDĐT'
											placeholder='Nhập tên phòng giáo dục và đào tạo'
											error={error?.message}
											required
											{...field}
											onChange={event => {
												field.onChange(event);
												// Trigger validation immediately
												trigger('studentInfo.educationDepartment');
											}}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='studentInfo.primarySchool'
									control={control}
									render={({ field, fieldState: { error, invalid } }) => (
										<TextInput
											label='Trường tiểu học'
											placeholder='Nhập tên trường tiểu học'
											error={error?.message}
											required
											{...field}
											classNames={{
												input: invalid ? 'border-red-500' : '',
											}}
											onChange={event => {
												field.onChange(event);
												trigger('studentInfo.primarySchool');
											}}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='studentInfo.grade'
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Lớp'
											placeholder='Ví dụ: 5A'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<Radio.Group label='Giới tính' error={error?.message} required {...field}>
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Họ và tên học sinh'
											placeholder='VIẾT IN HOA'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<DatePickerInput
											label='Ngày, tháng, năm sinh'
											placeholder='DD/MM/YYYY'
											error={error?.message}
											required
											valueFormat='DD/MM/YYYY'
											locale='vi'
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 4 }}>
								<Controller
									name='studentInfo.placeOfBirth'
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Nơi sinh'
											placeholder='Tỉnh/Thành phố'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Dân tộc'
											placeholder='Ví dụ: Kinh'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Nơi thường trú'
											placeholder='Ghi rõ địa chỉ đầy đủ'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Nơi tạm trú'
											placeholder='Ghi rõ địa chỉ đầy đủ (nếu có)'
											error={error?.message}
											required
											{...field}
										/>
									)}
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Controller
									name='residenceInfo.currentAddress'
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Nơi ở hiện tại'
											placeholder='Ghi rõ địa chỉ đầy đủ'
											error={error?.message}
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
										render={({ field, fieldState: { error, invalid } }) => (
											<TextInput
												label='Họ tên cha'
												placeholder='Họ và tên của cha'
												error={error?.message}
												{...field}
												classNames={{
													input: invalid ? 'border-red-500' : '',
													label: invalid ? 'text-red-500' : '',
												}}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherBirthYear'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<NumberInput
												label='Năm sinh'
												placeholder='Ví dụ: 1980'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherPhone'
										control={control}
										render={({ field, fieldState: { error, invalid } }) => (
											<TextInput
												label='Số điện thoại'
												placeholder='Số điện thoại liên hệ'
												error={error?.message}
												{...field}
												onChange={event => {
													field.onChange(event);
													// Validate phone number format immediately
													trigger('parentInfo.fatherPhone');
												}}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherIdCard'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Số CCCD'
												placeholder='Số căn cước công dân'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherOccupation'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Nghề nghiệp'
												placeholder='Nghề nghiệp hiện tại'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.fatherWorkplace'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Nơi công tác'
												placeholder='Nơi làm việc hiện tại'
												error={error?.message}
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
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Họ tên mẹ'
												placeholder='Họ và tên của mẹ'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherBirthYear'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<NumberInput
												label='Năm sinh'
												placeholder='Ví dụ: 1985'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherPhone'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Số điện thoại'
												placeholder='Số điện thoại liên hệ'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherIdCard'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Số CCCD'
												placeholder='Số căn cước công dân'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherOccupation'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Nghề nghiệp'
												placeholder='Nghề nghiệp hiện tại'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.motherWorkplace'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Nơi công tác'
												placeholder='Nơi làm việc hiện tại'
												error={error?.message}
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
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Họ tên người giám hộ'
												placeholder='Họ và tên người giám hộ'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianBirthYear'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<NumberInput
												label='Năm sinh'
												placeholder='Ví dụ: 1970'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianPhone'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Số điện thoại'
												placeholder='Số điện thoại liên hệ'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianIdCard'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Số CCCD'
												placeholder='Số căn cước công dân'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianOccupation'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Nghề nghiệp'
												placeholder='Nghề nghiệp hiện tại'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Controller
										name='parentInfo.guardianWorkplace'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Nơi công tác'
												placeholder='Nơi làm việc hiện tại'
												error={error?.message}
												{...field}
											/>
										)}
									/>
								</Grid.Col>
								<Grid.Col span={12}>
									<Controller
										name='parentInfo.guardianRelationship'
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextInput
												label='Quan hệ với học sinh'
												placeholder='Ví dụ: Ông, Bà, Cô, Chú,...'
												error={error?.message}
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
													<Controller
														name={`competitionResults.${
															index * levelOptions.length + levelIndex
														}.achievement`}
														control={control}
														render={({ field, fieldState: { error } }) => (
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
																	console.log(
																		competition.competitionId,
																		level.value,
																		selectedValue,
																		index * levelOptions.length + levelIndex,
																	);

																	updateCompetitionResults(
																		competition.competitionId,
																		level.value,
																		selectedValue,
																		index * levelOptions.length + levelIndex,
																	);
																}}
																disabled={competition.disabledLevel.includes(level.value as string)}
																styles={{ input: { minWidth: '140px' } }}
																error={error?.message}
															/>
														)}
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

					{/* Academic Records Table */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							E. ĐIỂM CUỐI NĂM HỌC LỚP 1 ĐẾN LỚP 5
						</Title>

						<Box className='overflow-x-auto'>
							<Table
								striped
								withTableBorder
								withColumnBorders
								withRowBorders
								mb='md'
								style={{ minWidth: '800px' }}>
								<Table.Thead>
									<Table.Tr>
										<Table.Th
											rowSpan={2}
											style={{ width: '80px', textAlign: 'center', verticalAlign: 'middle' }}>
											Lớp
										</Table.Th>
										<Table.Th
											colSpan={academicSubjectsConfig.length}
											style={{ textAlign: 'center' }}>
											Điểm cuối năm học lớp 1 đến lớp 5
										</Table.Th>
										<Table.Th rowSpan={2} style={{ minWidth: '250px', verticalAlign: 'middle' }}>
											Khen thưởng cuối năm
											<div
												style={{ fontStyle: 'italic', fontWeight: 'normal', fontSize: '0.85em' }}>
												(Nếu học sinh đạt danh hiệu "Học sinh hoàn thành xuất sắc các nội dung học
												tập và rèn luyện" ghi là HTXS vào cột các lớp tương ứng)
											</div>
										</Table.Th>
									</Table.Tr>
									<Table.Tr>
										{academicSubjectsConfig.map(subject => (
											<Table.Th
												key={subject.subjectId}
												style={{ textAlign: 'center', border: '1px solid #dee2e6' }}>
												{subject.name}
											</Table.Th>
										))}
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{[1, 2, 3, 4, 5].map((gradeNumber: number) => (
										<Table.Tr key={gradeNumber}>
											<Table.Td style={{ textAlign: 'center', fontWeight: 'bold' }}>
												{gradeNumber}
											</Table.Td>
											{academicSubjectsConfig.map(subject => (
												<Table.Td key={subject.subjectId}>
													{subject.disabledGrades.includes(gradeNumber) ? (
														<Text ta='center'>—</Text>
													) : (
														<Controller
															name={`academicRecords.grades.${gradeNumber - 1}.${subject.subjectId}`}
															control={control}
															render={({ field, fieldState: { error } }) => (
																<NumberInput
																	hideControls
																	min={0}
																	max={10}
																	step={0.1}
																	error={error?.message}
																	value={field.value ?? ''}
																	onChange={(val) => {
																		// Convert empty string or undefined to undefined, otherwise keep the number
																		const numValue = val === '' || val === undefined ? undefined : Number(val);
																		field.onChange(numValue);
																		// Trigger validation for the current grade
																		// trigger(`academicRecords.grades.${gradeNumber - 1}`);
																		trigger(`academicRecords.grades.${gradeNumber - 1}.${subject.subjectId}`);
																	}}
																	styles={{
																		input: {
																			textAlign: 'center',
																			backgroundColor: field.value ? '#f0f8ff' : undefined,
																		},
																	}}
																/>
															)}
														/>
													)}
												</Table.Td>
											))}
											<Table.Td>
												<Controller
													name={`academicRecords.grades.${gradeNumber - 1}.award`}
													control={control}
													render={({ field, fieldState: { error } }) => (
														<TextInput
															placeholder='HTXS'
															error={error?.message}
															value={field.value || ''}
															onChange={(e) => field.onChange(e.currentTarget.value)}
															disabled
															styles={{
																input: {
																	textAlign: 'center',
																	// backgroundColor: field.value ? '#f0f8ff' : undefined,
																},
															}}
														/>
													)}
												/>
											</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Box>
						<Alert
							color='blue'
							title='Phân loại học sinh'
							icon={<IconAlertCircle size={16} />}
							mb='md'>
							<Text size='sm' mb='xs'>
								Hệ thống sẽ tự động phân loại học sinh dựa trên điểm số các môn học:
							</Text>
							<Box pl='md'>
								<Text size='sm' mb='xs'>
									<strong>Hoàn Thành Xuất Sắc (HTXS):</strong> Tất cả các môn đều đạt từ 9 đến 10
									điểm.
								</Text>
								<Text size='sm' mb='xs'>
									<strong>Có Thành Tích Vượt Trội (CTTVT):</strong> Đối với lớp 3-5, môn Toán và
									Tiếng Việt đạt 10 điểm, môn Tiếng Anh đạt từ 9 điểm trở lên.
								</Text>
								<Text size='sm' mb='xs'>
									<strong>Có Thành Tích Thi đấu (CTTT):</strong> Học sinh đạt giải trong các kỳ thi
									cấp quốc gia hoặc đạt giải nhất cấp thành phố.
								</Text>
								<Text size='sm' c='yellow' fw={700} style={{ fontStyle: 'italic' }}>
									*Lưu ý: Bảng điểm sẽ được xác minh với hồ sơ gốc của học sinh.
								</Text>
							</Box>
						</Alert>

						<Grid mb='md'>
							<Grid.Col span={12}>
								{/* <div className="mb-2 font-medium">Phân loại học sinh:</div> */}
								{/* <Select
										readOnly
										placeholder="Chọn phân loại"
										data={[
											{ value: 'HTXS', label: 'Hoàn Thành Xuất Sắc (HTXS)' },
											{ value: 'CTTVT', label: 'Có Thành Tích Vượt Trội (CTTVT)' },
											{ value: 'CTTT', label: 'Có Thành Tích Thi đấu (CTTT)' },
										]}
										disabled
										value={(() => {
											// Find the highest classification across all grades
											const grades = form.getValues('academicRecords.grades') || [];
											const allClassifications = grades
												.map(grade => grade?.award || '')
												.filter(Boolean);
												
											// Priority: HTXS > CTTVT > CTTT
											if (allClassifications.includes('HTXS')) return 'HTXS';
											if (allClassifications.includes('CTTVT')) return 'CTTVT';
											if (allClassifications.includes('CTTT')) return 'CTTT';
											return null;
										})()}
									/> */}
								{/* {watch('academicRecords.grades').map((grade, index) => (
									<div key={index}>
										<Text>{grade.award}</Text>
									</div>
								))} */}
							</Grid.Col>
						</Grid>
					</Paper>

					{/* G. ĐIỂM ƯU TIÊN */}
					<Paper withBorder className='p-4 sm:p-10' radius='md' mb='lg'>
						<Title order={4} mb='md'>
							G. ĐIỂM ƯU TIÊN (nếu có)
						</Title>
						<Controller
							name='priorityPoint.type'
							control={control}
							render={({ field, fieldState: { error } }) => (
								<Radio.Group {...field} pl='md'>
									<Stack>
										{priorityPointsConfig.map(priority => (
											<Radio
												size='md'
												className='cursor-pointer'
												key={priority.value}
												defaultChecked={priority.value === field.value}
												value={priority.value}
												onChange={field.onChange}
												label={
													<Text fw={500} size='lg' className='cursor-pointer'>
														{priority.label}
													</Text>
												}
												description={
													<Text size='sm' c='dimmed'>
														{priority.description}
													</Text>
												}
												error={error?.message}
											/>
										))}
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Quan hệ với học sinh'
											placeholder='Ví dụ: Cha/Mẹ/Người giám hộ'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<DatePickerInput
											label='Ngày tháng năm kê khai'
											defaultValue={new Date()}
											placeholder='DD/MM/YYYY'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Họ tên Cha/Mẹ/Người giám hộ'
											placeholder='Ghi rõ họ tên'
											error={error?.message}
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
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Họ tên người viết phiếu đăng ký'
											placeholder='Ghi rõ họ tên'
											error={error?.message}
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
							{/* <Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.fileId'
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Mã hồ sơ'
											placeholder='LL...'
											disabled
											{...field}
											error={error?.message}
										/>
									)}
								/>
							</Grid.Col> */}
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.studentCode'
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Mã học sinh theo CSDL BGD'
											required
											{...field}
											error={error?.message}
										/>
									)}
								/>
							</Grid.Col>
							{/* <Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.password'
									control={control}
									render={({ field }) => <TextInput label='Mật khẩu' type='password' {...field} />}
								</Grid.Col> */}
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Controller
									name='additionalInfo.identificationNumber'
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextInput
											label='Số định danh học sinh'
											required
											{...field}
											error={error?.message}
										/>
									)}
								/>
							</Grid.Col>
						</Grid>
					</Paper>

					<Group justify='start' my='xl'>
						<Button type='submit' size='lg' loading={isSubmitting}>
							Nộp phiếu đăng ký
						</Button>
					</Group>
				</form>

				<Space h='xl' />

								{/* {!isReady && (
									<Alert

								)} */}
				<DocumentUpload isReady={isReady} />
			</Paper>

			{/* Confirmation Modal */}
			<Modal
				opened={confirmModalOpened}
				onClose={closeConfirmModal}
				title={
					<Text fw={500} size='lg'>
						Xác nhận nộp phiếu đăng ký
					</Text>
				}
				size='1000' // kích thước cơ bản theo viewport width
				maw={1000} // tối đa không vượt quá 1000px
				miw='320px' // tối thiểu (tuỳ bạn), đủ cho mobile
				centered>
				{formValues && (
					<>
						<Text mb='md'>Vui lòng xác nhận thông tin trước khi nộp phiếu đăng ký:</Text>

						<Paper withBorder className='p-4' radius='md' mb='md'>
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

						<Paper withBorder className='p-4' radius='md' mb='md'>
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

						<Paper withBorder className='p-4' radius='md' mb='md'>
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

						<Paper withBorder className='p-4' radius='md' mb='md'>
							<Title order={5} mb='xs'>
								Kết quả học tập (Điểm cuối năm học lớp 1 đến lớp 5)
							</Title>
							<Table withTableBorder withColumnBorders>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Lớp</Table.Th>
										<Table.Th>Môn Toán</Table.Th>
										<Table.Th>Tiếng Việt</Table.Th>
										<Table.Th>Tiếng Anh</Table.Th>
										<Table.Th>Khoa học</Table.Th>
										<Table.Th>Lịch sử và Địa lí</Table.Th>
										{/* <Table.Th>Khen thưởng</Table.Th> */}
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{formValues.academicRecords.grades.map((grade, index) => (
										<Table.Tr key={index}>
											<Table.Td>{grade.grade}</Table.Td>
											<Table.Td>{grade.math ?? '—'}</Table.Td>
											<Table.Td>{grade.vietnamese ?? '—'}</Table.Td>
											<Table.Td>{grade.grade <= 2 ? '—' : grade.english ?? '—'}</Table.Td>
											<Table.Td>{grade.grade === 1 ? '—' : grade.science ?? '—'}</Table.Td>
											<Table.Td>{grade.grade <= 3 ? '—' : grade.history ?? '—'}</Table.Td>
											{/* <Table.Td>{grade.award || '—'}</Table.Td> */}
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
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
			<FeedbackCard />
		</Container>
	);
}

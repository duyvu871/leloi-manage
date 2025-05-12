'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
	Button,
	Text,
	Card,
	Group,
	Badge,
	Progress,
	Loader,
	List,
	Title,
	Alert,
	Box,
	FileInput,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFileText, IconX, IconAlertCircle } from '@tabler/icons-react';
import { useDocumentManagement } from '@/hooks/client/use-document-management';
import { useApplicationManagement } from '@/hooks/client/use-application-management';
import useToast from '@/hooks/client/use-toast-notification';
import { Document } from '@/types/registration';
import { useTranslations } from 'next-intl';
import { useAtom } from 'jotai';
import { selectedStudentApplicationAtom, userAtom } from '@/stores/user';
import { cn } from '@/libs/tailwind/tailwind-merge';

interface DocumentUploadProps {
	isReady: boolean;
}

export default function DocumentUpload({ isReady }: DocumentUploadProps) {
	const t = useTranslations('dashboard');
	const { showErrorToast, showSuccessToast } = useToast();
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
	const [certificateFiles, setCertificateFiles] = useState<File[]>([]);

	const [user] = useAtom(userAtom);
	const [applicationAtom] = useAtom(selectedStudentApplicationAtom);

	const { documents, extractedData, isLoading, error, loadDocuments, uploadDocument } =
		useDocumentManagement();

	const { application, loadApplicationStatus } = useApplicationManagement();

	// Cấu hình thông báo lỗi cho Dropzone
	const getDropzoneErrorMessage = useCallback(
		(error: { code: string; size?: number }) => {
			switch (error.code) {
				case 'file-invalid-type':
					return t('documents.file_invalid_type');
				case 'file-too-large':
					return t('documents.file_too_large', { size: 10 });
				case 'file-too-small':
					return t('documents.file_too_small', { size: 1 });
				case 'too-many-files':
					return t('documents.too_many_files');
				default:
					return t('documents.invalidFile');
			}
		},
		[t],
	);

	useEffect(() => {
		if (applicationAtom?.id) {
			loadDocuments(applicationAtom.id);
			loadApplicationStatus(applicationAtom.id);
		}
	}, [application, loadDocuments, loadApplicationStatus]);

	const handleTranscriptSelect = useCallback((file: File) => {
		if (transcriptFile && 
			transcriptFile.name === file.name && 
			transcriptFile.size === file.size) {
			showErrorToast(t('documents.duplicateFile'));
			return;
		}
		setTranscriptFile(file);
	}, [transcriptFile, showErrorToast, t]);

	const handleCertificateSelect = useCallback((files: File[]) => {
		const newFiles = files.filter(file => {
			const isDuplicate = certificateFiles.some(
				existingFile => 
					existingFile.name === file.name && 
					existingFile.size === file.size
			);

			if (isDuplicate) {
				showErrorToast(t('documents.duplicateFileNamed', { fileName: file.name }));
				return false;
			}

			if (!file.type.startsWith('image/')) {
				showErrorToast(t('documents.notImageFile', { fileName: file.name }));
				return false;
			}

			return true;
		});

		if (newFiles.length > 0) {
			setCertificateFiles(prev => [...prev, ...newFiles]);
		}
	}, [certificateFiles, showErrorToast, t]);

	const handleUploadAll = useCallback(async () => {
		if (!isReady) return;
		if (!transcriptFile && certificateFiles.length === 0) {
			showErrorToast(t('documents.noFilesSelected'));
			return;
		}

		setIsUploading(true);
		setUploadProgress(10);

		const progressInterval = setInterval(() => {
			setUploadProgress(prev => {
				if (prev >= 90) {
					clearInterval(progressInterval);
					return 90;
				}
				return prev + 10;
			});
		}, 500);

		try {
			if (!applicationAtom?.id) {
				console.log('Application ID is required to upload documents');
				return;
			}

			// Upload transcript if exists
			if (transcriptFile) {
				const transcriptUpload = await uploadDocument([transcriptFile], 'transcript', applicationAtom?.id);
				if (!transcriptUpload) {
					throw new Error('Transcript upload failed');
				}
			}

			// Upload certificates if exist
			if (certificateFiles.length > 0) {
				const certificateUpload = await uploadDocument(certificateFiles, 'certificate', applicationAtom?.id);
				if (!certificateUpload) {
					throw new Error('Certificate upload failed');
				}
			}

			setUploadProgress(100);
			loadApplicationStatus();
			showSuccessToast(t('documents.uploadSuccess'));
		} catch (error) {
			console.error('Upload failed:', error);
			showErrorToast(t('documents.uploadFailed'));
		} finally {
			clearInterval(progressInterval);
			setTimeout(() => {
				setIsUploading(false);
				setUploadProgress(0);
			}, 1000);
		}
	}, [applicationAtom?.id, transcriptFile, certificateFiles, uploadDocument, loadApplicationStatus, isReady, showSuccessToast, showErrorToast, t]);

	const removeTranscriptFile = () => {
		setTranscriptFile(null);
	};

	const removeCertificateFile = (file: File) => {
		setCertificateFiles(prev => prev.filter(f => f !== file));
	};

	const getDocumentTypeLabel = (type: string) => {
		switch (type) {
			case 'transcript':
				return t('documents.transcriptLabel');
			case 'certificate':
				return t('documents.certificateLabel');
			case 'identity':
				return t('documents.identityLabel');
			case 'other':
				return t('documents.otherLabel');
			default:
				return type;
		}
	};

	const transcriptDocuments = documents.filter(doc => doc.type === 'transcript');
	const certificateDocuments = documents.filter(
		doc => doc.type === 'certificate' || doc.type === 'other',
	);

	const hasSelectedFiles = transcriptFile || certificateFiles.length > 0;

	return (
		<div className='space-y-6'>
			<Title order={4} mb='md'>
				Tải lên học bạ & chứng chỉ
			</Title>
			<Alert color='blue' title='Lưu ý' icon={<IconAlertCircle size={16} />} mb='md' mt='md'>
				<List size='sm' spacing='xs'>
					<List.Item>
						<Text span>Tài liệu <Text span fw={700}>học bạ, chứng chỉ</Text> được tải lên sẽ được <Text span fw={700}>xác thực</Text> bởi hệ thống so với <Text span fw={700}>phiếu đăng ký</Text>.</Text>
					</List.Item>
					<List.Item>
						<Text span>Để đảm bảo tài liệu được xác thực chính xác, vui lòng đảm bảo rằng tài liệu <Text span fw={700}>không bị mờ</Text>, <Text span fw={700}>không bị che khuất</Text> và <Text span fw={700}>đầy đủ thông tin</Text>.</Text>
					</List.Item>
				</List>
			</Alert>

			<Card shadow='sm' padding='lg' radius='md' withBorder>
				<Card.Section withBorder inheritPadding py='xs'>
					<Text fw={500}>{t('documents.transcriptTitle')}</Text>
				</Card.Section>

				<Text size='sm' color='dimmed' mt='md' mb='md'>
					{t('documents.transcriptInstruction')} <span className='text-red-500'>*</span>
				</Text>

				{transcriptFile ? (
					<div className='mt-4'>
						<div className='flex items-center justify-between bg-blue-50 p-4 rounded-lg'>
							<div className='flex items-center'>
								<IconFileText size={20} className='text-blue-500 mr-2' />
								<Text size='sm'>{transcriptFile.name}</Text>
							</div>
							<Button
								variant='subtle'
								color='red'
								onClick={removeTranscriptFile}
								leftSection={<IconX size={16} />}>
								{t('documents.remove')}
							</Button>
						</div>
					</div>
				) : (
					<Dropzone
						onDrop={files => {
							if (files.length > 0) {
								handleTranscriptSelect(files[0]);
							}
						}}
						onReject={fileRejections => {
							const error = fileRejections[0]?.errors[0];
							if (error) {
								showErrorToast(getDropzoneErrorMessage(error));
							} else {
								showErrorToast(t('documents.invalidFile'));
							}
						}}
						maxSize={10 * 1024 ** 2}
						accept={['application/pdf']}
						className={cn(
							'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50',
							!isReady && 'opacity-50 cursor-not-allowed',
						)}
						disabled={!isReady}>
						<div className='flex flex-col items-center'>
							<IconUpload size={40} stroke={1.5} className='text-gray-500 mb-4' />
							<Text size='lg' className='mb-2'>
								{t('documents.dropzone')}
							</Text>
							<Text size='sm' color='dimmed' className='mb-4'>
								{t('documents.dragOrClick')}
							</Text>
							<Button>{t('documents.browseFiles')}</Button>
						</div>
					</Dropzone>
				)}
			</Card>

			<Card shadow='sm' padding='lg' radius='md' withBorder>
				<Card.Section withBorder inheritPadding py='xs'>
					<Text fw={500}>{t('documents.certificateTitle')}</Text>
				</Card.Section>

				<Text size='sm' color='dimmed' mt='md' mb='md'>
					{t('documents.certificateInstruction')}
				</Text>

				{certificateFiles.length > 0 && (
					<div className='mt-4 space-y-2'>
						{certificateFiles.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className='flex items-center justify-between bg-blue-50 p-4 rounded-lg'>
								<div className='flex items-center'>
									<IconFileText size={20} className='text-blue-500 mr-2' />
									<Text size='sm'>{file.name}</Text>
								</div>
								<Button
									variant='subtle'
									color='red'
									onClick={() => removeCertificateFile(file)}
									leftSection={<IconX size={16} />}>
									{t('documents.remove')}
								</Button>
							</div>
						))}
					</div>
				)}

				<Dropzone
					onDrop={files => {
						if (files.length > 0) {
							handleCertificateSelect(files);
						}
					}}
					onReject={fileRejections => {
						const error = fileRejections[0]?.errors[0];
						if (error) {
							showErrorToast(getDropzoneErrorMessage(error));
						} else {
							showErrorToast(t('documents.invalidFile'));
						}
					}}
					maxSize={10 * 1024 ** 2}
					accept={['image/jpeg', 'image/png', 'image/jpg']}
					multiple
					className={cn(
						'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 mt-4',
						!isReady && 'opacity-50 cursor-not-allowed',
					)}
					disabled={!isReady}>
					<div className='flex flex-col items-center'>
						<IconUpload size={40} stroke={1.5} className='text-gray-500 mb-4' />
						<Text size='lg' className='mb-2'>
							{t('documents.dropzone')}
						</Text>
						<Text size='sm' color='dimmed' className='mb-4'>
							{t('documents.dragOrClickMultiple')}
						</Text>
						<Text size='xs' color='dimmed'>
							{t('documents.supportedImageFormats')}
						</Text>
						<Button mt='md'>{t('documents.browseFiles')}</Button>
					</div>
				</Dropzone>
			</Card>

			{hasSelectedFiles && (
				<Card shadow='sm' padding='lg' radius='md' withBorder>
					<Group justify="space-between">
						<div>
							<Text fw={500}>{t('documents.selectedFiles')}</Text>
							<Text size='sm' color='dimmed'>
								{transcriptFile ? t('documents.oneTranscript') : ''} 
								{transcriptFile && certificateFiles.length > 0 ? ` ${t('documents.and')} ` : ''}
								{certificateFiles.length > 0 ? t('documents.multipleCertificates', { count: certificateFiles.length }) : ''}
							</Text>
						</div>
						<Button
							onClick={handleUploadAll}
							loading={isUploading}
							leftSection={<IconUpload size={16} />}>
							{isUploading ? t('documents.uploading') : t('documents.uploadAll')}
						</Button>
					</Group>

					{isUploading && (
						<Box mt='md'>
							<Progress
								value={uploadProgress}
								color={uploadProgress === 100 ? 'green' : 'blue'}
								size='md'
								mb='xs'
							/>
							<Text size='sm' color='dimmed'>
								{uploadProgress === 100
									? t('documents.uploadComplete')
									: t('documents.uploadingProgress', { progress: uploadProgress })}
							</Text>
						</Box>
					)}
				</Card>
			)}

			{(transcriptDocuments.length > 0 || certificateDocuments.length > 0) && (
				<Card shadow='sm' padding='lg' radius='md' withBorder>
					<Card.Section withBorder inheritPadding py='xs'>
						<Text fw={500}>{t('documents.uploadedTitle')}</Text>
					</Card.Section>

					{transcriptDocuments.length > 0 && (
						<div className='mt-4'>
							<Text fw={500} size='sm' mb='xs'>
								{t('documents.uploadedTranscripts')}
							</Text>
							<List spacing='xs' size='sm'>
								{transcriptDocuments.map((doc: Document) => (
									<List.Item key={doc.id} icon={<IconFileText size={20} />} className='py-2'>
										<div className='flex justify-between items-center'>
											<div>
												<Text fw={500}>{doc.fileName || getDocumentTypeLabel(doc.type)}</Text>
												<Text size='xs' color='dimmed'>
													{new Date(doc.uploadedAt).toLocaleString()}
												</Text>
											</div>
											<div className='flex items-center space-x-2'>
												{extractedData[doc.id] && (
													<Badge
														color={extractedData[doc.id].isVerified ? 'green' : 'yellow'}
														variant='light'
														size='sm'>
														{extractedData[doc.id].isVerified
															? t('documents.verified')
															: t('documents.pending')}
													</Badge>
												)}
												<Button variant='subtle' component='a' href={doc.filePath} target='_blank'>
													{t('documents.view')}
												</Button>
											</div>
										</div>
									</List.Item>
								))}
							</List>
						</div>
					)}

					{certificateDocuments.length > 0 && (
						<div className='mt-4'>
							<Text fw={500} size='sm' mb='xs'>
								{t('documents.uploadedCertificates')}
							</Text>
							<List spacing='xs' size='sm'>
								{certificateDocuments.map((doc: Document) => (
									<List.Item key={doc.id} icon={<IconFileText size={20} />} className='py-2'>
										<div className='flex justify-between items-center'>
											<div>
												<Text fw={500}>{doc.fileName || getDocumentTypeLabel(doc.type)}</Text>
												<Text size='xs' color='dimmed'>
													{new Date(doc.uploadedAt).toLocaleString()}
												</Text>
											</div>
											<Button variant='subtle' component='a' href={doc.filePath} target='_blank'>
												{t('documents.view')}
											</Button>
										</div>
									</List.Item>
								))}
							</List>
						</div>
					)}
				</Card>
			)}
		</div>
	);
}

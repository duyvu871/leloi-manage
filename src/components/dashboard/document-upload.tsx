'use client';

import React, { useState, useEffect } from 'react';
import { Button, Text, Card, Group, Badge, Progress, Loader, List } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFileText, IconX } from '@tabler/icons-react';
import { useDocumentManagement } from '@/hooks/client/use-document-management';
import { useApplicationManagement } from '@/hooks/client/use-application-management';
import useToast from '@/hooks/client/use-toast-notification';
import { Document } from '@/types/registration';
import { useTranslations } from 'next-intl';
import { useAtom } from 'jotai';
import { selectedStudentApplicationAtom, userAtom } from '@/stores/user';


export default function DocumentUpload() {
	const t = useTranslations('dashboard');
	const { showErrorToast, showSuccessToast } = useToast();
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [activeDocType, setActiveDocType] = useState<string>('');

	const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
	const [certificateFiles, setCertificateFiles] = useState<File[]>([]);

	const [user] = useAtom(userAtom);
	const [applicationAtom] = useAtom(selectedStudentApplicationAtom);

	const { documents, extractedData, isLoading, error, loadDocuments, uploadDocument } =
		useDocumentManagement();

	const { application, loadApplicationStatus } = useApplicationManagement();

	useEffect(() => {
		if (applicationAtom?.id) {
			loadDocuments(applicationAtom.id);
			loadApplicationStatus(applicationAtom.id);
		}
	}, [application, loadDocuments, loadApplicationStatus]);

	const handleTranscriptUpload = async (file: File) => {
		setActiveDocType('transcript');
		setIsUploading(true);
		setUploadProgress(10);
		setTranscriptFile(file);

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
			await uploadDocument(file, 'transcript');
			setUploadProgress(100);
			loadApplicationStatus();
			// showSuccessToast(t('documents.uploadSuccess'));
		} catch (error) {
			console.error('Upload failed:', error);
			// showErrorToast(t('documents.uploadFailed'));
			setTranscriptFile(null);
		} finally {
			clearInterval(progressInterval);
			setTimeout(() => {
				setIsUploading(false);
				setUploadProgress(0);
				setActiveDocType('');
			}, 1000);
		}
	};

	const handleCertificateUpload = async (files: File[]) => {
		if (files.length === 0) return;

		setActiveDocType('certificate');
		setCertificateFiles(prev => [...prev, ...files]);

		for (const file of files) {
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
			}, 300);

			try {
				await uploadDocument(file, 'certificate');
				setUploadProgress(100);
				loadApplicationStatus();
			} catch (error) {
				console.error('Upload failed:', error);
				// showErrorToast(`${file.name}: ${t('documents.uploadFailed')}`);
				setCertificateFiles(prev => prev.filter(f => f !== file));
			} finally {
				clearInterval(progressInterval);
				setTimeout(() => {
					setIsUploading(false);
					setUploadProgress(0);
				}, 500);
			}
		}

		if (files.length > 0) {
			// showSuccessToast(t('documents.multipleCertificatesUploaded'));
		}

		setActiveDocType('');
	};

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

	return (
		<div className='space-y-6'>
			<Card shadow='sm' padding='lg' radius='md' withBorder>
				<Card.Section withBorder inheritPadding py='xs'>
					<Group>
						<Text fw={500}>{t('documents.uploadTitle')}</Text>
						<Badge
							color={
								application?.status === 'approved'
									? 'teal'
									: application?.status === 'rejected'
									? 'red'
									: 'blue'
							}>
							{application?.status === 'approved'
								? t('status.approved')
								: application?.status === 'rejected'
								? t('status.rejected')
								: t('status.pending')}
						</Badge>
					</Group>
				</Card.Section>

				<Text size='sm' color='dimmed' mt='md'>
					{t('documents.instruction')}
				</Text>
			</Card>

			<Card shadow='sm' padding='lg' radius='md' withBorder>
				<Card.Section withBorder inheritPadding py='xs'>
					<Text fw={500}>{t('documents.transcriptTitle')}</Text>
				</Card.Section>

				<Text size='sm' color='dimmed' mt='md' mb='md'>
					{t('documents.transcriptInstruction')} <span className='text-red-500'>*</span>
				</Text>

				{isUploading && activeDocType === 'transcript' ? (
					<div className='w-full py-6'>
						<Text size='sm' mb='xs'>
							{t('documents.uploading')}
						</Text>
						<Progress
							value={uploadProgress}
							color={uploadProgress === 100 ? 'green' : 'blue'}
							size='md'
						/>
						<Text size='sm' color='dimmed' mt='xs'>
							{uploadProgress === 100
								? t('documents.uploadComplete')
								: t('documents.uploadingProgress', { progress: uploadProgress })}
						</Text>
					</div>
				) : transcriptFile ? (
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
								handleTranscriptUpload(files[0]);
							}
						}}
						onReject={fileRejections => {
							showErrorToast(fileRejections[0]?.errors[0]?.message || t('documents.invalidFile'));
						}}
						maxSize={10 * 1024 ** 2}
						accept={['application/pdf']}
						className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50'>
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
			</Card>

			<Card shadow='sm' padding='lg' radius='md' withBorder>
				<Card.Section withBorder inheritPadding py='xs'>
					<Text fw={500}>{t('documents.certificateTitle')}</Text>
				</Card.Section>

				<Text size='sm' color='dimmed' mt='md' mb='md'>
					{t('documents.certificateInstruction')}
				</Text>

				{isUploading && activeDocType === 'certificate' ? (
					<div className='w-full py-6'>
						<Text size='sm' mb='xs'>
							{t('documents.uploading')}
						</Text>
						<Progress
							value={uploadProgress}
							color={uploadProgress === 100 ? 'green' : 'blue'}
							size='md'
						/>
						<Text size='sm' color='dimmed' mt='xs'>
							{uploadProgress === 100
								? t('documents.uploadComplete')
								: t('documents.uploadingProgress', { progress: uploadProgress })}
						</Text>
					</div>
				) : (
					<Dropzone
						onDrop={files => {
							if (files.length > 0) {
								handleCertificateUpload(files);
							}
						}}
						onReject={fileRejections => {
							showErrorToast(fileRejections[0]?.errors[0]?.message || t('documents.invalidFile'));
						}}
						maxSize={10 * 1024 ** 2}
						accept={['application/pdf', 'image/jpeg', 'image/png']}
						multiple
						className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50'>
						<div className='flex flex-col items-center'>
							<IconUpload size={40} stroke={1.5} className='text-gray-500 mb-4' />
							<Text size='lg' className='mb-2'>
								{t('documents.dropzone')}
							</Text>
							<Text size='sm' color='dimmed' className='mb-4'>
								{t('documents.dragOrClickMultiple')}
							</Text>
							<Text size='xs' color='dimmed'>
								{t('documents.supportedFormats')}
							</Text>
							<Button mt='md'>{t('documents.browseFiles')}</Button>
						</div>
					</Dropzone>
				)}

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

			{error && (
				<Text color='red' size='sm'>
					{error}
				</Text>
			)}
		</div>
	);
}

import React, {
	ComponentType,
	ReactElement,
	useEffect,
	useMemo,
	cloneElement,
	ReactNode,
} from 'react';
import {
	Button,
	Group,
	Select,
	TextInput,
	Grid,
	GridCol,
	PasswordInput,
	Radio,
	Checkbox,
	Stack,
	MantineColor,
	MantineSpacing,
	InputProps,
	Title,
} from '@mantine/core';
import { useForm, Controller, SubmitHandler, Path, UseFormReturn, Mode } from 'react-hook-form';
import { z, ZodSchema, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePickerInput } from '@mantine/dates';
import isEqual from 'lodash.isequal';

const defaultFieldProps = {
	autoCapitalize: 'off',
	autoComplete: 'off',
	autoCorrect: 'off',
	spellCheck: false,
};

export type FormFieldType =
	| 'text'
	| 'select'
	| 'date'
	| 'password'
	| 'email'
	| 'tel'
	| 'radio'
	| 'custom'
	| 'checkbox'
	| 'checkbox-group';

export type TitleField = {
	type: 'title';
	title: ReactNode;
	colSpan?: number;
};

export type FormField<T extends ZodSchema> = InputProps & {
	type: FormFieldType;
	name: Path<TypeOf<T>>;
	label?: string;
	defaultValue?: any;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	options?: Array<{ value: string; label: string }>;
	component?: ComponentType<any>;
	colSpan?: number;
	customProps?: Record<string, unknown>;
	wrapperStyle?: React.CSSProperties;
	autoComplete?: string;
};

export type InputField<T extends ZodSchema> = FormField<T> & {
	type: FormFieldType;
};

export type AnyFormField<T extends ZodSchema> = InputField<T> | TitleField;

export type FormBuilderProps<T extends ZodSchema> = {
	fields: AnyFormField<T>[];
	schema?: T;
	onSubmit: SubmitHandler<TypeOf<T>>;
	onCancel?: () => void;
	defaultValues?: Partial<TypeOf<T>>;
	submitText?: string;
	cancelText?: string;
	layout?: 'horizontal' | 'vertical';
	spacing?: string;
	gridGutter?: number;
	customComponents?: Record<string, ComponentType<any>>;
	actions?: ReactNode;
	color?: MantineColor;
	gap?: MantineSpacing;
	mode?: Mode;
	form?: UseFormReturn<TypeOf<T>>;
};

const isInputField = <T extends ZodSchema>(field: AnyFormField<T>): field is InputField<T> => {
	return field.type !== 'title';
};

export const FormBuilder = <T extends ZodSchema>({
	fields,
	schema,
	onSubmit,
	onCancel,
	defaultValues,
	submitText = 'Submit',
	cancelText = 'Cancel',
	layout = 'vertical',
	spacing = 'md',
	gridGutter = 20,
	customComponents,
	actions,
	color,
	gap,
	mode,
	form: externalForm,
}: FormBuilderProps<T>) => {
	type FormValues = TypeOf<T>;

	const mergedDefaultValues = useMemo(() => {
		const fieldDefaults = fields.reduce((acc, field) => {
			if (isInputField(field) && field.defaultValue !== undefined) {
				acc[field.name as keyof FormValues] = field.defaultValue;
			}
			return acc;
		}, {} as Partial<FormValues>);

		return { ...fieldDefaults, ...defaultValues };
	}, [fields, defaultValues]);

	const internalForm = useForm<FormValues>({
		resolver: schema ? zodResolver(schema) : undefined,
		mode: mode || 'onSubmit',
		defaultValues: mergedDefaultValues as any,
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		getValues,
	} = externalForm || internalForm;

	useEffect(() => {
		if (mergedDefaultValues && !isEqual(mergedDefaultValues, getValues())) {
			reset(mergedDefaultValues as any);
		}
	}, [mergedDefaultValues, reset, getValues]);

	const renderField = (field: AnyFormField<T>): ReactElement => {
		if (!isInputField(field)) {
			return typeof field.title === 'string' ? (
				<Title order={3}>{field.title}</Title>
			) : (
				(field.title as ReactElement)
			);
		}

		const commonProps = {
			label: field.label,
			placeholder: field.placeholder,
			required: field.required,
			disabled: field.disabled,
			error: errors[field.name]?.message as string,
			style: field.wrapperStyle,
			...field.customProps,
		};

		const getOrientationContainer = (orientation: 'horizontal' | 'vertical' = 'horizontal') =>
			orientation === 'vertical' ? Stack : Group;

		switch (field.type) {
			case 'select':
				return <Select data={field.options || []} {...commonProps} />;
			case 'date':
				return <DatePickerInput {...commonProps} valueFormat='DD/MM/YYYY' />;
			case 'custom': {
				const CustomComponent = customComponents?.[field.name] || field.component;
				return CustomComponent ? (
					<CustomComponent {...commonProps} />
				) : (
					<TextInput error='Missing custom component' />
				);
			}
			case 'password':
				return <PasswordInput {...defaultFieldProps} {...commonProps} {...field.customProps} />;
			case 'radio': {
				const orientation =
					(field.customProps?.orientation as 'horizontal' | 'vertical') || 'horizontal';
				const Container = getOrientationContainer(orientation);
				return (
					<Radio.Group {...commonProps}>
						<Container mt='xs' gap={gap}>
							{field.options?.map(option => (
								<Radio
									key={option.value}
									value={option.value}
									label={option.label}
									disabled={commonProps.disabled}
								/>
							))}
						</Container>
					</Radio.Group>
				);
			}
			case 'checkbox':
				return (
					<Checkbox {...commonProps} labelPosition='right' defaultChecked={field.defaultValue} />
				);
			case 'checkbox-group': {
				const orientation =
					(field.customProps?.orientation as 'horizontal' | 'vertical') || 'horizontal';
				const Container = getOrientationContainer(orientation);
				return (
					<Checkbox.Group {...commonProps}>
						<Container mt='xs' gap={orientation === 'vertical' ? 'xs' : undefined}>
							{field.options?.map(option => (
								<Checkbox
									key={option.value}
									value={option.value}
									label={option.label}
									disabled={commonProps.disabled}
								/>
							))}
						</Container>
					</Checkbox.Group>
				);
			}
			default:
				return (
					<TextInput
						type={field.type}
						{...defaultFieldProps}
						{...commonProps}
						{...field.customProps}
					/>
				);
		}
	};

	return (
		<form onSubmit={(e) => {
			e.preventDefault();
			handleSubmit(onSubmit)(e);
		}}>
			<Grid gutter={gridGutter} style={{ gap: spacing }}>
				{fields.map((field, index) => {
					const key = isInputField(field) ? (field.name as string) : `title-${index}`;
					return (
						<GridCol key={key} span={field.colSpan || 12}>
							{isInputField(field) ? (
								<Controller<FormValues>
									name={field.name}
									control={control}
									render={({ field: controllerField, fieldState }) => {
										const element = renderField(field);
										return cloneElement(element, {
											...controllerField,
											value: controllerField.value ?? '',
											error: fieldState.error?.message || element.props.error,
										});
									}}
								/>
							) : (
								renderField(field)
							)}
						</GridCol>
					);
				})}
			</Grid>

			<Group mt={spacing} justify='flex-end' w='100%'>
				{actions || (
					<>
						{onCancel && (
							<Button variant='outline' onClick={onCancel} color={color}>
								{cancelText}
							</Button>
						)}
						<Button type='submit' color={color}>
							{submitText}
						</Button>
					</>
				)}
			</Group>
		</form>
	);
};

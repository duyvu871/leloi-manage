export const STORAGE_KEYS = {
    REGISTRATION_FORM_DRAFT: 'registration_form_draft',
    LAST_SAVED: 'registration_form_last_saved'
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
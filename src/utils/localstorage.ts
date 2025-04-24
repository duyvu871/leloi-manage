import { DraftFormData } from '@/types/storage';
import { STORAGE_KEYS, StorageKey } from '@/constants/storage';

export function getLocalStorageItem<T>(key: StorageKey): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        // Special handling for date strings that might not be in proper JSON format
        if (key === STORAGE_KEYS.LAST_SAVED) {
            try {
                return new Date(item) as unknown as T;
            } catch (dateError) {
                console.error(`Error parsing date for "${key}":`, dateError);
                return null;
            }
        }

        const parsed = JSON.parse(item);
        
        // Handle Date objects
        if (parsed && typeof parsed === 'object') {
            const convertDates = (obj: any): any => {
                for (const key in obj) {
                    if (obj[key] && typeof obj[key] === 'object') {
                        if (obj[key]._isDateObject) {
                            obj[key] = new Date(obj[key].value);
                        } else {
                            convertDates(obj[key]);
                        }
                    }
                }
                return obj;
            };
            return convertDates(parsed);
        }
        
        return parsed;
    } catch (error) {
        console.error(`Error getting localStorage key "${key}":`, error);
        return null;
    }
}

export function setLocalStorageItem<T>(key: StorageKey, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
        // Special handling for LAST_SAVED
        if (key === STORAGE_KEYS.LAST_SAVED && value instanceof Date) {
            localStorage.setItem(key, value.toISOString());
            return;
        }
        
        // Handle Date objects
        const prepare = (obj: any): any => {
            if (obj instanceof Date) {
                return { _isDateObject: true, value: obj.toISOString() };
            }
            if (obj && typeof obj === 'object') {
                const newObj: any = Array.isArray(obj) ? [] : {};
                for (const key in obj) {
                    newObj[key] = prepare(obj[key]);
                }
                return newObj;
            }
            return obj;
        };

        const prepared = prepare(value);
        localStorage.setItem(key, JSON.stringify(prepared));
        
        // Update last saved timestamp
        if (key !== STORAGE_KEYS.LAST_SAVED) {
            localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
        }
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
}

export function removeLocalStorageItem(key: StorageKey): void {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
    }
}

export function clearAllDraftData(): void {
    Object.values(STORAGE_KEYS).forEach(key => removeLocalStorageItem(key));
}
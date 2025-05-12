import { atom } from 'jotai';
import { CreateStudentDto, CreateParentInfoDto, CreateCommitmentDto, CreatePriorityPointDto, CreateCompetitionResultDto } from '@/schemas/registration/dto';
import { CompetitionResult } from '@/types/points';
import { Application, Student, ParentInfo, PriorityPoint, Commitment } from '@/types/registration';

// Store for form submission status
export const isRegistrationSubmittingAtom = atom<boolean>(false);
export const registrationSuccessAtom = atom<boolean>(false);
export const registrationErrorAtom = atom<string | null>(null);

// Store current student registration data
export const currentStudentAtom = atom<Student | null>(null);

// Store parent info
export const parentInfoAtom = atom<ParentInfo | null>(null);

// Store application status
export const applicationAtom = atom<Application | null>(null);

// Store commitment data
export const commitmentAtom = atom<Commitment | null>(null);

// Store priority point data
export const priorityPointAtom = atom<PriorityPoint | null>(null);

// Store competition results
export const competitionResultsAtom = atom<CompetitionResult[]>([]);

// Academic record
// export const academicRecordAtom = atom<AcademicRecord | null>(null);

// Store for the complete registration submission data
export const registrationSubmissionDataAtom = atom<{
    student: CreateStudentDto | null;
    parentInfo: CreateParentInfoDto | null;
    commitment: CreateCommitmentDto | null;
    priorityPoint: CreatePriorityPointDto | null;
    competitionResults: CreateCompetitionResultDto[];
}>({
    student: null,
    parentInfo: null,
    commitment: null,
    priorityPoint: null,
    competitionResults: []
});

// Actions - Update student data
export const updateStudentAtom = atom(
    null,
    (get, set, updates: Partial<Student>) => {
        const currentStudent = get(currentStudentAtom);
        if (currentStudent) {
            set(currentStudentAtom, { ...currentStudent, ...updates });
        } else {
            console.error("Cannot update student: No current student");
        }
    }
);

// Actions - Update parent info
export const updateParentInfoAtom = atom(
    null,
    (get, set, updates: Partial<ParentInfo>) => {
        const parentInfo = get(parentInfoAtom);
        if (parentInfo) {
            set(parentInfoAtom, { ...parentInfo, ...updates });
        } else {
            console.error("Cannot update parent info: No parent info exists");
        }
    }
);

// Actions - Update commitment
export const updateCommitmentAtom = atom(
    null,
    (get, set, updates: Partial<Commitment>) => {
        const commitment = get(commitmentAtom);
        if (commitment) {
            set(commitmentAtom, { ...commitment, ...updates });
        } else {
            console.error("Cannot update commitment: No commitment exists");
        }
    }
);

// Actions - Update priority point
export const updatePriorityPointAtom = atom(
    null,
    (get, set, updates: Partial<PriorityPoint>) => {
        const priorityPoint = get(priorityPointAtom);
        if (priorityPoint) {
            set(priorityPointAtom, { ...priorityPoint, ...updates });
        } else {
            set(priorityPointAtom, { id: 0, studentId: 0, type: 'none', points: 0, createdAt: new Date(), updatedAt: new Date(), ...updates });
        }
    }
);

// Actions - Add competition result
export const addCompetitionResultAtom = atom(
    null,
    (get, set, result: CompetitionResult) => {
        const results = [...get(competitionResultsAtom)];
        set(competitionResultsAtom, [...results, result]);
    }
);

// Actions - Remove competition result
export const removeCompetitionResultAtom = atom(
    null,
    (get, set, resultId: string | number) => {
        const results = get(competitionResultsAtom).filter(r => 
            (typeof resultId === 'number' && 'id' in r && r.id !== resultId) || 
            (typeof resultId === 'string' && 'competitionId' in r && r.competitionId !== resultId)
        );
        set(competitionResultsAtom, results);
    }
);

// Actions - Update competition result
export const updateCompetitionResultAtom = atom(
    null,
    (get, set, { index, updates }: { index: number, updates: Partial<CompetitionResult> }) => {
        const results = [...get(competitionResultsAtom)];
        if (index >= 0 && index < results.length) {
            results[index] = { ...results[index], ...updates };
            set(competitionResultsAtom, results);
        } else {
            console.error(`Cannot update competition result: Invalid index ${index}`);
        }
    }
);

// Reset registration form
export const resetRegistrationAtom = atom(
    null,
    (_, set) => {
        set(currentStudentAtom, null);
        set(parentInfoAtom, null);
        set(commitmentAtom, null);
        set(priorityPointAtom, null);
        set(competitionResultsAtom, []);
        set(isRegistrationSubmittingAtom, false);
        set(registrationSuccessAtom, false);
        set(registrationErrorAtom, null);
    }
);

// Derived atom that tells if registration data is complete and valid
export const isRegistrationCompleteAtom = atom(
    (get) => {
        const student = get(currentStudentAtom);
        const parentInfo = get(parentInfoAtom);
        return !!(student && parentInfo);
    }
);

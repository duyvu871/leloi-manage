import { atom } from 'jotai';
import { ProfileResponse, StudentInfoDto, ParentInfoDto, ApplicationDto } from '@/schemas/auth/dto';
import { CompetitionResult } from '@/types/points';

// user atom
export const userAtom = atom<ProfileResponse | null>(null);
export const isLoadingAtom = atom<boolean>(true);

// check if user is parent
export const isParentAtom = atom<boolean>(
    (get) => get(userAtom)?.role === 'user'
);

// check if user is manager
export const isManagerAtom = atom<boolean>(
    (get) => get(userAtom)?.role === 'admin'
);

// Get parent info from user profile
export const parentInfoAtom = atom<ParentInfoDto | null>(
    (get) => get(userAtom)?.parentInfo || null
);

// Get all students from user profile
export const studentsAtom = atom<StudentInfoDto[]>(
    (get) => get(userAtom)?.students || []
);

// Get selected student index
export const selectedStudentIndexAtom = atom<number>(0);

// Get currently selected student
export const selectedStudentAtom = atom<StudentInfoDto | null>(
    (get) => {
        const students = get(studentsAtom);
        const index = get(selectedStudentIndexAtom);
        return students[index] || null;
    }
);

// Get currently selected student application
export const selectedStudentApplicationAtom = atom<ApplicationDto | null>(
    (get) => get(selectedStudentAtom)?.application || null
);

// Get currently selected student grades
export const selectedStudentGradesAtom = atom(
    (get) => get(selectedStudentAtom)?.grades || []
);

// Get currently selected student priority points
export const selectedStudentPriorityPointAtom = atom(
    (get) => get(selectedStudentAtom)?.priorityPoint || null
);

// Get currently selected student bonus points
export const selectedStudentBonusPointsAtom = atom(
    (get) => get(selectedStudentAtom)?.bonusPoints || []
);

// Get currently selected student commitment
export const selectedStudentCommitmentAtom = atom(
    (get) => get(selectedStudentAtom)?.commitment || null
);

// Get currently selected student competition results
export const selectedStudentCompetitionsAtom = atom(
    (get) => get(selectedStudentAtom)?.competitionResults || []
);

// Current user with update function
export const currentUserAtom = atom(
    (get) => get(userAtom),
    (get, set, updates: Partial<ProfileResponse>) => {
        const user = get(userAtom);
        if (user) {
            set(userAtom, { ...user, ...updates } as ProfileResponse);
        }
    }
);

// Update student information
export const updateStudentAtom = atom(
    null,
    (get, set, { index, updates }: { index: number, updates: Partial<StudentInfoDto> }) => {
        const user = get(userAtom);
        if (user && user.students[index]) {
            const updatedStudents = [...user.students];
            updatedStudents[index] = { ...updatedStudents[index], ...updates };
            set(userAtom, { ...user, students: updatedStudents });
        }
    }
);

// Update student application status
export const updateStudentApplicationAtom = atom(
    null,
    (get, set, { index, updates }: { index: number, updates: Partial<ApplicationDto> }) => {
        const user = get(userAtom);
        if (user && user.students[index]) {
            const updatedStudents = [...user.students];
            updatedStudents[index] = {
                ...updatedStudents[index],
                application: {
                    ...updatedStudents[index].application,
                    ...updates
                } as ApplicationDto
            };
            set(userAtom, { ...user, students: updatedStudents });
        }
    }
);

// Update student competition results
export const updateStudentCompetitionsAtom = atom(
    null,
    (get, set, { index, results }: { index: number, results: CompetitionResult[] }) => {
        const user = get(userAtom);
        if (user && user.students[index]) {
            const updatedStudents = [...user.students];
            updatedStudents[index] = {
                ...updatedStudents[index],
                competitionResults: results
            };
            set(userAtom, { ...user, students: updatedStudents });
        }
    }
);

// Update parent information
export const updateParentInfoAtom = atom(
    null,
    (get, set, updates: Partial<ParentInfoDto>) => {
        const user = get(userAtom);
        if (user) {
            set(userAtom, {
                ...user,
                parentInfo: {
                    ...user.parentInfo,
                    ...updates
                } as ParentInfoDto
            });
        }
    }
);
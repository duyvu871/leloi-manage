import { BonusPointConfig, Competition, PriorityType, CompetitionCategory } from '@/types/points';

export const COMPETITIONS: Competition[] = [
    {
        id: 'creativity-contest',
        name: 'Cuộc thi sáng tạo Thanh thiếu niên, nhi đồng',
        category: 'science',
        levels: ['city', 'national'],
        isActive: true,
        order: 1
    },
    {
        id: 'upu-letter',
        name: 'Cuộc thi viết thư Quốc tế UPU',
        category: 'literature',
        levels: ['city', 'national'],
        isActive: true,
        order: 2
    },
    {
        id: 'sports',
        name: 'Thi đấu TDTT',
        category: 'sports',
        levels: ['city', 'national'],
        isActive: true,
        order: 3
    },
    {
        id: 'english-olympiad',
        name: 'Olympic Tiếng Anh',
        category: 'academic',
        levels: ['city', 'national'],
        isActive: true,
        order: 4
    }
];

export const BONUS_POINTS_CONFIG: BonusPointConfig = {
    city: {
        first: 0.75,
        second: 0.5,
        third: 0.25
    },
    national: {
        first: 1.0,
        second: 0.75,
        third: 0.5
    }
};

export const PRIORITY_POINTS: Record<PriorityType, number> = {
    none: 0,
    type1: 2.0,  // Con liệt sĩ, thương binh mất sức ≥81%
    type2: 1.5,  // Con anh hùng LLVT, con Bà mẹ VN anh hùng, thương binh mất sức <81%
    type3: 1.0   // Học sinh hoặc cha/mẹ là người dân tộc thiểu số, vùng khó khăn
};

export const COMPETITION_CATEGORIES: Record<CompetitionCategory, string> = {
    academic: 'Học thuật',
    sports: 'Thể thao',
    arts: 'Nghệ thuật',
    literature: 'Văn học',
    science: 'Khoa học',
    technology: 'Công nghệ',
    other: 'Khác'
};

// Helper function to get competition by ID
export const getCompetitionById = (id: string): Competition | undefined => 
    COMPETITIONS.find(comp => comp.id === id);
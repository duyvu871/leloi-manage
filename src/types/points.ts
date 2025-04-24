export type AchievementLevel = 'none' | 'first' | 'second' | 'third';
export type CompetitionLevel = 'city' | 'national';

export interface Competition {
    id: string;
    name: string;
    description?: string;
    category: CompetitionCategory;
    levels: CompetitionLevel[];
    isActive: boolean;
    order: number;
}

export interface CompetitionResult {
    competitionId: string;
    level: CompetitionLevel;
    achievement: AchievementLevel;
    points: number;
    year: number;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    verificationDate?: Date;
    verifiedBy?: string;
}

export type CompetitionCategory = 
    | 'academic'      // Học thuật
    | 'sports'        // Thể thao
    | 'arts'          // Nghệ thuật
    | 'literature'    // Văn học
    | 'science'       // Khoa học
    | 'technology'    // Công nghệ
    | 'other';        // Khác

export interface BonusPoint {
    category: BonusPointCategory;
    level: CompetitionLevel;
    achievement: AchievementLevel;
    points: number;
}

export interface PriorityPoint {
    type: PriorityType;
    points: number;
    documents?: string[];  // Các giấy tờ minh chứng
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    verificationDate?: Date;
    verifiedBy?: string;
}

export type BonusPointCategory = 
    | 'creativityContest'     // Cuộc thi sáng tạo Thanh thiếu niên, nhi đồng
    | 'upuLetterContest'      // Cuộc thi viết thư Quốc tế UPU
    | 'sportsCompetition'     // Thi đấu TDTT
    | 'englishOlympiad';      // Olympic Tiếng Anh

export type PriorityType = 
    | 'none'      // Không có điểm ưu tiên
    | 'type1'     // Loại 1 (2.0 điểm)
    | 'type2'     // Loại 2 (1.5 điểm)
    | 'type3';    // Loại 3 (1.0 điểm)

export interface BonusPointConfig {
    city: {
        first: number;    // 0.75 điểm
        second: number;   // 0.5 điểm
        third: number;    // 0.25 điểm
    };
    national: {
        first: number;    // 1.0 điểm
        second: number;   // 0.75 điểm
        third: number;    // 0.5 điểm
    };
}
import { CompetitionResult, PriorityPoint, CompetitionLevel, AchievementLevel } from '@/types/points';
import { BONUS_POINTS_CONFIG, PRIORITY_POINTS, getCompetitionById } from '@/constants/points';
import { StudentInfoDto } from '@/schemas/auth/dto';

export function calculateCompetitionPoints(results: CompetitionResult[]): number {
    if (!results || results.length === 0) return 0;

    // Get the highest point among all competition results
    return Math.max(...results.map(result => result.points));
}

export function calculatePriorityPoints(priorityPoint: PriorityPoint | null): number {
    if (!priorityPoint) return 0;
    return PRIORITY_POINTS[priorityPoint.type] || 0;
}

export function getBonusPointValue(level: CompetitionLevel, achievement: AchievementLevel): number {
    if (achievement === 'none') return 0;
    return BONUS_POINTS_CONFIG[level][achievement];
}

export function calculateTotalPoints(student: StudentInfoDto): number {
    const competitionPoints = student.competitionResults ? calculateCompetitionPoints(student.competitionResults) : 0;
    const priorityPoints = student.priorityPoint ? calculatePriorityPoints(student.priorityPoint) : 0;
    
    return competitionPoints + priorityPoints;
}

export function getCompetitionName(competitionId: string): string {
    const competition = getCompetitionById(competitionId);
    return competition?.name || 'Không xác định';
}

export function formatPoints(points: number): string {
    return points.toFixed(2);
}
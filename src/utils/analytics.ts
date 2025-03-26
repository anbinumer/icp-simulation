import { ICPStatus, Decision, Outcome } from '../types';

interface GameState {
  score: number;
  bonusPoints: number;
  timeTaken: number;
  decisions: Decision[];
  icpStatus: ICPStatus;
  outcome: Outcome | null;
  totalPossibleScore: number;
}

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface AnalyticsPageView {
  path: string;
  title: string;
  referrer?: string;
}

interface AnalyticsUserData {
  userId?: string;
  traits?: Record<string, unknown>;
}

interface GameAnalytics {
  score: number;
  totalScore: number;
  timeTaken: number;
  decisions: number;
  outcome: string;
  completionRate: number;
}

export const trackGameCompletion = (gameState: GameState): void => {
  try {
    const analytics: GameAnalytics = {
      score: gameState.score + gameState.bonusPoints,
      totalScore: gameState.totalPossibleScore,
      timeTaken: gameState.timeTaken,
      decisions: gameState.decisions.length,
      outcome: gameState.outcome?.result || 'Incomplete',
      completionRate: (gameState.score / gameState.totalPossibleScore) * 100
    };
    
    // Log analytics data
    console.log('Game completion tracked:', analytics);
  } catch (error) {
    console.error('Error tracking game completion:', error);
  }
};
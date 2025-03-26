export type ICPStatus = "normal" | "elevated" | "critical" | "herniation";

export interface ScenarioOption {
  text: string;
  outcome: "Positive" | "Negative" | "Neutral";
  feedback: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  question: string;
  options: ScenarioOption[];
  doctorAdvice?: string;
}

export interface Decision {
  scenario: string;
  decision: ScenarioOption;
  timeToDecide: number;
  patientStatus: ICPStatus;
}

export interface Outcome {
  result: "Poor Outcome" | "Moderate Outcome" | "Excellent Outcome";
  description: string;
}

export interface GameState {
  patientName: string;
  age: number;
  occupation: string;
  doctorCallsRemaining: number;
  icpStatus: ICPStatus;
  gcsScore: number;
  bp: string;
  heartRate: number;
  respiratoryPattern: string;
  pupilRight: string;
  pupilLeft: string;
  motorResponse: string;
  currentStage: string;
  currentScenarioIndex: number;
  decisions: Decision[];
  gameOver: boolean;
  outcome: Outcome | null;
  showDoctorAdvice: boolean;
  doctorAdvice: string;
  showFeedback: boolean;
  lastDecision: Decision | null;
  score: number;
  totalPossibleScore: number;
  bonusPoints: number;
  timeTaken: number;
  gameStartTime: Date;
  decisionTimes: number[];
  showConfetti: boolean;
}

export interface BadgeInfo {
  badge: string;
  rank: string;
}
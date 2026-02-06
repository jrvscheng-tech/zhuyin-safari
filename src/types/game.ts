// Game state and type definitions

export type GamePhase = 'welcome' | 'playing' | 'complete';

export type GameType = 'imageMatching' | 'zhuyinSpelling' | 'zhuyinSorting';

export interface GameRound {
  type: GameType;
  questionId: string;
  completed: boolean;
  correct: boolean;
}

export interface GameState {
  phase: GamePhase;
  currentRoundIndex: number;
  rounds: GameRound[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface ImageMatchingProps {
  questionIds: string[];
  onComplete: (correct: boolean) => void;
  onAllComplete: () => void;
}

export interface ZhuyinSpellingProps {
  questionId: string;
  blanksCount: number;
  onComplete: (correct: boolean) => void;
}

export interface ZhuyinSortingProps {
  questionId: string;
  onComplete: (correct: boolean) => void;
}

// Session configuration
export const SESSION_CONFIG = {
  imageMatchingRounds: 3,
  spellingRounds: 2,
  sortingRounds: 1,
  starsPerCorrect: 1,
  maxStars: 6,
} as const;

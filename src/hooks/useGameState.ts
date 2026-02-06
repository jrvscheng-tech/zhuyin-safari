import { useState, useCallback } from 'react';
import { GameState, GamePhase, GameRound, GameType, SESSION_CONFIG } from '@/types/game';
import { getRandomQuestions, Question } from '@/data/questionBank';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'welcome',
    currentRoundIndex: 0,
    rounds: [],
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const initializeGame = useCallback(() => {
    // Get random questions for the session
    const totalNeeded = SESSION_CONFIG.imageMatchingRounds + 
                        SESSION_CONFIG.spellingRounds + 
                        SESSION_CONFIG.sortingRounds;
    
    const questions = getRandomQuestions(totalNeeded);
    setSelectedQuestions(questions);

    // Create rounds based on session config
    const rounds: GameRound[] = [];
    let questionIndex = 0;

    // Add image matching rounds
    for (let i = 0; i < SESSION_CONFIG.imageMatchingRounds; i++) {
      rounds.push({
        type: 'imageMatching',
        questionId: questions[questionIndex]?.id || '',
        completed: false,
        correct: false,
      });
      questionIndex++;
    }

    // Add spelling rounds
    for (let i = 0; i < SESSION_CONFIG.spellingRounds; i++) {
      rounds.push({
        type: 'zhuyinSpelling',
        questionId: questions[questionIndex]?.id || '',
        completed: false,
        correct: false,
      });
      questionIndex++;
    }

    // Add sorting rounds
    for (let i = 0; i < SESSION_CONFIG.sortingRounds; i++) {
      rounds.push({
        type: 'zhuyinSorting',
        questionId: questions[questionIndex]?.id || '',
        completed: false,
        correct: false,
      });
      questionIndex++;
    }

    setGameState({
      phase: 'playing',
      currentRoundIndex: 0,
      rounds,
      score: 0,
      totalQuestions: rounds.length,
      correctAnswers: 0,
    });
  }, []);

  const completeRound = useCallback((correct: boolean) => {
    setGameState(prev => {
      const updatedRounds = [...prev.rounds];
      updatedRounds[prev.currentRoundIndex] = {
        ...updatedRounds[prev.currentRoundIndex],
        completed: true,
        correct,
      };

      const newCorrectAnswers = correct ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newScore = correct ? prev.score + SESSION_CONFIG.starsPerCorrect : prev.score;
      const isLastRound = prev.currentRoundIndex >= prev.rounds.length - 1;

      return {
        ...prev,
        rounds: updatedRounds,
        correctAnswers: newCorrectAnswers,
        score: newScore,
        phase: isLastRound ? 'complete' : prev.phase,
        currentRoundIndex: isLastRound ? prev.currentRoundIndex : prev.currentRoundIndex + 1,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      phase: 'welcome',
      currentRoundIndex: 0,
      rounds: [],
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
    });
    setSelectedQuestions([]);
  }, []);

  const getCurrentRound = useCallback((): GameRound | null => {
    if (gameState.currentRoundIndex >= gameState.rounds.length) {
      return null;
    }
    return gameState.rounds[gameState.currentRoundIndex];
  }, [gameState.currentRoundIndex, gameState.rounds]);

  const getQuestionsForCurrentRound = useCallback((): Question[] => {
    const currentRound = getCurrentRound();
    if (!currentRound) return [];

    // For image matching, we need 3 questions
    if (currentRound.type === 'imageMatching') {
      return selectedQuestions.slice(0, 3);
    }

    // For other types, find the specific question
    const question = selectedQuestions.find(q => q.id === currentRound.questionId);
    return question ? [question] : [];
  }, [getCurrentRound, selectedQuestions]);

  return {
    gameState,
    selectedQuestions,
    initializeGame,
    completeRound,
    resetGame,
    getCurrentRound,
    getQuestionsForCurrentRound,
  };
}

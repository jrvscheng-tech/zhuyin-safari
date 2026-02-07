import { useGameState } from '@/hooks/useGameState';
import { WelcomeScreen } from './WelcomeScreen';
import { CompletionScreen } from './CompletionScreen';
import { ImageMatching } from './ImageMatching';
import { ZhuyinSpelling } from './ZhuyinSpelling';
import { ZhuyinSorting } from './ZhuyinSorting';
import { ProgressBar } from './ProgressBar';
import { StarDisplay } from './StarDisplay';
import { SESSION_CONFIG } from '@/types/game';

export function GameContainer() {
  const {
    gameState,
    selectedQuestions,
    initializeGame,
    completeRound,
    resetGame,
    getCurrentRound,
  } = useGameState();

  const currentRound = getCurrentRound();

  // Render based on game phase
  if (gameState.phase === 'welcome') {
    return <WelcomeScreen onStart={initializeGame} />;
  }

  if (gameState.phase === 'complete') {
    return (
      <CompletionScreen
        score={gameState.score}
        correctAnswers={gameState.correctAnswers}
        totalQuestions={gameState.totalQuestions}
        onRestart={resetGame}
      />
    );
  }

  // Playing phase
  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header with progress and score */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <StarDisplay 
            earned={gameState.score} 
            total={SESSION_CONFIG.maxStars} 
            size="sm" 
          />
        </div>
        <ProgressBar
          current={gameState.currentRoundIndex + 1}
          total={gameState.totalQuestions}
        />
      </div>

      {/* Game content */}
      <div className="max-w-4xl mx-auto">
        {currentRound?.type === 'imageMatching' && (
          <ImageMatching
            questions={selectedQuestions.slice(0, 3)}
            onComplete={(allCorrect) => {
              completeRound(allCorrect);
            }}
          />
        )}

        {currentRound?.type === 'zhuyinSpelling' && currentRound.questionId && (
          <ZhuyinSpelling
            question={selectedQuestions.find(q => q.id === currentRound.questionId)!}
            blanksCount={currentRound.blanksCount || 1}
            onComplete={(correct) => completeRound(correct)}
          />
        )}

        {currentRound?.type === 'zhuyinSorting' && currentRound.questionId && (
          <ZhuyinSorting
            question={selectedQuestions.find(q => q.id === currentRound.questionId)!}
            onComplete={(correct) => completeRound(correct)}
          />
        )}
      </div>
    </div>
  );
}

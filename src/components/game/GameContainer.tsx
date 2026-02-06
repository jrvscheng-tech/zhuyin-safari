import { useGameState } from '@/hooks/useGameState';
import { WelcomeScreen } from './WelcomeScreen';
import { CompletionScreen } from './CompletionScreen';
import { ImageMatching } from './ImageMatching';
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

        {currentRound?.type === 'zhuyinSpelling' && (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              注音拼寫遊戲
            </h2>
            <p className="text-muted-foreground">即將推出...</p>
            <button 
              onClick={() => completeRound(true)}
              className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-full"
            >
              跳過
            </button>
          </div>
        )}

        {currentRound?.type === 'zhuyinSorting' && (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              注音排序遊戲
            </h2>
            <p className="text-muted-foreground">即將推出...</p>
            <button 
              onClick={() => completeRound(true)}
              className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-full"
            >
              跳過
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { RotateCcw, PartyPopper, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarDisplay } from './StarDisplay';
import { SESSION_CONFIG } from '@/types/game';

interface CompletionScreenProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function CompletionScreen({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  onRestart 
}: CompletionScreenProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Fun messages based on performance
  const getMessage = () => {
    if (percentage === 100) return { text: '太厲害了！', emoji: '🎉' };
    if (percentage >= 80) return { text: '非常棒！', emoji: '🌟' };
    if (percentage >= 60) return { text: '做得很好！', emoji: '😊' };
    return { text: '繼續加油！', emoji: '💪' };
  };

  const message = getMessage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      {/* Confetti-like decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][i % 5],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 animate-slide-up">
        {/* Celebration icon */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <PartyPopper className="w-12 h-12 text-primary animate-bounce" />
          <span className="text-6xl">{message.emoji}</span>
          <PartyPopper className="w-12 h-12 text-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          {message.text}
        </h1>

        {/* Score display */}
        <div className="game-card p-8 mb-8 inline-block">
          <p className="text-lg text-muted-foreground mb-4">你獲得了</p>
          
          <StarDisplay 
            earned={score} 
            total={SESSION_CONFIG.maxStars} 
            size="lg" 
            animated 
            className="mb-6"
          />

          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
            <Heart className="w-6 h-6 text-accent fill-accent" />
            <span>{correctAnswers} / {totalQuestions} 答對</span>
          </div>
        </div>

        {/* Restart button */}
        <Button
          onClick={onRestart}
          size="lg"
          className="group px-10 py-7 text-xl font-bold rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-card hover:shadow-float transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="w-6 h-6 mr-3 group-hover:rotate-[-180deg] transition-transform duration-500" />
          再玩一次
        </Button>
      </div>
    </div>
  );
}

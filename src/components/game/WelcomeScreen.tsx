import { Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      {/* Floating decorations */}
      <div className="absolute top-20 left-10 animate-float opacity-60">
        <div className="w-16 h-16 rounded-full bg-accent/50" />
      </div>
      <div className="absolute top-32 right-16 animate-float opacity-40" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 rounded-full bg-secondary/60" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float opacity-50" style={{ animationDelay: '2s' }}>
        <div className="w-10 h-10 rounded-full bg-primary/30" />
      </div>

      {/* Main content */}
      <div className="relative z-10 animate-slide-up">
        {/* Title with sparkles */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-star-gold animate-sparkle" />
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight">
            ㄅㄆㄇ
          </h1>
          <Sparkles className="w-10 h-10 text-star-gold animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
          注音大冒險
        </h2>

        <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto">
          一起來學習注音符號吧！
        </p>

        {/* Start button */}
        <Button
          onClick={onStart}
          size="lg"
          className="group relative px-12 py-8 text-2xl font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-float hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Play className="w-8 h-8 mr-3 group-hover:scale-110 transition-transform" />
          開始遊戲
        </Button>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/30 to-transparent pointer-events-none" />
    </div>
  );
}

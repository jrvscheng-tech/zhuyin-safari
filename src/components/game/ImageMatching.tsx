import { useState, useCallback, useEffect } from 'react';
import { Question, shuffleArray } from '@/data/questionBank';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { playPickup, playDrop, playCorrect, playIncorrect } from '@/hooks/useSoundEffects';

interface ImageMatchingProps {
  questions: Question[];
  onComplete: (allCorrect: boolean) => void;
}

interface MatchState {
  questionId: string;
  matched: boolean;
  animating: boolean;
}

export function ImageMatching({ questions, onComplete }: ImageMatchingProps) {
  const [matches, setMatches] = useState<MatchState[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledTargets, setShuffledTargets] = useState<Question[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [incorrectShake, setIncorrectShake] = useState<string | null>(null);

  // Initialize game state
  useEffect(() => {
    const shuffledImages = shuffleArray(questions);
    const shuffledZhuyin = shuffleArray(questions);
    
    setShuffledQuestions(shuffledImages);
    setShuffledTargets(shuffledZhuyin);
    setMatches(questions.map(q => ({ 
      questionId: q.id, 
      matched: false,
      animating: false 
    })));
  }, [questions]);

  const handleDragStart = useCallback((e: React.DragEvent, questionId: string) => {
    setDraggedItem(questionId);
    e.dataTransfer.effectAllowed = 'move';
    const target = e.target as HTMLElement;
    target.classList.add('dragging');
    playPickup();
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove('dragging');
    setDraggedItem(null);
    setActiveTarget(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((targetId: string) => {
    setActiveTarget(targetId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setActiveTarget(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setActiveTarget(null);

    if (!draggedItem) return;

    // Check if it's a correct match
    if (draggedItem === targetId) {
      // Correct match!
      playCorrect();
      setMatches(prev => prev.map(m => 
        m.questionId === targetId 
          ? { ...m, matched: true, animating: true }
          : m
      ));

      // Remove animation flag after animation completes
      setTimeout(() => {
        setMatches(prev => prev.map(m => 
          m.questionId === targetId 
            ? { ...m, animating: false }
            : m
        ));
      }, 600);

      // Check if all matched
      setTimeout(() => {
        setMatches(prev => {
          const allMatched = prev.every(m => m.matched || m.questionId === targetId);
          if (allMatched || prev.filter(m => m.matched).length + 1 === prev.length) {
            onComplete(true);
          }
          return prev;
        });
      }, 800);
    } else {
      // Incorrect - trigger shake animation
      playIncorrect();
      setIncorrectShake(draggedItem);
      setTimeout(() => setIncorrectShake(null), 500);
    }

    setDraggedItem(null);
  }, [draggedItem, onComplete]);

  const getMatchState = (questionId: string) => {
    return matches.find(m => m.questionId === questionId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
        把圖片拖到正確的注音！
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Images to drag */}
        <div className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground font-semibold mb-2">圖片</p>
          <div className="flex flex-col gap-4 items-center">
            {shuffledQuestions.map((question) => {
              const matchState = getMatchState(question.id);
              const isMatched = matchState?.matched;
              const isAnimating = matchState?.animating;

              return (
                <div
                  key={question.id}
                  draggable={!isMatched}
                  onDragStart={(e) => handleDragStart(e, question.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-card flex items-center justify-center transition-all duration-300',
                    !isMatched && 'cursor-grab active:cursor-grabbing hover:scale-105 shadow-card hover:shadow-float',
                    isMatched && 'opacity-40 cursor-default',
                    isAnimating && 'animate-bounce-success',
                    incorrectShake === question.id && 'animate-wiggle',
                    draggedItem === question.id && 'scale-105 opacity-70 shadow-float'
                  )}
                >
                  <div className="text-6xl md:text-7xl">
                    {question.id === 'cat' && '🐱'}
                    {question.id === 'dog' && '🐕'}
                    {question.id === 'bird' && '🐦'}
                    {question.id === 'fish' && '🐟'}
                    {question.id === 'rabbit' && '🐰'}
                    {question.id === 'apple' && '🍎'}
                    {question.id === 'rice' && '🍚'}
                    {question.id === 'water' && '💧'}
                    {question.id === 'sun' && '☀️'}
                    {question.id === 'moon' && '🌙'}
                    {question.id === 'flower' && '🌸'}
                    {question.id === 'tree' && '🌳'}
                    {question.id === 'mama' && '👩'}
                    {question.id === 'baba' && '👨'}
                    {question.id === 'book' && '📚'}
                    {question.id === 'pen' && '✏️'}
                  </div>
                  {isMatched && (
                    <div className="absolute inset-0 flex items-center justify-center bg-success/20 rounded-3xl">
                      <Check className="w-12 h-12 text-success" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Zhuyin targets */}
        <div className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground font-semibold mb-2">注音</p>
          <div className="flex flex-col gap-4 items-center">
            {shuffledTargets.map((question) => {
              const matchState = getMatchState(question.id);
              const isMatched = matchState?.matched;
              const isActive = activeTarget === question.id;

              return (
                <div
                  key={`target-${question.id}`}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(question.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, question.id)}
                  className={cn(
                    'w-28 h-28 md:w-32 md:h-32 rounded-3xl flex items-center justify-center transition-all duration-300',
                    !isMatched && 'drop-zone',
                    isActive && !isMatched && 'active',
                    isMatched && 'correct bg-success/20 border-4 border-success'
                  )}
                >
                  <span className="text-3xl md:text-4xl font-bold zhuyin-text">
                    {question.zhuyin.join('')}
                  </span>
                  {isMatched && (
                    <Check className="absolute w-8 h-8 text-success" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

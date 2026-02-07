import { useState, useCallback, useEffect, useMemo } from 'react';
import { Question, shuffleArray } from '@/data/questionBank';
import { cn } from '@/lib/utils';
import { Check, ArrowRight } from 'lucide-react';
import { playPickup, playDrop, playCorrect, playIncorrect } from '@/hooks/useSoundEffects';

// Get emoji for question
function getEmoji(id: string): string {
  const emojiMap: Record<string, string> = {
    cat: '🐱', dog: '🐕', bird: '🐦', fish: '🐟', rabbit: '🐰',
    apple: '🍎', rice: '🍚', water: '💧',
    sun: '☀️', moon: '🌙', flower: '🌸', tree: '🌳',
    mama: '👩', baba: '👨',
    book: '📚', pen: '✏️',
  };
  return emojiMap[id] || '❓';
}

interface ZhuyinSortingProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

export function ZhuyinSorting({ question, onComplete }: ZhuyinSortingProps) {
  // The correct order of individual zhuyin characters
  const correctOrder = useMemo(() => {
    return question.zhuyin.join('').split('');
  }, [question.zhuyin]);

  const [scrambledCards, setScrambledCards] = useState<string[]>([]);
  const [placedCards, setPlacedCards] = useState<(string | null)[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<'pool' | 'slots' | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [incorrectSlots, setIncorrectSlots] = useState<Set<number>>(new Set());

  // Initialize
  useEffect(() => {
    const shuffled = shuffleArray([...correctOrder]);
    // Ensure it's actually shuffled (not same as correct)
    if (shuffled.join('') === correctOrder.join('') && correctOrder.length > 1) {
      const temp = shuffled[0];
      shuffled[0] = shuffled[shuffled.length - 1];
      shuffled[shuffled.length - 1] = temp;
    }
    setScrambledCards(shuffled);
    setPlacedCards(new Array(correctOrder.length).fill(null));
    setChecked(false);
    setIsCorrect(false);
    setIncorrectSlots(new Set());
  }, [correctOrder]);

  // Drag from pool
  const handlePoolDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
    setDragSource('pool');
    playPickup();
  }, []);

  // Drag from placed slots
  const handleSlotDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
    setDragSource('slots');
    playPickup();
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragSource(null);
    setActiveSlot(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleSlotDrop = useCallback((e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || dragSource === null || checked) return;

    if (dragSource === 'pool') {
      const card = scrambledCards[draggedIndex];
      // If slot already has a card, return it to pool
      setPlacedCards(prev => {
        const updated = [...prev];
        const existing = updated[slotIndex];
        updated[slotIndex] = card;
        // Return existing card to pool
        if (existing) {
          setScrambledCards(pool => [...pool, existing].filter((_, i) => i !== draggedIndex || existing !== null));
        }
        return updated;
      });
      setScrambledCards(prev => prev.filter((_, i) => i !== draggedIndex));
    } else if (dragSource === 'slots') {
      // Swap two placed cards
      setPlacedCards(prev => {
        const updated = [...prev];
        const temp = updated[slotIndex];
        updated[slotIndex] = updated[draggedIndex!];
        updated[draggedIndex!] = temp;
        return updated;
      });
    }

    playDrop();
    setDraggedIndex(null);
    setDragSource(null);
    setActiveSlot(null);
    setIncorrectSlots(new Set());
  }, [draggedIndex, dragSource, scrambledCards, checked]);

  // Drop back to pool
  const handlePoolDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null || dragSource !== 'slots' || checked) return;

    const card = placedCards[draggedIndex];
    if (card) {
      setPlacedCards(prev => {
        const updated = [...prev];
        updated[draggedIndex!] = null;
        return updated;
      });
      setScrambledCards(prev => [...prev, card]);
    }

    setDraggedIndex(null);
    setDragSource(null);
    setIncorrectSlots(new Set());
  }, [draggedIndex, dragSource, placedCards, checked]);

  // Check answer
  const handleCheck = useCallback(() => {
    const allPlaced = placedCards.every(c => c !== null);
    if (!allPlaced) return;

    const correct = placedCards.every((card, i) => card === correctOrder[i]);
    setChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playCorrect();
      setTimeout(() => onComplete(true), 1200);
    } else {
      playIncorrect();
      // Mark incorrect slots
      const wrong = new Set<number>();
      placedCards.forEach((card, i) => {
        if (card !== correctOrder[i]) wrong.add(i);
      });
      setIncorrectSlots(wrong);
      // Reset after delay
      setTimeout(() => {
        setChecked(false);
        setIncorrectSlots(new Set());
      }, 1200);
    }
  }, [placedCards, correctOrder, onComplete]);

  const allPlaced = placedCards.every(c => c !== null);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
        把注音排成正確順序！
      </h2>

      {/* Question display */}
      <div className={cn(
        "flex flex-col items-center gap-6 mb-10 transition-all duration-500",
        isCorrect && checked && "animate-bounce-success"
      )}>
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-card shadow-card flex items-center justify-center">
          <span className="text-7xl md:text-8xl">{getEmoji(question.id)}</span>
        </div>

        <div className="text-4xl md:text-5xl font-bold text-foreground">
          {question.display}
        </div>
      </div>

      {/* Answer slots */}
      <div className="flex items-center justify-center gap-2 md:gap-3 mb-8 flex-wrap">
        {placedCards.map((card, index) => (
          <div
            key={`slot-${index}`}
            draggable={!!card && !checked}
            onDragStart={() => card && handleSlotDragStart(index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={() => setActiveSlot(index)}
            onDragLeave={() => setActiveSlot(null)}
            onDrop={(e) => handleSlotDrop(e, index)}
            className={cn(
              "w-14 h-14 md:w-16 md:h-16 rounded-2xl border-3 flex items-center justify-center transition-all duration-300",
              !card && "border-dashed border-primary/50 bg-primary/10",
              !card && activeSlot === index && "border-primary bg-primary/20 scale-110",
              card && !checked && "border-solid border-border bg-card shadow-card cursor-grab active:cursor-grabbing",
              card && checked && isCorrect && "border-solid border-success bg-success/20",
              card && checked && !isCorrect && incorrectSlots.has(index) && "border-solid border-destructive bg-destructive/20 animate-wiggle",
              card && checked && !isCorrect && !incorrectSlots.has(index) && "border-solid border-success bg-success/20",
            )}
          >
            {card && (
              <span className={cn(
                "text-2xl md:text-3xl font-bold zhuyin-text",
                checked && isCorrect && "text-success",
                checked && !isCorrect && incorrectSlots.has(index) && "text-destructive",
                checked && !isCorrect && !incorrectSlots.has(index) && "text-success",
              )}>
                {card}
              </span>
            )}
            {card && checked && isCorrect && (
              <Check className="absolute w-5 h-5 text-success -top-2 -right-2" />
            )}
          </div>
        ))}
      </div>

      {/* Arrow hint */}
      <div className="flex justify-center mb-6">
        <ArrowRight className="w-6 h-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground ml-2">從左到右排列</span>
      </div>

      {/* Scrambled card pool */}
      <div
        onDragOver={handleDragOver}
        onDrop={handlePoolDrop}
        className="flex flex-wrap justify-center gap-3 md:gap-4 min-h-[4rem] mb-8"
      >
        {scrambledCards.map((card, index) => (
          <div
            key={`pool-${card}-${index}`}
            draggable={!checked}
            onDragStart={() => handlePoolDragStart(index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-card shadow-card flex items-center justify-center transition-all duration-200",
              !checked && "cursor-grab active:cursor-grabbing hover:scale-110 hover:shadow-float",
              checked && "opacity-50 cursor-default",
              draggedIndex === index && dragSource === 'pool' && "scale-110 opacity-60 shadow-float"
            )}
          >
            <span className="text-2xl md:text-3xl font-bold zhuyin-text">
              {card}
            </span>
          </div>
        ))}
      </div>

      {/* Check button */}
      {allPlaced && !isCorrect && (
        <div className="flex justify-center animate-pop-in">
          <button
            onClick={handleCheck}
            disabled={checked}
            className={cn(
              "px-8 py-3 rounded-full text-lg font-bold transition-all duration-300",
              "bg-primary text-primary-foreground hover:scale-105 hover:shadow-float",
              checked && "opacity-50 cursor-default"
            )}
          >
            確認！
          </button>
        </div>
      )}

      {/* Success message */}
      {isCorrect && (
        <div className="mt-4 text-center animate-pop-in">
          <p className="text-2xl font-bold text-success">
            排對了！🎉
          </p>
        </div>
      )}
    </div>
  );
}

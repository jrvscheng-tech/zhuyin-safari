import { useState, useCallback, useEffect, useMemo } from 'react';
import { Question, shuffleArray } from '@/data/questionBank';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

// All possible Zhuyin symbols for distractors
const ALL_ZHUYIN = [
  'ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ',
  'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ',
  'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ',
  'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ', 'ˊ', 'ˇ', 'ˋ', '˙'
];

interface ZhuyinSpellingProps {
  question: Question;
  blanksCount: number; // 1 or 2 blanks
  onComplete: (correct: boolean) => void;
}

interface BlankSlot {
  index: number;
  correctAnswer: string;
  filledAnswer: string | null;
  isCorrect: boolean | null;
}

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

export function ZhuyinSpelling({ question, blanksCount, onComplete }: ZhuyinSpellingProps) {
  const [blanks, setBlanks] = useState<BlankSlot[]>([]);
  const [availableCards, setAvailableCards] = useState<string[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize the game
  useEffect(() => {
    // Get all zhuyin characters from the question (flattened)
    const fullZhuyin = question.zhuyin.join('');
    const zhuyinChars = fullZhuyin.split('');
    
    // Determine which positions to blank out
    const blankPositions: number[] = [];
    const availablePositions = zhuyinChars.map((_, i) => i);
    const shuffledPositions = shuffleArray(availablePositions);
    
    for (let i = 0; i < Math.min(blanksCount, zhuyinChars.length); i++) {
      blankPositions.push(shuffledPositions[i]);
    }
    blankPositions.sort((a, b) => a - b);

    // Create blank slots
    const newBlanks: BlankSlot[] = blankPositions.map((pos) => ({
      index: pos,
      correctAnswer: zhuyinChars[pos],
      filledAnswer: null,
      isCorrect: null,
    }));
    setBlanks(newBlanks);

    // Create card options (correct answers + distractors)
    const correctAnswers = newBlanks.map(b => b.correctAnswer);
    const distractors = shuffleArray(
      ALL_ZHUYIN.filter(z => !correctAnswers.includes(z))
    ).slice(0, 4 - correctAnswers.length);
    
    const allCards = shuffleArray([...correctAnswers, ...distractors]);
    setAvailableCards(allCards);
    setCompleted(false);
    setShowSuccess(false);
  }, [question, blanksCount]);

  // Build the display with blanks
  const displayElements = useMemo(() => {
    const fullZhuyin = question.zhuyin.join('');
    const zhuyinChars = fullZhuyin.split('');
    const blankIndices = new Set(blanks.map(b => b.index));
    
    return zhuyinChars.map((char, index) => {
      const blank = blanks.find(b => b.index === index);
      if (blank) {
        return { type: 'blank' as const, blank, index };
      }
      return { type: 'char' as const, char, index };
    });
  }, [question.zhuyin, blanks]);

  const handleDragStart = useCallback((card: string) => {
    setDraggedCard(card);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
    setActiveSlot(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, blankIndex: number) => {
    e.preventDefault();
    if (!draggedCard || completed) return;

    const blank = blanks.find(b => b.index === blankIndex);
    if (!blank || blank.filledAnswer) return;

    const isCorrect = draggedCard === blank.correctAnswer;

    // Update blank with answer
    setBlanks(prev => prev.map(b => 
      b.index === blankIndex 
        ? { ...b, filledAnswer: draggedCard, isCorrect }
        : b
    ));

    // Remove card from available if correct
    if (isCorrect) {
      setAvailableCards(prev => prev.filter(c => c !== draggedCard));
    }

    setDraggedCard(null);
    setActiveSlot(null);

    // Check if all blanks are filled correctly
    setTimeout(() => {
      setBlanks(currentBlanks => {
        const allFilled = currentBlanks.every(b => b.filledAnswer !== null);
        const allCorrect = currentBlanks.every(b => b.isCorrect === true);
        
        if (allFilled) {
          if (allCorrect) {
            setShowSuccess(true);
            setCompleted(true);
            setTimeout(() => onComplete(true), 1000);
          } else {
            // Reset incorrect answers after a delay
            setTimeout(() => {
              setBlanks(prev => prev.map(b => 
                b.isCorrect === false 
                  ? { ...b, filledAnswer: null, isCorrect: null }
                  : b
              ));
            }, 800);
          }
        }
        return currentBlanks;
      });
    }, 100);
  }, [draggedCard, blanks, completed, onComplete]);

  const handleSlotClick = useCallback((blankIndex: number) => {
    const blank = blanks.find(b => b.index === blankIndex);
    if (blank?.filledAnswer && blank.isCorrect === false) {
      // Allow clicking to remove incorrect answer
      setBlanks(prev => prev.map(b => 
        b.index === blankIndex 
          ? { ...b, filledAnswer: null, isCorrect: null }
          : b
      ));
    }
  }, [blanks]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
        把注音拖到空格裡！
      </h2>

      {/* Question Image */}
      <div className={cn(
        "flex flex-col items-center gap-6 mb-10 transition-all duration-500",
        showSuccess && "animate-bounce-success"
      )}>
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-card shadow-card flex items-center justify-center">
          <span className="text-7xl md:text-8xl">{getEmoji(question.id)}</span>
        </div>

        {/* Chinese character display */}
        <div className="text-4xl md:text-5xl font-bold text-foreground">
          {question.display}
        </div>

        {/* Zhuyin with blanks */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {displayElements.map((element, i) => {
            if (element.type === 'char') {
              return (
                <span 
                  key={i} 
                  className="text-3xl md:text-4xl font-bold zhuyin-text px-2"
                >
                  {element.char}
                </span>
              );
            } else {
              const blank = element.blank;
              const isFilled = blank.filledAnswer !== null;
              const isCorrect = blank.isCorrect;
              
              return (
                <div
                  key={i}
                  onDragOver={handleDragOver}
                  onDragEnter={() => setActiveSlot(blank.index)}
                  onDragLeave={() => setActiveSlot(null)}
                  onDrop={(e) => handleDrop(e, blank.index)}
                  onClick={() => handleSlotClick(blank.index)}
                  className={cn(
                    "w-14 h-14 md:w-16 md:h-16 rounded-2xl border-3 border-dashed flex items-center justify-center transition-all duration-300",
                    !isFilled && "border-primary/50 bg-primary/10",
                    !isFilled && activeSlot === blank.index && "border-primary bg-primary/20 scale-110",
                    isFilled && isCorrect && "border-success bg-success/20 border-solid",
                    isFilled && isCorrect === false && "border-destructive bg-destructive/20 border-solid animate-wiggle cursor-pointer"
                  )}
                >
                  {isFilled && (
                    <span className={cn(
                      "text-2xl md:text-3xl font-bold zhuyin-text",
                      isCorrect && "text-success",
                      isCorrect === false && "text-destructive"
                    )}>
                      {blank.filledAnswer}
                    </span>
                  )}
                  {isFilled && isCorrect && (
                    <Check className="absolute w-5 h-5 text-success -top-2 -right-2" />
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Draggable cards */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {availableCards.map((card, index) => (
          <div
            key={`${card}-${index}`}
            draggable={!completed}
            onDragStart={() => handleDragStart(card)}
            onDragEnd={handleDragEnd}
            className={cn(
              "w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-card shadow-card flex items-center justify-center transition-all duration-200",
              !completed && "cursor-grab active:cursor-grabbing hover:scale-110 hover:shadow-float",
              completed && "opacity-50 cursor-default",
              draggedCard === card && "scale-110 opacity-60 shadow-float"
            )}
          >
            <span className="text-2xl md:text-3xl font-bold zhuyin-text">
              {card}
            </span>
          </div>
        ))}
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="mt-8 text-center animate-pop-in">
          <p className="text-2xl font-bold text-success">
            太棒了！🎉
          </p>
        </div>
      )}
    </div>
  );
}

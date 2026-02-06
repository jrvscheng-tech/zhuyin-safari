// Question Bank Data Structure for Zhuyin Learning App
// Each question has: id, image path, zhuyin array, display character, and category

export interface Question {
  id: string;
  image: string;
  zhuyin: string[];
  display: string;
  category: 'animals' | 'daily' | 'food' | 'family' | 'nature';
}

export const questionBank: Question[] = [
  // Animals
  {
    id: 'cat',
    image: '/images/cat.png',
    zhuyin: ['ㄇㄠ'],
    display: '貓',
    category: 'animals',
  },
  {
    id: 'dog',
    image: '/images/dog.png',
    zhuyin: ['ㄍㄡˇ'],
    display: '狗',
    category: 'animals',
  },
  {
    id: 'bird',
    image: '/images/bird.png',
    zhuyin: ['ㄋㄧㄠˇ'],
    display: '鳥',
    category: 'animals',
  },
  {
    id: 'fish',
    image: '/images/fish.png',
    zhuyin: ['ㄩˊ'],
    display: '魚',
    category: 'animals',
  },
  {
    id: 'rabbit',
    image: '/images/rabbit.png',
    zhuyin: ['ㄊㄨˋ', 'ㄗˇ'],
    display: '兔子',
    category: 'animals',
  },
  // Food
  {
    id: 'apple',
    image: '/images/apple.png',
    zhuyin: ['ㄆㄧㄥˊ', 'ㄍㄨㄛˇ'],
    display: '蘋果',
    category: 'food',
  },
  {
    id: 'rice',
    image: '/images/rice.png',
    zhuyin: ['ㄈㄢˋ'],
    display: '飯',
    category: 'food',
  },
  {
    id: 'water',
    image: '/images/water.png',
    zhuyin: ['ㄕㄨㄟˇ'],
    display: '水',
    category: 'food',
  },
  // Nature
  {
    id: 'sun',
    image: '/images/sun.png',
    zhuyin: ['ㄊㄞˋ', 'ㄧㄤˊ'],
    display: '太陽',
    category: 'nature',
  },
  {
    id: 'moon',
    image: '/images/moon.png',
    zhuyin: ['ㄩㄝˋ', 'ㄌㄧㄤˋ'],
    display: '月亮',
    category: 'nature',
  },
  {
    id: 'flower',
    image: '/images/flower.png',
    zhuyin: ['ㄏㄨㄚ'],
    display: '花',
    category: 'nature',
  },
  {
    id: 'tree',
    image: '/images/tree.png',
    zhuyin: ['ㄕㄨˋ'],
    display: '樹',
    category: 'nature',
  },
  // Family
  {
    id: 'mama',
    image: '/images/mama.png',
    zhuyin: ['ㄇㄚ', 'ㄇㄚ'],
    display: '媽媽',
    category: 'family',
  },
  {
    id: 'baba',
    image: '/images/baba.png',
    zhuyin: ['ㄅㄚˋ', 'ㄅㄚ'],
    display: '爸爸',
    category: 'family',
  },
  // Daily Items
  {
    id: 'book',
    image: '/images/book.png',
    zhuyin: ['ㄕㄨ'],
    display: '書',
    category: 'daily',
  },
  {
    id: 'pen',
    image: '/images/pen.png',
    zhuyin: ['ㄅㄧˇ'],
    display: '筆',
    category: 'daily',
  },
];

// Utility function to shuffle an array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random questions for a game session
export function getRandomQuestions(count: number): Question[] {
  const shuffled = shuffleArray(questionBank);
  return shuffled.slice(0, count);
}

// Get questions by category
export function getQuestionsByCategory(category: Question['category']): Question[] {
  return questionBank.filter(q => q.category === category);
}

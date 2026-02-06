# 注音大冒險 (Zhuyin Adventure)

A beautiful, Ghibli-inspired Zhuyin (Bopomofo) learning web app designed for children aged 5-7.

## ✨ Features

- **Image Matching**: Drag and drop images to match with their correct Zhuyin pronunciation
- **Zhuyin Spelling**: Fill in missing Zhuyin characters (coming soon)
- **Zhuyin Sorting**: Reorder scrambled Zhuyin cards (coming soon)
- **Kid-friendly UI**: Large touch targets, fun animations, and encouraging feedback
- **No backend required**: Pure frontend, anonymous, in-memory state only
- **Privacy-first**: No localStorage, cookies, or analytics

## 🎮 How to Play

1. Click "開始遊戲" (Start Game) to begin
2. **Image Matching**: Drag each picture to the matching Zhuyin box
3. Complete all rounds to see your stars!
4. Press "再玩一次" (Play Again) to restart

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or bun

### Install dependencies

```bash
npm install
# or
bun install
```

### Start development server

```bash
npm run dev
# or
bun dev
```

### Build for production

```bash
npm run build
# or
bun run build
```

### Deploy to GitHub Pages

1. Update `vite.config.ts` with your repository name as base path
2. Build the project
3. Deploy the `dist` folder to GitHub Pages

## 📁 Project Structure

```
src/
├── components/
│   └── game/           # Game components
├── data/
│   └── questionBank.ts # Question data and utilities
├── hooks/
│   └── useGameState.ts # Game state management
├── types/
│   └── game.ts         # TypeScript types
└── pages/
    └── Index.tsx       # Main page
```

## 🎨 Design

- **Theme**: Studio Ghibli-inspired, soft pastels
- **Colors**: Sky blue backgrounds, warm cream cards, sunset orange accents
- **Typography**: Nunito font family
- **Animations**: Bounce, wiggle, float, and pop-in effects

## 📝 License

MIT

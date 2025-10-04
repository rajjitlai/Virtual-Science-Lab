# 🧪 Virtual Science Lab

A browser-based **interactive science playground** where you can mix chemicals, run physics experiments, and ask AI for explanations.

## 🚀 Features (MVP)
- 🧪 **Chemistry Sandbox** – Mix simple chemicals, watch bubbling/fizz reactions.
- ⚡ **Physics Sandbox** – Drop balls/blocks, experiment with gravity and collisions.
- 🤖 **AI Lab Assistant** – Ask questions like "What happens if I mix vinegar and baking soda?" (powered by GPT).

## 🛠️ Tech Stack
- **React + Vite** – Frontend framework
- **Three.js / Matter.js** – 3D visualization & physics
- **Gemini API** – AI assistant (optional)
- **Tailwind CSS** – Styling
- **TypeScript** – Type safety
- **Appwrite** – Backend and DB with user authentication & AI assistant (optional)

## 📦 Installation
Follow [setup.md](./setup.md) for detailed instructions.

## 🎮 Usage
1. Open http://localhost:3000
2. Select **Chemistry** or **Physics** mode.
3. Interact with objects, mix chemicals, and have fun!
4. (Optional) Ask the **AI Lab Assistant** questions.

## 🔮 Future Improvements
- Add circuits & electricity experiments.
- More realistic chemical reactions.
- Multiplayer shared labs.
- VR/AR support.

## 🏆 Hackathon Pitch
_"A fun, interactive, and educational virtual science lab — accessible in your browser. Learn, play, and explore science like never before."_

## 📁 Project Structure
```
virtual-science-lab/
├── src/
│   ├── components/
│   │   ├── chemistry/
│   │   └── physics/
│   ├── assets/
│   └── App.tsx
├── index.html
├── vite.config.ts
└── package.json
```

## 🧪 Current Implementation
The project currently includes:
- A tabbed interface for switching between Chemistry and Physics labs
- Basic components for each lab type
- Tailwind CSS for styling
- TypeScript for type safety
- Vite for fast development
- Basic testing setup with Vitest

## 🚀 Getting Started
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open http://localhost:3000 in your browser
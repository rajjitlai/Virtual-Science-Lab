# 🧪 Virtual Science Lab

A browser-based **interactive science playground** where you can mix chemicals, run physics experiments, and ask AI for explanations.

## 🚀 Features (MVP)
- 🧪 **Chemistry Sandbox** – Mix simple chemicals, watch bubbling/fizz reactions.
- ⚡ **Physics Sandbox** – Drop balls/blocks, experiment with gravity and collisions.
- 🤖 **AI Lab Assistant** – Ask questions like "What happens if I mix vinegar and baking soda?" (powered by GPT).
- 👤 **User Authentication** – Register, login, and manage user profiles with Appwrite.
- 🌗 **Theme Switching** – Light/dark mode with system preference detection.
- ⚙️ **User Settings** – Customize theme, avatar, and notification preferences.
- 💬 **AI Chat History** – Save and review previous AI assistant conversations.
- 🔐 **Multiple Authentication Methods** – Email/Password and Magic URL login options.

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
2. Register or login to your account using your preferred authentication method:
   - Email/Password
   - Magic URL
3. Select **Chemistry** or **Physics** mode.
4. Interact with objects, mix chemicals, and have fun!
5. Ask the **AI Lab Assistant** questions during experiments.
6. View your **Chat History** to review previous conversations.
7. Customize your experience in **User Settings**.

## 🔮 Future Improvements
- Add circuits & electricity experiments.
- More realistic chemical reactions.
- Multiplayer shared labs.
- VR/AR support.
- Save experiments and results to user profiles.
- Real-time experiment collaboration.

## 🏆 Hackathon Pitch
_"A fun, interactive, and educational virtual science lab — accessible in your browser. Learn, play, and explore science like never before."_

## 📁 Project Structure
```
virtual-science-lab/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── ai/
│   │   ├── chemistry/
│   │   ├── physics/
│   │   └── settings/
│   ├── config/
│   ├── contexts/
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
- Tailwind CSS for styling with dark mode support
- TypeScript for type safety
- Vite for fast development
- Basic testing setup with Vitest
- **Appwrite authentication system** with multiple login options:
  - Email/Password authentication
  - Magic URL authentication
- **User settings management** with theme switching
- **AI chat history** functionality
- **Responsive design** for all device sizes

## 🔐 Authentication Implementation
The authentication system uses Appwrite for user management and supports multiple authentication methods:
- **Email/Password**: Traditional email and password login
- **Magic URL**: Passwordless authentication via email link
- **Session Management**: Persistent user sessions
- **User Profile**: Display and manage user information
- **Protected Routes**: Labs are only accessible to authenticated users

## 🎨 Theme System
- Light/dark theme switching
- System preference detection
- Theme persistence in user settings
- Full dark mode support for all components

## 🤖 AI Assistant Features
- In-context question asking during experiments
- Chat history tracking and storage
- Integration with Gemini API for intelligent responses

## 🚀 Getting Started
1. Clone the repository
2. Run `npm install` to install dependencies
3. Set up your Appwrite project and update environment variables in `.env`
4. Run `npm run dev` to start the development server
5. Open http://localhost:3000 in your browser

## ⚙️ Environment Configuration
Create a `.env` file in the root directory with your Appwrite configuration:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
VITE_GEMINI_API_KEY=your-gemini-api-key
```
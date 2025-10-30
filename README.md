# 🧪 Virtual Science Lab

<div align="center">

![Virtual Science Lab](https://img.shields.io/badge/Virtual%20Science%20Lab-v1.0.1-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, interactive science laboratory application built with React, TypeScript, and Three.js**

Explore chemistry and physics through hands-on virtual experiments with an AI-powered assistant.

[Live Demo](https://virtual-science-lab.appwrite.network) · [Report Bug](https://github.com/rajjitlai/Virtual-Science-Lab/issues) · [Request Feature](https://github.com/rajjitlai/Virtual-Science-Lab/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Setup](#-api-setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🔬 About

Virtual Science Lab is an educational web application that democratizes science education by providing a safe, accessible, and cost-free platform for conducting virtual experiments. Whether you're a student, teacher, or curious learner, this platform enables hands-on exploration of chemistry and physics concepts without the need for physical equipment.

### Why Virtual Science Lab?

- **Accessible**: No equipment needed, just a web browser
- **Safe**: Experiment without real-world risks
- **Interactive**: Visual, hands-on learning experience with 3D simulations
- **AI-Powered**: Get instant explanations and guidance
- **Free & Open Source**: Available to everyone, everywhere

---

## ✨ Features

### 🧪 Chemistry Lab

- Interactive 3D beaker with realistic liquid visualization
- Mix common chemicals (water, vinegar, baking soda, salt, sugar, lemon juice)
- Watch real-time reactions with bubbling effects and color changes
- Save and load your favorite chemical mixtures
- Learn about pH levels and chemical properties

### ⚡ Physics Lab

- Real physics engine powered by Matter.js
- Adjustable gravity settings (0g to 3g)
- Planet presets: Earth 🌍, Moon 🌙, Mars 🔴, Jupiter 🪐, Zero-G 🚀
- Drop multiple objects (balls and boxes) with different masses
- Live collision detection and kinetic energy tracking

### 🤖 AI Lab Assistant

- Powered by OpenRouter API (google/gemma-3n-e2b-it:free model)
- Context-aware responses based on current lab
- Conversation memory and history
- Quick question prompts to get started
- Educational explanations in simple terms
- Rate limiting protection and token management

### 💬 Chat History

- Auto-save all AI conversations to Appwrite database
- Searchable conversation archive
- View context tags for each chat
- Delete individual chats or clear all history

### ⚙️ User Settings

- Theme switching: Light, Dark, or System mode
- User profile and statistics
- Toggle notifications and sound effects
- Auto-save experiments preference
- Choose default startup lab
- Access Terms & Conditions and Privacy Policy

### 🔐 Authentication

- Email/Password login
- Secure session management with Appwrite
- Personalized user experience

---

## 🛠️ Tech Stack

### Frontend

- **React 18.3** - UI library
- **TypeScript 5.0** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### 3D & Physics

- **Three.js** - 3D graphics engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components
- **Matter.js** - 2D physics engine

### Backend & Services

- **Appwrite** - Authentication and database (cloud-only storage)
- **OpenRouter API** - AI assistant (google/gemma-3n-e2b-it:free model)
- **Vite Proxy** - Handles CORS for AI API requests

### Development

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rajjitlai/Virtual-Science-Lab.git
   cd Virtual-Science-Lab
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Appwrite Configuration
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id
   VITE_APPWRITE_DATABASE_ID=your-database-id
   VITE_APPWRITE_CHAT_COLLECTION_ID=your-chat-collection-id
   VITE_APPWRITE_MIXTURES_COLLECTION_ID=your-mixtures-collection-id
   VITE_APPWRITE_USER_DATA_COLLECTION_ID=your-user-data-collection-id

   # OpenRouter API
   VITE_OPENROUTER_API_KEY=your-openrouter-api-key
   ```

   See [API Setup](#-api-setup) for detailed instructions.

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

6. **Build for production**

   ```bash
   npm run build
   ```

---

## 🔑 API Setup

### Appwrite Setup

1. **Create Account**: Go to [cloud.appwrite.io](https://cloud.appwrite.io/) and sign up

2. **Create Project**: Name it "Virtual Science Lab" and copy the Project ID

3. **Enable Authentication**:

   - Go to Auth → Settings
   - Enable Email/Password

4. **Create Database**: Name it "Virtual Science Lab" and copy the Database ID

5. **Create Collections** with the following attributes:

   **Chat Sessions Collection**:

   - `userId` (string, required)
   - `message` (string, required)
   - `response` (string, required)
   - `model` (string)
   - `lab` (string)

   **Mixtures Collection**:

   - `userId` (string, required)
   - `chemicals` (string array)
   - `name` (string)

   **User Data Collection**:

   - `userId` (string, required)
   - `type` (string, required) - For tour data
   - `isTourShown` (boolean)

   **User Settings Collection**:

   - `userId` (string, required)
   - `theme` (string)
   - `notifications` (boolean)
   - `soundEffects` (boolean)
   - `autoSaveExperiments` (boolean)
   - `defaultLab` (string)

   **User Analytics Collection**:

   - `userId` (string, required)
   - `experimentsRun` (integer)
   - `aiQuestionsAsked` (integer)
   - `timeSpent` (integer)
   - `favoriteLab` (string)
   - `lastActivity` (string)

6. **Set Permissions**: For each collection, set Read and Write permissions to "Any"

7. **Add Platform**:
   - Go to Settings → Platforms
   - Add Web platform
   - Add `http://localhost:5173` for development
   - Add your production URL when deploying

### OpenRouter API Setup

1. **Create Account**: Go to [openrouter.ai](https://openrouter.ai/) and sign up

2. **Get API Key**: Navigate to API Keys section and generate a new key

3. **Add to .env**: Copy the API key to your `.env` file

> **Note**: All data is stored in Appwrite database with no localStorage fallback. The application requires all environment variables to be properly configured.

---

## 💡 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or log in with existing credentials

2. **Explore Chemistry Lab**:

   - Click the 🧪 Chemistry tab
   - Select chemicals to mix in the 3D beaker
   - Watch reactions occur in real-time
   - Save interesting mixtures for later

3. **Experiment with Physics**:

   - Click the ⚡ Physics tab
   - Add balls or boxes
   - Adjust gravity or use planet presets
   - Observe collisions and energy changes

4. **Ask the AI Assistant**:

   - Click the 🤖 floating button
   - Type your science question
   - Get instant, educational explanations
   - Conversations auto-save to your account

5. **Review Chat History**:

   - Click the 💬 icon in navbar
   - Browse all past conversations
   - Click any chat to view details

6. **Customize Settings**:
   - Click the ⚙️ icon in navbar
   - Change theme and preferences
   - Set your default lab
   - View app information and legal documents

---

## 📁 Project Structure

```
virtual-science-lab/
├── src/
│   ├── assets/                # Static assets
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   └── Login.tsx      # Login/Register page
│   │   ├── ai/                # AI assistant components
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── AIButton.tsx
│   │   │   └── ChatHistory.tsx
│   │   ├── chemistry/         # Chemistry lab components
│   │   │   ├── Beaker.tsx     # 3D beaker visualization
│   │   │   ├── ChemistryScene.tsx
│   │   │   └── ChemistryLab.tsx
│   │   ├── physics/           # Physics lab components
│   │   │   ├── PhysicsEngine.tsx
│   │   │   └── PhysicsLab.tsx
│   │   ├── settings/          # Settings components
│   │   │   └── Settings.tsx
│   │   └── common/            # Shared components
│   │       ├── LoadingScreen.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Toast.tsx
│   │       └── WelcomeTour.tsx
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx    # Authentication state
│   │   ├── ThemeContext.tsx   # Theme management
│   │   ├── ChatHistoryContext.tsx
│   │   └── ToastContext.tsx
│   ├── config/                # Configuration files
│   │   ├── appwrite.ts        # Appwrite setup
│   │   └── ai-service.ts      # AI assistant setup
│   ├── types/                 # TypeScript types
│   │   ├── chemistry.ts
│   │   ├── physics.ts
│   │   ├── chat.ts
│   │   └── settings.ts
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # App entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── tailwind.config.js         # Tailwind config
└── README.md                  # This file
```

---

## 🌐 Deployment

The application is deployed on Appwrite Cloud and can be accessed at:

**Live Demo**: [https://virtual-science-lab.appwrite.network](https://virtual-science-lab.appwrite.network)

### Deploy Your Own

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Deploy to Appwrite**:
   - Follow [Appwrite deployment guide](https://appwrite.io/docs/products/sites)
   - Update platform URLs in Appwrite console
   - Set environment variables in deployment settings

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow React best practices
- Write meaningful commit messages
- Test on multiple browsers
- Update documentation as needed

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

```
MIT License

Copyright (c) 2025 Rajjit Laishram

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📞 Contact

**Rajjit Laishram** - Developer

- Email: rajjitlai@mail.com
- GitHub: [@rajjitlai](https://github.com/rajjitlai)
- LinkedIn: [Rajjit Laishram](https://linkedin.com/in/rajjitlaishram)
- Twitter: [@rajjitlai](https://twitter.com/rajjitlai)
- Portfolio: [rajjitlaishram.netlify.app](https://rajjitlaishram.netlify.app)

**Project Links**:

- Repository: [https://github.com/rajjitlai/Virtual-Science-Lab](https://github.com/rajjitlai/Virtual-Science-Lab)
- Live Demo: [https://virtual-science-lab.appwrite.network](https://virtual-science-lab.appwrite.network)
- Demo Video: [https://youtu.be/hBlfk4_5ujM](https://youtu.be/hBlfk4_5ujM)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Three.js](https://threejs.org/) - 3D graphics
- [Matter.js](https://brm.io/matter-js/) - Physics engine
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Appwrite](https://appwrite.io/) - Backend platform
- [OpenRouter](https://openrouter.ai/) - AI API access
- Science educators worldwide for inspiration

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ for science education**

[🔝 Back to Top](#-virtual-science-lab)

</div>

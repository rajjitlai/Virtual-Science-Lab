# 🧪 Virtual Science Lab

A modern, interactive science laboratory application built with React, TypeScript, and Three.js. Explore chemistry and physics through hands-on virtual experiments with an AI-powered assistant.

## 🌟 Features

### 🧪 Chemistry Lab

- **Interactive 3D Beaker**: Mix chemicals and watch reactions in real-time
- **Realistic Reactions**: See bubbling effects, color changes, and more
- **Chemical Database**: Pre-loaded with common chemicals (water, vinegar, baking soda, etc.)
- **Custom Chemicals**: Add your own chemicals with AI-generated properties
- **Mixture Storage**: Save and load your favorite chemical combinations
- **Reaction Detection**: Automatic detection of common chemical reactions
- **Sound Effects**: Auditory feedback for interactions

### ⚡ Physics Lab

- **Interactive Physics Engine**: Drop objects and watch them collide
- **Adjustable Gravity**: Change gravity settings to simulate different planets
- **Material Properties**: Objects with different bounce and friction properties
- **Real-time Simulation**: Physics calculations updated in real-time

### 🤖 AI Assistant

- **Context-Aware**: Knows which lab you're in
- **Conversation Memory**: Remembers your discussion
- **Quick Questions**: Pre-written prompts to get started
- **Educational Focus**: Explains concepts in simple terms

### 💬 Chat History

- **Auto-Save Conversations**: Never lose your discussions
- **Cloud Storage Only**: All data stored in Appwrite database (no localStorage fallback)
- **Searchable Archive**: Review past conversations
- **Delete Options**: Remove individual chats or clear all

### ⚙️ User Settings

- **Cloud Storage**: All settings stored in Appwrite database
- **Theme Preferences**: Light, dark, or system theme
- **Notification Controls**: Enable/disable notifications
- **Sound Settings**: Toggle sound effects on/off
- **Auto-save Experiments**: Automatically save your work
- **Default Lab Selection**: Choose your preferred lab at startup

### 📊 User Analytics

- **Usage Tracking**: Monitor your experiments and AI interactions
- **Time Tracking**: See how much time you've spent learning
- **Lab Preferences**: Identify your favorite science areas
- **Cloud Storage**: All analytics stored in Appwrite database

### 🔊 Sound System

- **Interactive Audio Feedback**: Sound effects for all lab interactions
- **Configurable**: Toggle sound effects on/off in settings
- **Context-Aware Sounds**: Different sounds for different actions

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/          # AI assistant components
│   ├── auth/        # Authentication components
│   ├── chemistry/   # Chemistry lab components
│   ├── common/      # Shared components
│   ├── physics/     # Physics lab components
│   └── settings/    # Settings components
├── config/          # Configuration files
├── contexts/        # React context providers
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── assets/          # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/virtual-science-lab.git
   cd virtual-science-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env` with the following keys (or copy from the block below):
   ```env
   # Appwrite Configuration
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=
   VITE_APPWRITE_DATABASE_ID=
   VITE_APPWRITE_CHAT_COLLECTION_ID=
   VITE_APPWRITE_MIXTURES_COLLECTION_ID=
   VITE_APPWRITE_USER_DATA_COLLECTION_ID=

   # OpenRouter API
   VITE_OPENROUTER_API_KEY=
   ```

Edit the `.env` file with your API keys (see [API Keys Setup](#-api-keys-setup))

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Technologies Used

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components
- **Matter.js** - 2D physics engine
- **Web Audio API** - Sound effects

### Backend & Services

- **Appwrite** - Authentication and backend (required database for all data storage)
- **OpenRouter API** - AI assistant (google/gemma-3n-e2b-it:free model)
- **Vite Proxy** - Handles CORS for AI API requests

### Development

- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🎮 Usage Guide

### 1. Sign In

- Click the **Login** button
- Sign in with email/password or magic URL
- Create an account if you don't have one

### 2. Explore the Labs

- **Chemistry Lab**: Mix chemicals in a 3D beaker
- **Physics Lab**: Drop objects and adjust gravity

### 3. Use the AI Assistant

- Click the **🤖 button** in the bottom right
- Type your science question
- Get instant, educational explanations
- The AI uses the OpenRouter API with the google/gemma-3n-e2b-it:free model
- Conversation is auto-saved when you close it

### 4. Review Chat History

- Click the **💬 icon** in the navbar
- View all past conversations
- Click any chat to see full details
- Delete individual chats or clear all
- All chat history is stored in the cloud via Appwrite

### 5. Manage Chemical Mixtures

- In the Chemistry Lab, mix chemicals using the provided buttons
- Click **Save Mixture** to store your combination
- View saved mixtures in the **Recent Mixtures** section
- Click any mixture to load it back into the beaker

### 6. Customize Settings

- Click the **⚙️ icon** in the navbar
- Switch between light/dark/system theme
- Toggle preferences (notifications, sound effects)
- Choose your default lab
- Control welcome tour visibility

---

## 🔑 API Keys Setup

### Appwrite Setup

1. **Create Account**
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io/)
   - Sign up for a free account

2. **Create Project**
   - Click "Create Project"
   - Name it "Virtual Science Lab"
   - Copy your Project ID

3. **Enable Authentication**
   - Go to **Auth** → **Settings**
   - Enable Email/Password authentication
   - Enable Magic URL authentication

4. **Create Database**
   - Go to **Databases** → **Create Database**
   - Name it "Virtual Science Lab"
   - Copy your Database ID

5. **Create Collections**
   - Go to your database → **Collections** → **Create Collection**
   - Create the following collections:
     - **Chat Sessions** - For storing chat history
     - **Mixtures** - For storing chemistry mixtures
     - **User Data** - For storing user tour status
     - **User Settings** - For storing user settings
     - **User Analytics** - For storing user analytics data
   - Copy each collection's ID

6. **Set Collection Permissions**
   - For each collection, go to **Settings** → **Permissions**
   - Set **Read** and **Write** permissions to **Any** for all collections
   - This allows users to access their own data

7. **Add Attributes to Collections**
   - **User Data Collection**:
     - `type` (string, required) - Used to distinguish between tour data ('tour')
     - `isTourShown` (boolean) - Whether the welcome tour has been shown
     - `userId` (string, required) - User ID

   - **User Settings Collection**:
     - `userId` (string, required) - User ID
     - `theme` (string) - User's theme preference ('light', 'dark', or 'system')
     - `notifications` (boolean) - Whether notifications are enabled
     - `soundEffects` (boolean) - Whether sound effects are enabled
     - `autoSaveExperiments` (boolean) - Whether experiments are auto-saved
     - `defaultLab` (string) - Default lab ('chemistry' or 'physics')

   - **User Analytics Collection**:
     - `userId` (string, required) - User ID
     - `experimentsRun` (integer) - Number of experiments run
     - `aiQuestionsAsked` (integer) - Number of AI questions asked
     - `timeSpent` (integer) - Time spent in minutes
     - `favoriteLab` (string) - Favorite lab ('chemistry' or 'physics')
     - `lastActivity` (string) - ISO date string of last activity

8. **Add Platform**
   - Go to **Settings** → **Platforms**
   - Click "Add Platform" → "Web"
   - Add `http://localhost:5173` for development
   - Add your production URL later

9. **Add to .env**

   ```env
   VITE_APPWRITE_PROJECT_ID=your-project-id-from-step-2
   VITE_APPWRITE_DATABASE_ID=your-database-id-from-step-4
   VITE_APPWRITE_CHAT_COLLECTION_ID=your-chat-collection-id-from-step-5
   VITE_APPWRITE_MIXTURES_COLLECTION_ID=your-mixtures-collection-id-from-step-5
   VITE_APPWRITE_USER_DATA_COLLECTION_ID=your-user-data-collection-id-from-step-5
   ```

### OpenRouter API Setup

1. **Create Account**
   - Go to [openrouter.ai](https://openrouter.ai/)
   - Sign up for a free account

2. **Get API Key**
   - Navigate to the API Keys section
   - Generate a new API key
   - Copy the API key

3. **Add to .env**

   ```env
   VITE_OPENROUTER_API_KEY=your-openrouter-api-key-here
   ```

> Note: The application now uses separate collections for different data types and requires all Appwrite environment variables to be set. There is no fallback to localStorage - all data is stored in the Appwrite database. Appwrite automatically generates `$id` and `$createdAt` fields for all documents.

## 🌐 Deployment

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Biology Lab** - Cell simulations and microscope view
- [ ] **Electrical Circuits** - Build and test circuits
- [ ] **More Chemical Reactions** - Expand chemistry database
- [ ] **Experiment Reports** - Export results as PDF
- [ ] **Social Features** - Share experiments with friends
- [ ] **Achievements System** - Gamify learning
- [ ] **Multi-language Support** - Internationalization
- [ ] **Mobile Apps** - Native iOS and Android apps
- [ ] **VR/AR Support** - Immersive 3D experiences
- [ ] **Teacher Dashboard** - Track student progress
- [ ] **Multiplayer Labs** - Collaborate in real-time
- [ ] **Video Tutorials** - Guided experiments

### Version History

- **v1.0.0** (2025-10) - Initial release
  - Chemistry Lab
  - Physics Lab
  - AI Assistant
  - User Authentication
  - Chat History
  - Settings & Themes
  - Chemical Mixtures
  - Tour Settings
  - Sound Effects

---
# 🧪 Virtual Science Lab

<div align="center">

![Virtual Science Lab](https://img.shields.io/badge/Virtual%20Science%20Lab-v1.0.1-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An interactive, browser-based science playground for learning chemistry and physics through hands-on experiments.**

[Demo](https://virtual-science-lab.appwrite.network) · [Report Bug](https://github.com/rajjitlai/Virtual-Science-Lab/issues) · [Request Feature](https://github.com/rajjitlai/Virtual-Science-Lab/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Keys Setup](#-api-keys-setup)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Contact](#-contact)

---

## 🔬 About

Virtual Science Lab is an educational web application that brings science experiments to life in your browser. Students and curious minds can explore chemistry and physics concepts through interactive 3D simulations, get instant explanations from an AI assistant, and learn at their own pace.

### Why Virtual Science Lab?

- **Safe Learning Environment**: Experiment without real-world risks
- **Accessible Anywhere**: No equipment needed, just a browser
- **AI-Powered Learning**: Get instant answers to science questions
- **Interactive & Engaging**: Visual, hands-on learning experience
- **Free & Open Source**: Available to everyone
- **Cloud-Only Storage**: All data securely stored in Appwrite database

---

## ✨ Features

### 🧪 Chemistry Lab

- **3D Interactive Beaker**: Realistic glass beaker with liquid visualization
- **Chemical Mixing**: Combine 6 different chemicals (water, vinegar, baking soda, salt, sugar, lemon juice)
- **Real Reactions**: Watch bubbling animations when vinegar meets baking soda
- **Color Mixing**: See liquids blend in real-time
- **pH Information**: Learn about acidity and alkalinity

### ⚡ Physics Lab

- **Real Physics Engine**: Powered by Matter.js for accurate simulations
- **Gravity Control**: Adjust from 0g to 3g
- **Planet Presets**: Experience gravity on Earth 🌍, Moon 🌙, Mars 🔴, Jupiter 🪐, or Zero-G 🚀
- **Multiple Objects**: Drop balls and boxes with different masses
- **Collision Detection**: Watch objects bounce off platforms and walls
- **Live Stats**: Track object count and kinetic energy

### 🤖 AI Lab Assistant

- **OpenRouter API Integration**: Uses google/gemma-3n-e2b-it:free model
- **Rate Limiting Protection**: Prevents API abuse with built-in request throttling
- **Conversation History Management**: Limits context to prevent token overflow
- **Free Option Available**: No cost to use the basic AI features
- **Context-Aware**: Knows which lab you're in
- **Conversation Memory**: Remembers your discussion
- **Quick Questions**: Pre-written prompts to get started
- **Educational Focus**: Explains concepts in simple terms

### 💬 Chat History

- **Auto-Save Conversations**: Never lose your discussions
- **Cloud Storage Only**: All data stored in Appwrite database (no localStorage fallback)
- **Searchable Archive**: Review past conversations
- **Delete Options**: Remove individual chats or clear all
- **Context Tags**: See which lab each conversation was in

### ⚙️ User Settings

- **Theme Switching**: Light ☀️, Dark 🌙, or System 💻 mode
- **User Profile**: View account info and stats
- **Preferences**: Toggle notifications, sound effects, auto-save
- **Default Lab**: Choose startup screen
 - **About Panel**: View app version and developer link (Developed by [Rajjit Laishram](https://rajjitlaishram.netlify.app))
 - **Legal**: Access Terms & Conditions and Privacy Policy (also available on Login)

### 🔐 Authentication

- **Email/Password**: Traditional secure login
- **Magic URL**: Passwordless authentication via email
- **Session Management**: Stay logged in across visits
- **User Profiles**: Personalized experience

### 🎨 User Experience

- **Welcome Tour**: Interactive onboarding for new users
- **Toast Notifications**: Helpful feedback messages
- **Error Handling**: Graceful error recovery
- **Loading States**: Smooth transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Full support with smooth transitions

---

## 📸 Screenshots

### Chemistry Lab

![Chemistry Lab](docs/screenshots/chemistry-lab.png)
*Mix chemicals and watch reactions in a 3D beaker*

### Physics Lab

![Physics Lab](docs/screenshots/physics-lab.png)
*Experiment with gravity and collisions*

### AI Assistant

![AI Assistant](docs/screenshots/ai-assistant.png)
*Ask questions and get instant explanations*

### Chat History

![Chat History](docs/screenshots/chat-history.png)
*Review all your past conversations*

### Settings

![Settings](docs/screenshots/settings.png)
*Customize your experience with themes and preferences*

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

- **Appwrite** - Authentication and backend (required database for all data storage)
- **OpenRouter API** - AI assistant (google/gemma-3n-e2b-it:free model)
- **Vite Proxy** - Handles CORS for AI API requests

### Development

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/virtual-science-lab.git
   cd virtual-science-lab
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys (see [API Keys Setup](#-api-keys-setup))

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   ```
   http://localhost:5173
   ```

### Configuration

Edit `.env` file with your credentials:

```env
# Appwrite Configuration (required for all data storage)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_APPWRITE_DATABASE_ID=your-database-id-here
VITE_APPWRITE_CHAT_COLLECTION_ID=your-chat-collection-id-here
VITE_APPWRITE_MIXTURES_COLLECTION_ID=your-mixtures-collection-id-here
VITE_APPWRITE_USER_DATA_COLLECTION_ID=your-user-data-collection-id-here

# OpenRouter API Configuration (required for AI assistant)
VITE_OPENROUTER_API_KEY=your-openrouter-api-key-here
```

---

## 💡 Usage

### 1. Create an Account

- Click "Register" on the login page
- Enter your name, email, and password
- Or use "Magic URL" for passwordless login

### 2. Explore Chemistry Lab

- Click the **🧪 Chemistry** tab
- Select chemicals from the panel below
- Watch the beaker fill and reactions occur
- Try mixing vinegar + baking soda for a fizzing reaction!

### 3. Experiment with Physics

- Click the **⚡ Physics** tab
- Choose balls or boxes to add
- Adjust gravity with the slider or use planet presets
- Try Zero-G mode for floating objects!

### 4. Ask the AI Assistant

- Click the **🤖 floating button** (bottom-right)
- Type your science question
- Get instant, educational explanations
- The AI uses the OpenRouter API with the google/gemma-3n-e2b-it:free model
- Conversation is auto-saved when you close it

### 5. Review Chat History

- Click the **💬 icon** in the navbar
- View all past conversations
- Click any chat to see full details
- Delete individual chats or clear all
- All chat history is stored in the cloud via Appwrite

### 6. Customize Settings

- Click the **⚙️ icon** in the navbar
- Switch between light/dark/system theme
- Toggle preferences (notifications, sound effects)
- Choose your default lab
 - Open the **About** section to see version and developer info
 - Review **Terms & Conditions** and **Privacy Policy** from About (also available on the Login page)

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

## 🔑 API Keys Setup

### Appwrite Setup

1. **Create Account**
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io/)
   - Sign up for a free account

2. **Create Project**
   - Click "Create Project"
   - Name it "Virtual Science Lab"
   - Copy your Project ID

3. **Enable Authentication**
   - Go to **Auth** → **Settings**
   - Enable Email/Password authentication
   - Enable Magic URL authentication

4. **Create Database**
   - Go to **Databases** → **Create Database**
   - Name it "Virtual Science Lab"
   - Copy your Database ID

5. **Create Collections**
   - Go to your database → **Collections** → **Create Collection**
   - Create the following collections:
     - **Chat Sessions** - For storing chat history
     - **Mixtures** - For storing chemistry mixtures
     - **User Data** - For storing user tour status
     - **User Settings** - For storing user settings
     - **User Analytics** - For storing user analytics data
   - Copy each collection's ID

6. **Set Collection Permissions**
   - For each collection, go to **Settings** → **Permissions**
   - Set **Read** and **Write** permissions to **Any** for all collections
   - This allows users to access their own data

7. **Add Attributes to Collections**
   - **User Data Collection**:
     - `type` (string, required) - Used to distinguish between tour data ('tour')
     - `isTourShown` (boolean) - Whether the welcome tour has been shown
     - `userId` (string, required) - User ID

   - **User Settings Collection**:
     - `userId` (string, required) - User ID
     - `theme` (string) - User's theme preference ('light', 'dark', or 'system')
     - `notifications` (boolean) - Whether notifications are enabled
     - `soundEffects` (boolean) - Whether sound effects are enabled
     - `autoSaveExperiments` (boolean) - Whether experiments are auto-saved
     - `defaultLab` (string) - Default lab ('chemistry' or 'physics')

   - **User Analytics Collection**:
     - `userId` (string, required) - User ID
     - `experimentsRun` (integer) - Number of experiments run
     - `aiQuestionsAsked` (integer) - Number of AI questions asked
     - `timeSpent` (integer) - Time spent in minutes
     - `favoriteLab` (string) - Favorite lab ('chemistry' or 'physics')
     - `lastActivity` (string) - ISO date string of last activity

8. **Add Platform**
   - Go to **Settings** → **Platforms**
   - Click "Add Platform" → "Web"
   - Add `http://localhost:5173` for development
   - Add your production URL later

9. **Add to .env**

   ```env
   VITE_APPWRITE_PROJECT_ID=your-project-id-from-step-2
   VITE_APPWRITE_DATABASE_ID=your-database-id-from-step-4
   VITE_APPWRITE_CHAT_COLLECTION_ID=your-chat-collection-id-from-step-5
   VITE_APPWRITE_MIXTURES_COLLECTION_ID=your-mixtures-collection-id-from-step-5
   VITE_APPWRITE_USER_DATA_COLLECTION_ID=your-user-data-collection-id-from-step-5
   ```

### OpenRouter API Setup

1. **Create Account**
   - Go to [openrouter.ai](https://openrouter.ai/)
   - Sign up for a free account

2. **Get API Key**
   - Navigate to the API Keys section
   - Generate a new API key
   - Copy the API key

3. **Add to .env**

   ```env
   VITE_OPENROUTER_API_KEY=your-openrouter-api-key-here
   ```

> Note: The application now uses separate collections for different data types and requires all Appwrite environment variables to be set. There is no fallback to localStorage - all data is stored in the Appwrite database. Appwrite automatically generates `$id` and `$createdAt` fields for all documents.

## 🌐 Deployment

### Deploy to Vercel Appwrite

## 📜 Legal

- **Terms & Conditions** and **Privacy Policy** are accessible from the Login page footer and from **Settings → About** inside the app.
- These pages outline usage terms and how data (including AI interactions via Google Generative AI and Appwrite storage) is handled.

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Biology Lab** - Cell simulations and microscope view
- [ ] **Electrical Circuits** - Build and test circuits
- [ ] **More Chemical Reactions** - Expand chemistry database
- [ ] **Experiment Reports** - Export results as PDF
- [ ] **Social Features** - Share experiments with friends
- [ ] **Achievements System** - Gamify learning
- [ ] **Multi-language Support** - Internationalization
- [ ] **Mobile Apps** - Native iOS and Android apps
- [ ] **VR/AR Support** - Immersive 3D experiences
- [ ] **Teacher Dashboard** - Track student progress
- [ ] **Multiplayer Labs** - Collaborate in real-time
- [ ] **Video Tutorials** - Guided experiments

### Version History

- **v1.0.0** (2025-10) - Initial release
  - Chemistry Lab
  - Physics Lab
  - AI Assistant
  - User Authentication
  - Chat History
  - Settings & Themes

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**

   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your Fork**

   ```bash
   git clone https://github.com/yourusername/virtual-science-lab.git
   cd virtual-science-lab
   ```

3. **Create a Feature Branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Test your changes thoroughly

5. **Commit Changes**

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

6. **Push to Branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Describe your changes

### Development Guidelines

- Use TypeScript for all new code
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test on multiple browsers
- All data is now stored in separate Appwrite collections with no localStorage fallback
- AI requests are proxied through Vite to avoid CORS issues with the OpenRouter API

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

```
MIT License

Copyright (c) 2025 Rajjit Laishram

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Libraries & Frameworks

- [React](https://react.dev/) - UI library
- [Three.js](https://threejs.org/) - 3D graphics
- [Matter.js](https://brm.io/matter-js/) - Physics engine
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Appwrite](https://appwrite.io/) - Backend platform
- [OpenRouter](https://openrouter.ai/) - AI assistant API

### Inspiration

- [PhET Interactive Simulations](https://phet.colorado.edu/)
- [Algodoo](http://www.algodoo.com/)
- Science teachers and educators worldwide

### Special Thanks

- All contributors and testers
- Open-source community
- Stack Overflow for endless answers
- OpenRouter for providing access to free AI models

---

## 📞 Contact

**Project Creator** - Rajjit Laishram

- Email: <rajjitlai@mail.com>
- Twitter: [@rajjitlai](https://twitter.com/rajjitlai)
- LinkedIn: [Rajjit Laishram](https://linkedin.com/in/rajjitlaishram)

**Project Link**: [https://github.com/rajjitlai/Virtual-Science-Lab](https://github.com/rajjitlai/Virtual-Science-Lab)

**Live Demo**: [https://virtual-science-lab.appwrite.network](https://virtual-science-lab.appwrite.network)

---

<div align="center">

### ⭐ Star this repo if you find it helpful

**Made with ❤️ for science education**

[🔝 Back to Top](#-virtual-science-lab)

</div>
# 🛠️ Setup Guide

## Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

## Initial Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd virtual-science-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:3000

## Project Structure
```
virtual-science-lab/
├── public/
├── src/
│   ├── components/
│   │   ├── chemistry/
│   │   └── physics/
│   ├── assets/
│   ├── test/
│   └── App.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Environment Variables

Create a `.env` file in the root directory:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

## Adding New Experiments

To add new experiments:
1. Create a new component in the relevant sandbox directory (chemistry or physics)
2. Import and register it in the main App component
3. Add necessary physics or chemistry logic
4. Test thoroughly before submitting

## Running Tests

To run tests:
```bash
npm run test
```

To run tests in watch mode:
```bash
npm run test:watch
```
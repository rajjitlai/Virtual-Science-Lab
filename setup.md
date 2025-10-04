# 🛠️ Setup Guide

## Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git
- Appwrite account (for authentication and backend services)

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

3. Configure Appwrite:
   - Create an Appwrite account at https://appwrite.io/
   - Create a new project
   - Add your platform (web) with the appropriate URL
   - Configure email provider for Magic URL authentication (optional)

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your Appwrite project details:
   ```
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

5. Create required Appwrite collections:
   - **Users** (built-in)
   - **Experiments**: Store user experiments and results
   - **Chat History**: Store AI chat conversations
   - **User Settings**: Store user preferences (theme, etc.)

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to http://localhost:3000

## Project Structure
```
virtual-science-lab/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── chemistry/
│   │   ├── physics/
│   │   └── settings/
│   ├── config/
│   ├── contexts/
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
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Appwrite Database Collections

### Experiments Collection
- **Name**: experiments
- **Attributes**:
  - name (string)
  - type (string) - "chemistry" or "physics"
  - data (string) - JSON string of experiment data
  - userId (string) - Reference to user
  - createdAt (datetime)
- **Permissions**: 
  - Read: Any authenticated user
  - Write: Owner only

### Chat History Collection
- **Name**: chat_history
- **Attributes**:
  - userId (string) - Reference to user
  - question (string)
  - answer (string)
  - createdAt (datetime)
- **Permissions**: 
  - Read: Owner only
  - Write: Owner only

### User Settings Collection
- **Name**: user_settings
- **Attributes**:
  - userId (string) - Reference to user
  - theme (string) - "light" or "dark"
  - avatar (string) - URL to avatar image
  - notifications (boolean)
- **Permissions**: 
  - Read: Owner only
  - Write: Owner only

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

## Authentication System

The authentication system uses Appwrite for user management and supports multiple authentication methods:

### Email/Password Authentication
- Users can register with email and password
- Traditional login with email and password
- Password reset functionality

### Magic URL Authentication
- Passwordless authentication via email link
- Users receive an email with a magic link
- Clicking the link logs them in automatically
- Requires email provider configuration in Appwrite

To test authentication:
1. Make sure your Appwrite project is configured correctly
2. Start the development server
3. Navigate to http://localhost:3000
4. Use the login or registration forms to authenticate
5. Select your preferred authentication method from the tabs
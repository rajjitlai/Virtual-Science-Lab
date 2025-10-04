import { Client, Account, Databases } from 'appwrite';

const client = new Client();

// Configure the Appwrite client
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id');

// Initialize services
const account = new Account(client);
const databases = new Databases(client);

// Database and collection IDs
export const DATABASE_ID = 'virtual_science_lab';
export const COLLECTION_EXPERIMENTS = 'experiments';
export const COLLECTION_CHAT_HISTORY = 'chat_history';
export const COLLECTION_USER_SETTINGS = 'user_settings';

export { client, account, databases };
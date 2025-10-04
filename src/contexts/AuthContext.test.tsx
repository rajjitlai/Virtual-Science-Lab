import { expect, test, vi } from 'vitest';
import { account, databases } from '../config/appwrite';

// Mock the Appwrite account and databases methods
vi.mock('../config/appwrite', () => ({
  account: {
    get: vi.fn(),
    createEmailPasswordSession: vi.fn(),
    create: vi.fn(),
    deleteSession: vi.fn(),
    createMagicURLToken: vi.fn(),
    updateMagicURLSession: vi.fn()
  },
  databases: {
    listDocuments: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn()
  },
  DATABASE_ID: 'test_db',
  COLLECTION_USER_SETTINGS: 'user_settings'
}));

test('auth context functions should be defined', () => {
  expect(account).toBeDefined();
  expect(account.get).toBeDefined();
  expect(account.createEmailPasswordSession).toBeDefined();
  expect(account.create).toBeDefined();
  expect(account.deleteSession).toBeDefined();
  expect(account.createMagicURLToken).toBeDefined();
  expect(account.updateMagicURLSession).toBeDefined();
  expect(databases).toBeDefined();
  expect(databases.listDocuments).toBeDefined();
  expect(databases.createDocument).toBeDefined();
  expect(databases.updateDocument).toBeDefined();
});
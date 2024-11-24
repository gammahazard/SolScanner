import { create } from 'zustand';

interface ApiKeyState {
  isValid: boolean;
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  setIsValid: (valid: boolean) => void;
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
  isValid: false,
  apiKey: null,
  setApiKey: (key) => set({ apiKey: key }),
  setIsValid: (valid) => set({ isValid: valid }),
}));
// app/whale-watcher/page.tsx
'use client';

import WhaleWatcher from '@/components/WhaleWatcher';
import ApiKeyInput from '@/components/ApiKeyInput';
import { useApiKeyStore } from '@/lib/hooks/useApiKey';

export default function WhaleWatcherPage() {
  const { isValid } = useApiKeyStore();

  return (
    <main className="min-h-screen bg-[#13141f] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#9945FF] mb-4">
          Whale Watcher
        </h1>

        <p className="text-[#9ca3af] text-lg text-center mb-8">
          Track token holdings of any wallet address
        </p>

        <ApiKeyInput />

        {!isValid && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-lg mb-6">
            Please enter a valid API key to use the whale watcher
          </div>
        )}

        <WhaleWatcher />
      </div>
    </main>
  );
}
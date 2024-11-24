import React, { useState, useEffect, useCallback } from 'react';
import { validateApiKey } from '@/lib/api';
import { useApiKeyStore } from '@/lib/hooks/useApiKey';
import { Check, X } from 'lucide-react';

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { setApiKey: setGlobalApiKey, setIsValid: setGlobalIsValid } = useApiKeyStore();

  const checkApiKey = useCallback(async (key: string) => {
    setIsLoading(true);
    try {
      const isKeyValid = await validateApiKey(key);
      
      setIsValid(isKeyValid);
      if (isKeyValid) {
        localStorage.setItem('apiKey', key);
        setMessage('API key is valid');
        setGlobalApiKey(key);
        setGlobalIsValid(true);
      } else {
        localStorage.removeItem('apiKey');
        setMessage('Invalid API key');
        setGlobalApiKey(null);
        setGlobalIsValid(false);
      }
    } catch {
      setIsValid(false);
      localStorage.removeItem('apiKey');
      setMessage('Error validating API key');
      setGlobalApiKey(null);
      setGlobalIsValid(false);
    } finally {
      setIsLoading(false);
    }
  }, [setGlobalApiKey, setGlobalIsValid]);

  useEffect(() => {
    const savedKey = localStorage.getItem('apiKey');
    if (savedKey) {
      setApiKey(savedKey);
      checkApiKey(savedKey);
    }
  }, [checkApiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkApiKey(apiKey);
  };

  return (
    <div className="bg-[#1e1f2e] rounded-xl p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API key"
            className="w-full px-4 py-2 bg-[#2a2b3d] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[#9945FF] text-white rounded-lg hover:bg-[#7d37d6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Validating...' : 'Validate'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-2 flex items-center gap-2 ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? <Check size={16} /> : <X size={16} />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;

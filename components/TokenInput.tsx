import { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { API_BASE } from '@/lib/api';

interface TokenInputProps {
  onAddToken: (token: Token) => void;  // Use the same Token interface
}

interface Token {
  address: string;
  symbol: string;
  isSelected: boolean;
  holderLimit: number;
  isDefault?: boolean;
}
export function TokenInput({ onAddToken }: TokenInputProps) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/tokens/info/${tokenAddress}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': localStorage.getItem('apiKey') || ''
        }
      });
      
      const data = await response.json();

      if (!data.success || !data.symbol) {
        throw new Error(data.error || 'Could not find token metadata');
      }

      // Add the token to the custom token list with default limit
      onAddToken({
        address: tokenAddress,
        symbol: data.symbol,
        isSelected: true,
        holderLimit: 1000 // Default limit
      });

      // Clear the input
      setTokenAddress('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1e1f2e] rounded-xl p-6 mb-4">
      <h3 className="text-[#9945FF] text-xl mb-4">Add Custom Token</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="Enter token address..."
            className="w-full px-4 py-2 bg-[#2a2b3d] rounded-lg text-white border border-[#9945FF] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !tokenAddress.trim()}
          className="px-6 py-2 bg-[#9945FF] text-white rounded-lg hover:bg-[#7d37d6] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          Add Token
        </button>
      </form>
    </div>
  );
}
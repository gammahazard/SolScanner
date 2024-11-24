import { useState } from 'react';
import { Check, X, ChevronUp, ChevronDown, Trash2, Lock } from 'lucide-react';

interface Token {
  address?: string;
  symbol: string;
  isSelected: boolean;
  holderLimit: number;
  isDefault?: boolean;
}

interface TokenGridProps {
  defaultTokens: Token[];
  customTokens: Token[];
  onToggleToken: (symbol: string) => void;
  onUpdateLimit: (symbol: string, limit: number) => void;
  onRemoveToken: (symbol: string) => void;
}

export function TokenGrid({
  defaultTokens,
  customTokens,
  onToggleToken,
  onUpdateLimit,
  onRemoveToken
}: TokenGridProps) {
  const allTokens = [...defaultTokens, ...customTokens];

  const handleLimitChange = (symbol: string, newLimit: number) => {
    // Ensure limit is between 1 and 1000
    const validLimit = Math.max(1, Math.min(1000, newLimit));
    if (!isNaN(validLimit)) {
      onUpdateLimit(symbol, validLimit);
    }
  };

  return (
    <div className="bg-[#1e1f2e] rounded-xl p-6 mb-8">
      <h3 className="text-[#9945FF] text-xl mb-4">Select Tokens to Scan:</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {allTokens.map((token) => (
          <div
            key={token.symbol}
            className={`
              rounded-lg overflow-hidden border
              ${token.isSelected ? 'border-[#10b981]' : 'border-[#ef4444]'}
            `}
          >
            <div className="flex items-center justify-between bg-[#2a2b3d] p-2">
              <button
                onClick={() => onToggleToken(token.symbol)}
                className={`
                  flex-1 p-2 flex items-center justify-between rounded-lg
                  ${token.isSelected ? 'bg-[#1a472e] text-[#10b981]' : 'bg-[#2a2b3d] text-[#ef4444]'}
                `}
              >
                <span className="font-mono">{token.symbol}</span>
                {token.isSelected ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
              
              {!token.isDefault && (
                <button
                  onClick={() => onRemoveToken(token.symbol)}
                  className="ml-2 p-2 text-[#ef4444] hover:bg-[#1e1f2e] rounded-lg transition-colors"
                  title="Remove token"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="bg-[#2a2b3d] p-3">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-[#9ca3af]">Top</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={token.holderLimit}
                      onChange={(e) => handleLimitChange(token.symbol, parseInt(e.target.value))}
                      min="1"
                      max="1000"
                      className="w-full px-2 py-1 bg-[#1e1f2e] rounded text-white text-center"
                    />
                    <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center">
                      <button
                        onClick={() => handleLimitChange(token.symbol, token.holderLimit + 100)}
                        className="text-[#9945FF] hover:text-[#7d37d6] p-0.5"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleLimitChange(token.symbol, token.holderLimit - 100)}
                        className="text-[#9945FF] hover:text-[#7d37d6] p-0.5"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm text-[#9ca3af]">holders</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
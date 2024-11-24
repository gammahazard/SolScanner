'use client';

import { useState, useEffect } from 'react';
import { TokenInput } from '@/components/TokenInput';
import { TokenGrid } from '@/components/TokenGrid';
import { ScanStatus } from '@/components/ScanStatus';
import { ResultsTable } from '@/components/ResultsTable';
import { ScanComponent } from '@/components/ScanComponent';
import { ClearButton } from '@/components/ClearButton';
import { COMMON_TOKENS } from '@/lib/constants';
import ApiKeyInput from '@/components/ApiKeyInput';
import { useApiKeyStore } from '@/lib/hooks/useApiKey';

// Define interfaces
interface Token {
  address: string;
  symbol: string;
  isSelected: boolean;
  holderLimit: number;
  isDefault?: boolean;
}

interface HoldingData {
  percentage: string;
  amount: string;
  decimals: number;
  rank: number;
}

interface Holdings {
  [symbol: string]: HoldingData;
}

interface HolderResult {
  address: string;
  tokenCount: number;
  tokens: string[];
  holdings: Holdings;
}

interface ScanResult {
  symbol: string;
  holdersFound: number;
  totalHolders?: number;
  processedAccounts?: number;
}

const DEFAULT_TOKENS: Token[] = Object.entries(COMMON_TOKENS).map(([symbol, address]) => ({
  symbol,
  address,
  isSelected: true,
  holderLimit: 1000,
  isDefault: true,
}));

export default function Home() {
  const [status, setStatus] = useState<string>('Ready to scan...');
  const [results, setResults] = useState<HolderResult[]>([]);
  const [defaultTokens, setDefaultTokens] = useState<Token[]>(DEFAULT_TOKENS);
  const [customTokens, setCustomTokens] = useState<Token[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isValid } = useApiKeyStore();

  // Debug effect
  useEffect(() => {
    console.log('State updated:', {
      resultsPresent: !!results,
      resultsLength: results?.length,
      scanResultsLength: scanResults?.length,
      status
    });
  }, [results, scanResults, status]);

  // Load saved tokens from localStorage
  useEffect(() => {
    try {
      const savedCustomTokens = localStorage.getItem('customTokens');
      if (savedCustomTokens) {
        setCustomTokens(JSON.parse(savedCustomTokens));
      }

      const savedDefaultStates = localStorage.getItem('defaultTokenStates');
      if (savedDefaultStates) {
        const states = JSON.parse(savedDefaultStates);
        setDefaultTokens(
          DEFAULT_TOKENS.map((token) => ({
            ...token,
            isSelected: states[token.symbol]?.isSelected ?? token.isSelected,
            holderLimit: states[token.symbol]?.holderLimit ?? token.holderLimit,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading saved token states:', error);
      localStorage.removeItem('customTokens');
      localStorage.removeItem('defaultTokenStates');
    }
  }, []);

  const handleAddToken = (token: Token) => {
    if (
      customTokens.some((t) => t.symbol === token.symbol) ||
      defaultTokens.some((t) => t.symbol === token.symbol)
    ) {
      setStatus(`Token ${token.symbol} already exists`);
      return;
    }
    const updatedTokens = [...customTokens, { ...token, holderLimit: 1000 }];
    setCustomTokens(updatedTokens);
    localStorage.setItem('customTokens', JSON.stringify(updatedTokens));
  };
  const handleUpdateLimit = (symbol: string, newLimit: number) => {
    // Update default tokens
    const defaultIndex = defaultTokens.findIndex(t => t.symbol === symbol);
    if (defaultIndex !== -1) {
      const updatedDefaults = [...defaultTokens];
      updatedDefaults[defaultIndex] = {
        ...updatedDefaults[defaultIndex],
        holderLimit: newLimit
      };
      setDefaultTokens(updatedDefaults);
      
      // Save to localStorage
      const states = updatedDefaults.reduce((acc, token) => ({
        ...acc,
        [token.symbol]: {
          isSelected: token.isSelected,
          holderLimit: token.holderLimit,
        },
      }), {});
      localStorage.setItem('defaultTokenStates', JSON.stringify(states));
      return;
    } // Update custom tokens
    const customIndex = customTokens.findIndex(t => t.symbol === symbol);
    if (customIndex !== -1) {
      const updatedCustom = [...customTokens];
      updatedCustom[customIndex] = {
        ...updatedCustom[customIndex],
        holderLimit: newLimit
      };
      setCustomTokens(updatedCustom);
      localStorage.setItem('customTokens', JSON.stringify(updatedCustom));
    }
  };
  const handleToggleToken = (symbol: string) => {
    const defaultIndex = defaultTokens.findIndex((t) => t.symbol === symbol);
    if (defaultIndex !== -1) {
      const updatedDefaults = [...defaultTokens];
      updatedDefaults[defaultIndex] = {
        ...updatedDefaults[defaultIndex],
        isSelected: !updatedDefaults[defaultIndex].isSelected,
      };
      setDefaultTokens(updatedDefaults);
      
      const states = updatedDefaults.reduce((acc, token) => ({
        ...acc,
        [token.symbol]: {
          isSelected: token.isSelected,
          holderLimit: token.holderLimit,
        },
      }), {});
      localStorage.setItem('defaultTokenStates', JSON.stringify(states));
      return;
    }

    const customIndex = customTokens.findIndex((t) => t.symbol === symbol);
    if (customIndex !== -1) {
      const updatedCustom = [...customTokens];
      updatedCustom[customIndex] = {
        ...updatedCustom[customIndex],
        isSelected: !updatedCustom[customIndex].isSelected,
      };
      setCustomTokens(updatedCustom);
      localStorage.setItem('customTokens', JSON.stringify(updatedCustom));
    }
  };

  const formatNumber = (num: number | undefined): string => {
    if (typeof num === 'undefined') return '0';
    return num.toLocaleString();
  };

  const handleScanComplete = (newResults: HolderResult[], newScanResults: ScanResult[]) => {
    console.log('Scan complete, received results:', {
      resultsLength: newResults?.length,
      scanResultsLength: newScanResults?.length,
      sampleResult: newResults?.[0],
      sampleScanResult: newScanResults?.[0]
    });
      
    if (Array.isArray(newResults)) {
      console.log('Setting results:', newResults);
      setResults(newResults);
    } else {
      console.error('Invalid results format:', newResults);
      setResults([]);
    }
  
    if (Array.isArray(newScanResults)) {
      console.log('Setting scan results:', newScanResults);
      setScanResults(newScanResults);
    } else {
      console.error('Invalid scan results format:', newScanResults);
      setScanResults([]);
    }
  
    setIsLoading(false);
    setError(null);
    setStatus('Scan completed successfully');
  };
  const handleRemoveToken = (symbol: string) => {
    const updatedTokens = customTokens.filter(token => token.symbol !== symbol);
    setCustomTokens(updatedTokens);
    localStorage.setItem('customTokens', JSON.stringify(updatedTokens));
  };
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setIsLoading(newStatus.includes('Scanning') || newStatus.includes('Processing'));
  };

  const handleClearResults = () => {
    setResults([]);
    setScanResults([]);
    setStatus('Ready to scan...');
    setError(null);
    setIsLoading(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const selectedTokens = [
    ...defaultTokens.filter((t) => t.isSelected),
    ...customTokens.filter((t) => t.isSelected),
  ];

  return (
    <main className="min-h-screen bg-[#13141f] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#9945FF] mb-4">
          Solana Token Holder Scanner
        </h1>

        <p className="text-[#9ca3af] text-lg text-center mb-8">
          Analyzes top holders across multiple tokens to find common wallets
        </p>

        <ApiKeyInput />

        {!isValid && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-lg mb-6">
            Please enter a valid API key to use the scanner
          </div>
        )}

        <TokenInput onAddToken={handleAddToken} />

     <TokenGrid
          defaultTokens={defaultTokens}
          customTokens={customTokens}
          onToggleToken={handleToggleToken}
          onUpdateLimit={handleUpdateLimit}
          onRemoveToken={handleRemoveToken}
        />

        <div className="mb-8">
          <ScanComponent
            selectedTokens={selectedTokens}
            onScanComplete={handleScanComplete}
            onStatusChange={handleStatusChange}
            onError={handleError}
          />
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {(results.length > 0 || scanResults.length > 0) && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#9945FF]">
              Scan Results
            </h2>
            <ClearButton onClear={handleClearResults} />
          </div>
        )}

        {scanResults.length > 0 && (
          <div className="bg-[#1e1f2e] rounded-xl p-4 mb-8">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#9945FF]">Completed Scans:</h4>
            </div>
            <div className="space-y-2">
              {scanResults.map((result, index) => (
                <div
                  key={`${result.symbol}-${index}`}
                  className="flex justify-between items-center bg-[#2a2b3d] p-2 rounded"
                >
                  <span className="text-white font-mono">{result.symbol}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[#10b981]">
                      {formatNumber(result.totalHolders)} total holders
                    </span>
                    {result.processedAccounts !== result.totalHolders && (
                      <span className="text-yellow-400 text-sm">
                        ({formatNumber(result.processedAccounts)} processed)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {status && <ScanStatus status={status} />}

        {isLoading ? (
          <div className="bg-[#1e1f2e] rounded-xl p-6 mt-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-[#2a2b3d] rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#2a2b3d] rounded"></div>
                <div className="h-4 bg-[#2a2b3d] rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : results && results.length > 0 ? (
          <div className="mt-8">
            <ResultsTable results={results} />
          </div>
        ) : status.includes('complete') && (
          <div className="text-center p-6 bg-[#1e1f2e] rounded-xl mt-8">
            <p className="text-[#9ca3af]">No matching holders found</p>
          </div>
        )}
      </div>
    </main>
  );
}
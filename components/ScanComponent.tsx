'use client';

import { useState, useRef } from 'react';
import StopButton from './StopButton';
import { ProgressBar } from './ProgressBar'; // Import the ProgressBar component
import { useApiKeyStore } from '@/lib/hooks/useApiKey';
import { API_BASE } from '@/lib/api';
import { throttle } from 'lodash';

import { HolderResult, ScanResult, ScanData } from '@/types/scan';


interface ScanEvent {
  sessionId?: string;
  type: 'status' | 'progress' | 'tokenComplete' | 'complete' | 'error';
  message?: string;
  processedCount?: number;
  totalAccounts?: number;
  currentToken?: string;
  symbol?: string;
  results?: HolderResult[];
  scanResults?: ScanResult[];
}

interface ScanComponentProps {
  selectedTokens: {
    symbol: string;
    address: string;
    isSelected: boolean;
    holderLimit: number;
  }[];
  onScanComplete: (results: HolderResult[], scanResults: ScanResult[]) => void;
  onStatusChange: (status: string) => void;
  onError?: (error: string) => void;
}
export const ScanComponent: React.FC<ScanComponentProps> = ({
  selectedTokens,
  onScanComplete,
  onStatusChange,
  onError,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    currentToken: '',
    status: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isValid, apiKey } = useApiKeyStore();

  const progressRef = useRef(progress);

  // Throttle progress updates for smoother UI
  const updateProgress = throttle((newProgress: Partial<typeof progress>) => {
    setProgress((prev) => ({
      ...prev,
      ...newProgress,
    }));
    progressRef.current = { ...progressRef.current, ...newProgress };
  }, 100); // Update at most every 100ms

  const handleStop = async () => {
    if (!currentSessionId || isStopping) return;

    setIsStopping(true);
    onStatusChange('Stopping scan...');

    try {
      const response = await fetch(`${API_BASE}/scan/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
        },
        body: JSON.stringify({ sessionId: currentSessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to stop scan');
      }

      onStatusChange('Scan stopped by user');
      setErrorMessage(null);
      setProgress({ current: 0, total: 0, currentToken: '', status: '' });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to stop scan';
      console.error('Error stopping scan:', errorMessage);
      onStatusChange('Error stopping scan');
      onError?.(errorMessage);
    } finally {
      setIsStopping(false);
      setIsScanning(false);
      setCurrentSessionId(null);
    }
  };

  const handleScan = async () => {
    if (!isValid) {
      const message = 'Please enter a valid API key to start scanning';
      setErrorMessage(message);
      onStatusChange(message);
      onError?.(message);
      return;
    }

    if (isScanning) return;

    if (selectedTokens.length === 0) {
      const message = 'Please select at least one token to scan';
      onStatusChange(message);
      onError?.(message);
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);
    onStatusChange('Starting scan...');
    setProgress({
      current: 0,
      total: 0,
      currentToken: '',
      status: 'Initializing scan...',
    });

    try {
      const response = await fetch(`${API_BASE}/scan/scan-selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
        },
        body: JSON.stringify({ tokens: selectedTokens }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start scan');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Stream not available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const event: ScanEvent = JSON.parse(line.slice(5));

              if (event.sessionId && !currentSessionId) {
                setCurrentSessionId(event.sessionId);
              }

              switch (event.type) {
                case 'status':
                  onStatusChange(event.message || '');
                  updateProgress({
                    status: event.message || '',
                    currentToken: event.currentToken || progressRef.current.currentToken,
                  });
                  break;

                case 'progress':
                  updateProgress({
                    current: event.processedCount ?? 0,
                    total: event.totalAccounts ?? 0,
                    currentToken: event.currentToken || progressRef.current.currentToken,
                    status: event.message || '',
                  });
                  break;

                case 'tokenComplete':
                  updateProgress({
                    status: `Completed scanning ${progressRef.current.currentToken}. Moving to next token...`,
                  });
                  break;

                case 'complete':
                  if (event.results && event.scanResults) {
                    onScanComplete(event.results, event.scanResults);
                  }
                  setIsScanning(false);
                  setCurrentSessionId(null);
                  setProgress({
                    current: 0,
                    total: 0,
                    currentToken: '',
                    status: 'Scan completed successfully',
                  });
                  onStatusChange('Scan completed successfully');
                  return;

                case 'error':
                  throw new Error(event.message);
              }
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error ? error.message : 'Error processing scan results';
              console.error('Error processing event:', errorMessage);
              onError?.(errorMessage);
              setErrorMessage(errorMessage);
            }
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error scanning tokens';
      console.error('Error scanning tokens:', errorMessage);
      setErrorMessage(errorMessage);
      onStatusChange(`Error: ${errorMessage}`);
      onError?.(errorMessage);
      setProgress({
        current: 0,
        total: 0,
        currentToken: '',
        status: '',
      });
    } finally {
      setIsScanning(false);
      setCurrentSessionId(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {errorMessage && (
        <div className="w-full bg-red-500 text-white p-4 rounded-lg mb-4">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleScan}
          disabled={isScanning || !isValid}
          className="px-6 py-3 bg-[#9945FF] text-white rounded-lg hover:bg-[#7d37d6] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isScanning ? 'Scanning...' : 'Scan Selected Tokens'}
        </button>
        <StopButton isScanning={isScanning} onStop={handleStop} isStopping={isStopping} />
      </div>

      {isScanning && (
        <>
          <ProgressBar
            current={progress.current}
            total={progress.total}
            currentToken={progress.currentToken}
          />
        </>
      )}
    </div>
  );
};

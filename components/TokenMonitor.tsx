'use client';

import React, { useEffect, useState } from 'react';
import { X, Activity } from 'lucide-react';
import { API_BASE } from '@/lib/api';
import { useApiKeyStore } from '@/lib/hooks/useApiKey';

interface TokenMonitorProps {
  symbol: string;
  walletAddress: string;
  onClose: () => void;
}

interface TokenEvent {
  type: string;
  timestamp: number;
  message?: string;
  tokenTransfers?: Array<{
    from: string;
    to: string;
    token: string;
    amount: number;
  }>;
}

const TokenMonitor: React.FC<TokenMonitorProps> = ({ symbol, walletAddress, onClose }) => {
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const { apiKey } = useApiKeyStore();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [events, setEvents] = useState<TokenEvent[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Helper to show notifications
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    let monitorId: string | null = null;
    let cleanupCalled = false;

    const setupMonitoring = async () => {
      if (isSettingUp) return; // Prevent duplicate setups
      setIsSettingUp(true);

      try {
        console.log('Setting up monitor for:', { symbol, walletAddress });

        // Create or retrieve token monitor from backend
        const response = await fetch(`${API_BASE}/monitor/token-events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
          },
          body: JSON.stringify({ address: walletAddress, symbol }),
        });

        const data = await response.json();
        console.log('Monitor setup response:', data);

        if (!data.success) {
          throw new Error(data.error || 'Failed to setup monitor');
        }

        monitorId = data.data.monitorId;

        // WebSocket setup
        const wsUrl = `wss://api.allcaps.lol/ws`; // Replace with your WebSocket endpoint
        console.log('Connecting to WebSocket:', wsUrl);

        // Close any existing connection
        if (wsConnection) {
          wsConnection.close();
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connected, subscribing to:', monitorId);
          ws.send(JSON.stringify({ type: 'subscribe', monitorId }));
          setIsMonitoring(true);
          showNotification('WebSocket connection established');
        };

        ws.onmessage = (event) => {
          console.log('Received WebSocket message:', event.data);
          try {
            const tokenEvent: TokenEvent = JSON.parse(event.data);

            if (tokenEvent.type === 'subscribed') {
              showNotification('Successfully subscribed to token monitor');
              return;
            }

            if (tokenEvent.type === 'connection_established') {
              console.log('Connection established message received');
              return;
            }

            // Add the new event to the list
            setEvents((prev) =>
              [
                {
                  type: tokenEvent.type,
                  timestamp: tokenEvent.timestamp,
                  message: tokenEvent.message || 'No message provided',
                  tokenTransfers: tokenEvent.tokenTransfers || [],
                },
                ...prev,
              ].slice(0, 50)
            );

            showNotification(`New ${tokenEvent.type.toLowerCase()} event detected`);
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          showNotification('Failed to establish WebSocket connection', 'error');
          setIsMonitoring(false);
        };

        ws.onclose = (event) => {
          console.log('WebSocket closed:', event);
          setIsMonitoring(false);
          if (!cleanupCalled && event.code !== 1000) {
            showNotification('WebSocket connection lost', 'error');
          }
        };

        setWsConnection(ws);
      } catch (error) {
        console.error('Error setting up token monitoring:', error);
        showNotification(
          error instanceof Error ? error.message : 'Failed to set up token monitoring',
          'error'
        );
      } finally {
        setIsSettingUp(false);
      }
    };

    setupMonitoring();

    // Cleanup function
    return () => {
      cleanupCalled = true;
      setIsSettingUp(false);

      if (monitorId) {
        console.log('Cleaning up monitor:', monitorId);
        fetch(`${API_BASE}/monitor/token-events/${monitorId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
          },
        }).catch((error) => {
          console.error('Error cleaning up monitor:', error);
        });
      }

      if (wsConnection) {
        console.log('Closing WebSocket connection');
        wsConnection.close();
        setWsConnection(null);
      }
    };
  }, [walletAddress, symbol, apiKey]); // Dependencies

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e1f2e] p-6 rounded-xl max-w-md w-full relative">
        {/* Notification */}
        {notification && (
          <div
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 p-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white text-sm transition-all`}
          >
            {notification.message}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl text-[#9945FF] font-semibold mb-4">
          Token Monitor: {symbol}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Activity className={`w-5 h-5 ${isMonitoring ? 'text-green-500' : 'text-red-500'}`} />
            <span>Status: {isSettingUp ? 'Connecting...' : isMonitoring ? 'Monitoring' : 'Disconnected'}</span>
          </div>

          <div className="bg-[#2a2b3d] rounded-lg p-4">
            <h4 className="text-white mb-2">Recent Activity:</h4>
            {events.length === 0 ? (
              <p className="text-white/50 text-sm">No events detected yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {events.map((event, index) => (
                  <div key={index} className="text-sm text-white/80 bg-[#1e1f2e] p-2 rounded">
                    <div className="flex justify-between">
                      <span>{event.type}</span>
                      <span className="text-white/50">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {event.message && <p className="text-white/60 text-xs mt-1">{event.message}</p>}
                    {event.tokenTransfers?.length > 0 && (
                      <ul className="text-white/70 text-xs mt-1">
                        {event.tokenTransfers.map((transfer, i) => (
                          <li key={i}>
                            {transfer.from} → {transfer.to} ({transfer.amount} {transfer.token})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-white/50">
            Monitoring wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenMonitor;

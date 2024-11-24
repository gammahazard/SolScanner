import type { ApiResponse, HolderData } from '@/types'
import { COMMON_TOKENS } from './constants'

export const API_BASE = 'https://api.allcaps.lol/api'

// Get API key from localStorage
const getApiKey = () => localStorage.getItem('apiKey');

// Helper function to add API key to headers
const getHeaders = () => {
  const apiKey = getApiKey();
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || ''
  };
};

// Validate API key
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/validate`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}
export async function scanAllTokens(): Promise<HolderData[]> {
  const holderData = new Map<string, HolderData>();
  
  for (const [tokenName, tokenAddress] of Object.entries(COMMON_TOKENS)) {
    try {
      const response = await fetch(`${API_BASE}/tokens/holders/${tokenAddress}`, {
        method: 'POST',
        headers: getHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid or missing API key');
      }

      if (!response.ok) continue;

      const data: ApiResponse = await response.json();
      if (!data.holders) continue;

      data.holders.forEach(holder => {
        if (!holderData.has(holder.address)) {
          holderData.set(holder.address, {
            address: holder.address,
            holdings: {},
            tokenCount: 0
          });
        }

        const holderInfo = holderData.get(holder.address)!;
        holderInfo.holdings[tokenName] = {
          amount: holder.amount,
          percentage: holder.percentage,
          rank: holder.rank || 0
        };
        holderInfo.tokenCount++;
      });
    } catch (error) {
      console.error(`Error processing ${tokenName}:`, error);
      // If it's an API key error, we should break the loop
      if (error instanceof Error && error.message.includes('API key')) {
        break;
      }
    }
  }

  return Array.from(holderData.values())
    .filter(holder => holder.tokenCount > 1)
    .sort((a, b) => b.tokenCount - a.tokenCount);
}

// Add any other API functions you need...
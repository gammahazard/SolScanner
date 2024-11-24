export interface TokenHolding {
    amount: number;
    percentage: string;
    rank: number;
  }
  
  export interface HolderData {
    address: string;
    holdings: Record<string, TokenHolding>;
    tokenCount: number;
  }
  
  export interface ApiResponse {
    token: string;
    holders: Array<{
      address: string;
      amount: number;
      percentage: string;
      rank: number;
    }>;
    totalSupply: number;
    totalHolders: number;
    lastUpdate: number;
  }

  export interface TokenInfo {
    balance: string;
    decimals: number;
    rank?: number;
    percentage?: string;
  }
  
  export interface TokenContent {
    symbol: string;
    decimals: number;
  }
  
  interface WhaleTokenHolding {
    id: string;
    content: TokenContent;
    interface: string;
    amount: string;
    address: string; // mint address
    ownership?: {
      frozen: boolean;
      owner: string;
    };
    mutable?: boolean;
    burnt?: boolean;
    royaltyInfo?: Array<{
      address: string;
      share: number;
      verified: boolean;
    }>;
  }
  
  export interface WhaleAssets {
    items: WhaleTokenHolding[];
  }
  
  export interface WhaleNotification {
    id: number;
    type: 'buy' | 'sell' | 'connection';
    message: string;
    timestamp: string;
    signature?: string;
  }

  export interface Ownership {
    owner: string;
    renounced: boolean;
  }
  
  export interface RoyaltyInfo {
    address: string;
    verified: boolean;
    share: number;
  }
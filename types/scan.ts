// types/scan.ts
export interface TokenHolding {
    percentage: string;
    amount: string;
    decimals: number;
    rank: number;
  }
  
  export interface Holdings {
    [symbol: string]: TokenHolding;
  }
  
  export interface HolderResult {
    address: string;
    tokenCount: number;
    tokens: string[];
    holdings: Holdings;
  }
  
  export interface ScanResult {
    symbol: string;
    holdersFound: number;
    totalHolders?: number;
    processedAccounts?: number;
  }
  
  export interface ScanData {
    sessionId: string;
    processedCount: number;
    totalAccounts: number;
    symbol: string;
    currentToken: string;
  }
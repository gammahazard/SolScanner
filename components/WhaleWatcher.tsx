'use client';
import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useApiKeyStore } from '@/lib/hooks/useApiKey';
import ComingSoon from './ComingSoon';
import { API_BASE } from '@/lib/api';  
import Image from 'next/image';
interface TokenContent {
  symbol: string;
  name: string;
  decimals: number;
  description?: string;
  image?: string;
}

interface PriceInfo {
  pricePerToken: number;
  totalValue: number;
  currency: string;
}

interface Token {
  id: string;
  balance: string;
  percentageHeld: string;
  content: TokenContent;
  priceInfo: PriceInfo;
}

const WhaleWatcher = () => {
  const [address, setAddress] = useState('');
  const [assets, setAssets] = useState<Token[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { isValid, apiKey } = useApiKeyStore();

  const fetchWalletAssets = async () => {
    if (!address) return;
    if (!isValid) {
      setError('Please enter a valid API key first');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setAssets([]);
    setFilteredAssets([]);
  
    try {
      const response = await fetch(`${API_BASE}/whale/assets`, {  // Use API_BASE
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey || ''
        },
        body: JSON.stringify({ address }),
      });
  
      if (response.status === 401 || response.status === 403) {
        setError('Invalid or expired API key');
        return;
      }
  
      const data = await response.json();
      if (data.success) {
        setAssets(data.assets.items);
        setFilteredAssets(data.assets.items);
      } else {
        setError(data.error || 'Failed to fetch wallet assets');
      }
    } catch (err) {
      console.error('Error fetching wallet assets:', err);
      setError('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    const sortedAssets = [...filteredAssets];  // 

    if (option === 'highest-value') {
      sortedAssets.sort((a, b) => b.priceInfo.totalValue - a.priceInfo.totalValue);
    } else if (option === 'lowest-value') {
      sortedAssets.sort((a, b) => a.priceInfo.totalValue - b.priceInfo.totalValue);
    } else if (option === 'highest-percentage') {
      sortedAssets.sort(
        (a, b) => parseFloat(b.percentageHeld) - parseFloat(a.percentageHeld)
      );
    }

    setFilteredAssets(sortedAssets);
};


const handleWatchClick = () => {  // 
  setShowComingSoon(true);
};

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = assets.filter((asset) =>
      asset.content.symbol.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredAssets(filtered);
  };



  return (
    <div className="space-y-4">
      <ComingSoon 
        isVisible={showComingSoon}
        message="Live token event notifications"
        onClose={() => setShowComingSoon(false)}
      />

      {/* Search Section */}
      <div className="bg-[#1e1f2e] rounded-xl p-6">
        <h3 className="text-[#9945FF] text-xl mb-4">Enter Wallet Address</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address..."
            className="w-full px-4 py-2 bg-[#2a2b3d] rounded-lg text-white border border-[#9945FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid}
          />
          <button
            onClick={fetchWalletAssets}
            disabled={isLoading || !address || !isValid}
            className="px-6 py-2 bg-[#9945FF] text-white rounded-lg hover:bg-[#7d37d6] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Sorting and Search Options */}
      {(assets.length > 0 || isLoading) && (
        <div className="bg-[#1e1f2e] rounded-xl p-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleSort('highest-value')}
              className={`px-4 py-2 rounded-lg ${
                sortOption === 'highest-value' ? 'bg-[#9945FF]' : 'bg-[#2a2b3d]'
              } hover:bg-[#7d37d6] text-white transition-colors`}
            >
              Highest Value
            </button>
            <button
              onClick={() => handleSort('lowest-value')}
              className={`px-4 py-2 rounded-lg ${
                sortOption === 'lowest-value' ? 'bg-[#9945FF]' : 'bg-[#2a2b3d]'
              } hover:bg-[#7d37d6] text-white transition-colors`}
            >
              Lowest Value
            </button>
            <button
              onClick={() => handleSort('highest-percentage')}
              className={`px-4 py-2 rounded-lg ${
                sortOption === 'highest-percentage'
                  ? 'bg-[#9945FF]'
                  : 'bg-[#2a2b3d]'
              } hover:bg-[#7d37d6] text-white transition-colors`}
            >
              Highest % of Supply
            </button>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by ticker..."
            className="px-4 py-2 bg-[#2a2b3d] rounded-lg text-white border border-[#9945FF] focus:outline-none min-w-[200px]"
          />
        </div>
      )}

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((token) => (
          <div key={token.id} className="relative p-6 bg-[#2a2b3d] rounded-lg">
            {/* Coming Soon Bell Icon */}
            <button
              onClick={() => handleWatchClick(token.content.symbol)}
              className="absolute top-3 left-3 p-1.5 rounded-full bg-[#9945FF]/50 hover:bg-[#7d37d6] group transition-colors"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute left-full ml-2 whitespace-nowrap bg-[#2a2b3d] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Coming Soon!
              </span>
            </button>

            {/* Token Image */}
            {token.content.image && (
  <Image
    src={token.content.image}
    alt={`${token.content.symbol} Token`}
    width={48}  // 12 * 4 (w-12)
    height={48}
    className="absolute top-3 right-3 rounded-full border border-white/20"
  />
)}

            {/* Token Details */}
            <div className="mt-8">
              <h4 className="text-center text-2xl text-[#9945FF] font-bold">
                {token.content.symbol}
              </h4>
              <p className="text-center text-sm text-[#9ca3af] mt-1">
                {token.content.name}
              </p>
              {token.content.description && (
                <p className="text-sm text-[#cccccc] mt-4 p-3 bg-[#1e1f2e] rounded-lg line-clamp-3">
                  {token.content.description}
                </p>
              )}
              <div className="flex flex-col items-center mt-4 space-y-2">
                <p className="text-base text-white">Balance: {token.balance}</p>
                <p className="text-sm text-[#9ca3af]">
                  % of Supply: {token.percentageHeld}
                </p>
                <p className="text-sm text-[#9ca3af]">
                  Value: {token.priceInfo.totalValue} {token.priceInfo.currency}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {!isLoading && address && filteredAssets.length === 0 && (
        <div className="bg-[#1e1f2e] p-4 rounded-lg text-center text-[#9ca3af]">
          No fungible tokens found for this wallet
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-[#1e1f2e] p-4 rounded-lg text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#9945FF] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#9ca3af] mt-2">Fetching wallet data...</p>
        </div>
      )}
    </div>
  );
};

export default WhaleWatcher;
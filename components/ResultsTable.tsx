import React, { useState } from 'react';
import { EXCHANGE_WALLETS } from '../lib/constants';

interface HoldingData {
  percentage: string;
  amount: string;
  decimals: number;
  rank: number;
}

interface Holdings {
  [symbol: string]: HoldingData;
}

interface Result {
  address: string;
  tokenCount: number;
  tokens: string[];
  holdings: Holdings;
}

interface ResultsTableProps {
  results: Result[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  // Debug logging
  console.log('ResultsTable received results:', results);

  // Hooks must be at the top level, called unconditionally
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  const totalPages = Math.ceil((results?.length || 0) / pageSize);

  const currentResults = results?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Helper to get the display name for a wallet
  const getWalletDisplayName = (address: string) => {
    return EXCHANGE_WALLETS[address] || address;
  };

  if (!results?.length) {
    console.warn('ResultsTable: No results to display', results);
    return (
      <div className="text-center p-6 bg-[#1e1f2e] rounded-xl">
        <p className="text-[#9ca3af]">No results found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1f2e] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-[#9945FF] text-xl">
          Showing holders {pageSize * (currentPage - 1) + 1} to{' '}
          {Math.min(pageSize * currentPage, results.length)} of {results.length}
        </h3>
        <p className="text-[#9ca3af] mt-2">{`Page ${currentPage} of ${totalPages}`}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="p-3 text-left bg-[#2a2b3d] text-[#9945FF] rounded-tl">
                Wallet
              </th>
              <th className="p-3 text-left bg-[#2a2b3d] text-[#9945FF] rounded-tr">
                Holdings
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2b3d]">
            {currentResults.map((holder) => (
              <tr
                key={holder.address}
                className={`bg-[#1e1f2e] hover:bg-[#2a2b3d] transition-colors`}
              >
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <a
                      href={`https://solscan.io/account/${holder.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9945FF] hover:underline font-mono text-sm"
                    >
                      {getWalletDisplayName(holder.address)}
                    </a>
                    <span className="text-[#9ca3af] text-xs">
                      Holds {holder.tokenCount} token{holder.tokenCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-2">
                    {holder.holdings &&
                      Object.entries(holder.holdings).map(([symbol, data]) => (
                        <div
                          key={`${holder.address}-${symbol}`}
                          className="bg-[#2a2b3d] p-2 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-[#9945FF]">{symbol}</span>
                            <span className="text-white">
                              {parseFloat(data.amount).toLocaleString()} tokens
                            </span>
                          </div>
                          <div className="flex flex-col items-start sm:items-end">
                            <span className="text-[#9ca3af] text-sm">
                              Rank #{data.rank}
                            </span>
                            <span className="text-[#9ca3af] text-sm">
                              {parseFloat(data.percentage).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#2a2b3d] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#363748] transition-colors"
        >
          Previous
        </button>
        <span className="text-[#9ca3af]">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#2a2b3d] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#363748] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ResultsTable;

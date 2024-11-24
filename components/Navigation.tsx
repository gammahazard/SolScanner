'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="bg-[#13141f] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#9945FF] mb-4">
          Solana Token Scanner
        </h1>
        
        <p className="text-[#9ca3af] text-lg text-center mb-8">
          Analyze top holders across multiple tokens and track whale movements
        </p>

        <div className="bg-[#1e1f2e] rounded-xl p-4 mb-8">
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className={`px-6 py-2 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'bg-[#9945FF] text-white'
                  : 'text-[#9ca3af] hover:bg-[#2a2b3d]'
              }`}
            >
              Holder Scanner
            </Link>
            <Link
              href="/whale-watcher"
              className={`px-6 py-2 rounded-lg transition-colors ${
                pathname === '/whale-watcher'
                  ? 'bg-[#9945FF] text-white'
                  : 'text-[#9ca3af] hover:bg-[#2a2b3d]'
              }`}
            >
              Whale Watcher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface ClearButtonProps {
  onClear: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => {
  return (
    <button
      onClick={onClear}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 ease-in-out"
      aria-label="Clear scan results"
    >
      <Trash2 className="w-5 h-5" />
      <span>Clear Results</span>
    </button>
  );
};

// Add both named and default exports
export default ClearButton;
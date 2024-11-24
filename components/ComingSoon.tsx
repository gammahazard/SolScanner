// components/ComingSoon.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ComingSoonProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const ComingSoon = ({ isVisible, message, onClose }: ComingSoonProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-[#9945FF] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <p className="text-sm opacity-80">Upgrade to a premium plan for live tracking!</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
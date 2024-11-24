import React from 'react';
import { Loader2Icon } from 'lucide-react';

interface StopButtonProps {
  isScanning: boolean;
  onStop: () => void;
  isStopping?: boolean;
}

const StopButton = ({ isScanning, onStop, isStopping = false }: StopButtonProps) => {
  return (
    <button
      onClick={onStop}
      disabled={!isScanning || isStopping}
      className={`
        px-4 py-2 rounded-lg font-semibold
        flex items-center gap-2
        transition-all duration-200
        ${isScanning 
          ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
          : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50'
        }
        disabled:cursor-not-allowed disabled:opacity-50
      `}
    >
      {isStopping ? (
        <>
          <Loader2Icon className="w-5 h-5 animate-spin" />
          <span>Stopping...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
              fill="currentColor"
            />
          </svg>
          <span>STOP</span>
        </>
      )}
    </button>
  );
};

export default StopButton;
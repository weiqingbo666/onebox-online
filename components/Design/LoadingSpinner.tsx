import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-[#c3f53b] ${className}`} style={{ width: '1.25em', height: '1.25em' }}></div>
  );
};

export default LoadingSpinner;

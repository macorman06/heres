import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...',
  size = 'medium',
}) => {
  const sizeMap = {
    small: '30px',
    medium: '50px',
    large: '70px',
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50">
      <ProgressSpinner
        style={{ width: sizeMap[size], height: sizeMap[size] }}
        strokeWidth="4"
        animationDuration="1s"
      />
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">{message}</p>
    </div>
  );
};

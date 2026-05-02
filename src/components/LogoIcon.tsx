import React from 'react';

export const LogoIcon = ({ className, size = 24 }: { className?: string; size?: number | string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Mountain shape */}
      <path d="M 12 60 L 32 30 L 42 42 L 50 20 L 58 42 L 68 30 L 88 60" />
      
      {/* Eye outer shape */}
      <path d="M 15 70 Q 50 40 85 70 Q 50 100 15 70 Z" />
      
      {/* Eye pupil/shutter outer ring */}
      <circle cx="50" cy="70" r="14" strokeWidth="6" />
      
      {/* Eye pupil center */}
      <circle cx="50" cy="70" r="4" fill="currentColor" stroke="none" />
      
      {/* Shutter lines */}
      <path d="M 50 56 L 50 66 M 50 74 L 50 84 M 36 70 L 46 70 M 54 70 L 64 70 M 40 60 L 47 67 M 53 73 L 60 80 M 60 60 L 53 67 M 47 73 L 40 80" strokeWidth="2" />
    </svg>
  );
};


// HeartIcon.tsx
import React from 'react';

interface HeartIconProps {
  isLiked: boolean;
  onClick: () => void;
}

const HeartIcon: React.FunctionComponent<HeartIconProps> = ({ isLiked, onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-6 h-6 cursor-pointer ${
      isLiked ? 'fill-red-500' : 'fill-none'
    } stroke-current text-gray-500`}
    onClick={onClick}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.42 3.42 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87C15.46 5.99 16.96 5 18.5 5 20.58 5 22 6.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </svg>
);

export default HeartIcon;

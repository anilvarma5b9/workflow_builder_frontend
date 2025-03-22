'use client';

import React from 'react';

interface FabAddProps {
  name: string;
  action: () => void;
}

const FabAdd: React.FC<FabAddProps> = ({ name, action }) => {
  return (
    <button
      onClick={action}
      className="fixed bottom-16 right-6 w-14 h-14 bg-template-color-primary text-white flex items-center justify-center rounded-full shadow-lg hover:bg-template-color-secondary transition"
      aria-label={name}
      title={name}
    >
      <span className="text-2xl font-bold">+</span>
    </button>
  );
};

export default FabAdd;

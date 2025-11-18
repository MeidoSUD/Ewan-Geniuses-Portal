import React from 'react';
import { Hexagon } from 'lucide-react';

// Simulating the user's uploaded logo
export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-white shadow-lg shadow-primary/30">
        <Hexagon size={32} fill="currentColor" strokeWidth={0} />
        <span className="absolute text-xl font-bold tracking-tighter">GA</span>
      </div>
      <h1 className="mt-3 text-2xl font-bold text-slate-800 tracking-tight">GlobalAuth</h1>
    </div>
  );
};

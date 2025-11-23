import React from 'react';
import { Hexagon } from 'lucide-react';

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* 
        TODO: Replace the src below with your actual logo path. 
        Example: src="/logo.png" if you place logo.png in the public folder.
        For now, using a placeholder text styling that looks like a logo if image fails.
      */}
      <div className="relative flex h-20 w-20 items-center justify-center">
         {/* fallback SVG if image is missing */}
         <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30">
            <Hexagon size={40} fill="currentColor" strokeWidth={0} />
            <span className="absolute text-2xl font-bold tracking-tighter">GA</span>
         </div>
         
         {/* Uncomment this line when you add your logo file */}
         {/* <img src="/logo.png" alt="GlobalAuth Logo" className="absolute inset-0 h-full w-full object-contain" /> */}
      </div>
      <h1 className="mt-4 text-2xl font-bold text-text tracking-tight">Ewan Geniuses</h1>
    </div>
  );
};
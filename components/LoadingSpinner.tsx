import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-slate-300 font-medium animate-pulse">正在施展 AI 魔法去除浮水印...</p>
      <p className="text-xs text-slate-500">這可能需要幾秒鐘</p>
    </div>
  );
};
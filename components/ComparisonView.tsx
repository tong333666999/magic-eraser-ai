import React, { useState } from 'react';

interface ComparisonViewProps {
  originalImage: string;
  processedImage: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, processedImage }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `cleaned-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      
      {/* Image Display Area */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black aspect-auto border border-slate-700"
        onMouseDown={() => setShowOriginal(true)}
        onMouseUp={() => setShowOriginal(false)}
        onTouchStart={() => setShowOriginal(true)}
        onTouchEnd={() => setShowOriginal(false)}
      >
        <img 
          src={showOriginal ? originalImage : processedImage} 
          alt="Result" 
          className="w-full h-auto object-contain transition-opacity duration-200"
        />
        
        {/* Label Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 pointer-events-none select-none">
          {showOriginal ? '原始圖片 (按住查看)' : '去浮水印後'}
        </div>

        {/* Instruction overlay for first time users */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <span className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                長按圖片對比原圖
            </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button 
          onClick={handleDownload}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          下載圖片
        </button>
      </div>
    </div>
  );
};
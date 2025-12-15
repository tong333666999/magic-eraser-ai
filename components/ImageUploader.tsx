import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案 (JPG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onImageSelected(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div 
      className="w-full max-w-md mx-auto aspect-[4/3] border-2 border-dashed border-slate-600 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer flex flex-col items-center justify-center p-6 text-center group"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
      />
      
      <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">點擊或拖放圖片</h3>
      <p className="text-sm text-slate-400">支援 JPG, PNG, WEBP</p>
      <p className="text-xs text-slate-500 mt-4">適合手機與桌面端使用</p>
    </div>
  );
};
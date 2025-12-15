import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ComparisonView } from './components/ComparisonView';
import { APISettings } from './components/APISettings';
import { removeWatermark } from './services/aiService';
import { AppState, APIProvider, APIConfig } from './types';

const API_CONFIG_KEY = 'ai-watermark-remover-api-config';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // API Configuration
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(API_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    // Default config - user must enter their own API key
    return {
      provider: APIProvider.PICWISH,
      apiKey: ''
    };
  });

  // Save API config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(apiConfig));
  }, [apiConfig]);

  const handleImageSelected = useCallback(async (base64: string, type: string) => {
    setOriginalImage(base64);
    setMimeType(type);
    setAppState(AppState.IDLE); // Ready to process
    setErrorMsg(null);
  }, []);

  const handleStartProcessing = async () => {
    if (!originalImage || !mimeType) return;

    // Check if API key is configured
    if (!apiConfig.apiKey) {
      setAppState(AppState.ERROR);
      setErrorMsg("請先在 API 設置中輸入你的 API Key");
      return;
    }

    setAppState(AppState.PROCESSING);
    setErrorMsg(null);

    try {
      const resultBase64 = await removeWatermark(originalImage, mimeType, apiConfig);
      setProcessedImage(resultBase64);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      const errorMessage = err?.message || "處理失敗，請稍後再試。";
      setErrorMsg(errorMessage);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setProcessedImage(null);
    setMimeType('');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-900 text-slate-50 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="w-full p-6 text-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          AI 智能去浮水印
        </h1>
        <p className="text-slate-400 text-sm mt-1">一鍵移除浮水印、文字與Logo</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl px-4 py-8 flex flex-col items-center justify-start gap-8">

        {/* API Settings */}
        <APISettings
          currentConfig={apiConfig}
          onConfigChange={setApiConfig}
        />

        {/* API Key Reminder */}
        {!apiConfig.apiKey && (
          <div className="w-full max-w-2xl p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-amber-400 text-xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-300 mb-1">需要 API Key 才能使用</h3>
                <p className="text-sm text-slate-300 mb-3">
                  請點擊上方「API 設置」輸入你的 API Key。推薦使用以下平台（免費額度）：
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href="https://picwish.com/image-watermark-removal-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md transition-colors font-medium"
                  >
                    ✅ PicWish - 50 免費 credits（推薦）
                  </a>
                  <a
                    href="https://www.segmind.com/pixelflows/ai-watermark-remover/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Segmind - 支援 CORS
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State: No Image Selected */}
        {!originalImage && (
          <div className="w-full animate-fade-in-up">
            <ImageUploader onImageSelected={handleImageSelected} />

            {/* Features List */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-10 h-10 mx-auto bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center mb-3">
                  ⚡
                </div>
                <h3 className="font-semibold text-slate-200">快速處理</h3>
                <p className="text-xs text-slate-500 mt-2">數秒內完成修復</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-10 h-10 mx-auto bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-3">
                  📱
                </div>
                <h3 className="font-semibold text-slate-200">手機友善</h3>
                <p className="text-xs text-slate-500 mt-2">隨時隨地輕鬆使用</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-10 h-10 mx-auto bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center mb-3">
                  ✨
                </div>
                <h3 className="font-semibold text-slate-200">AI 驅動</h3>
                <p className="text-xs text-slate-500 mt-2">Gemini 2.5 Flash 技術</p>
              </div>
            </div>
          </div>
        )}

        {/* State: Image Selected, Ready to Process */}
        {originalImage && appState === AppState.IDLE && (
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-700">
              <img src={originalImage} alt="Original" className="w-full h-auto" />
              <button 
                onClick={handleReset}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleStartProcessing}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM9 15a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 9 15ZM9 1.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 9 1.5Z" clipRule="evenodd" />
                </svg>
                開始去浮水印
              </button>
              <p className="text-center text-xs text-slate-500">AI 將自動識別並移除不必要的元素</p>
            </div>
          </div>
        )}

        {/* State: Processing */}
        {appState === AppState.PROCESSING && (
          <div className="flex-1 flex flex-col items-center justify-center">
             <LoadingSpinner />
          </div>
        )}

        {/* State: Success */}
        {appState === AppState.SUCCESS && processedImage && originalImage && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            <ComparisonView originalImage={originalImage} processedImage={processedImage} />
            <button 
              onClick={handleReset}
              className="text-slate-400 hover:text-white text-sm py-2 underline underline-offset-4"
            >
              處理另一張圖片
            </button>
          </div>
        )}

        {/* State: Error */}
        {appState === AppState.ERROR && (
          <div className="w-full max-w-md p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <p className="text-red-400 mb-4">{errorMsg || "發生未知錯誤"}</p>
            <button 
              onClick={() => setAppState(AppState.IDLE)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              重試
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-600 text-xs border-t border-slate-800/50">
        <p>Powered by Google Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
}
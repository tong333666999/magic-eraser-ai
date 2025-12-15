import React, { useState } from 'react';
import { APIProvider, APIConfig } from '../types';

interface APISettingsProps {
  onConfigChange: (config: APIConfig) => void;
  currentConfig: APIConfig;
}

const PROVIDER_INFO: Record<APIProvider, { name: string; freeCredits: string; recommended?: boolean; note?: string }> = {
  [APIProvider.PICWISH]: {
    name: 'PicWish',
    freeCredits: '50 免費 credits',
    recommended: true,
    note: '推薦：支援瀏覽器直接使用，免費額度最多'
  },
  [APIProvider.SEGMIND]: {
    name: 'Segmind',
    freeCredits: '註冊獲取額度',
    note: '支援 CORS，適合瀏覽器使用'
  },
  [APIProvider.WATERMARKREMOVER]: {
    name: 'WatermarkRemover',
    freeCredits: '15GB + 45 credits',
    note: '需要後端支援，不適合純前端應用'
  },
};

export const APISettings: React.FC<APISettingsProps> = ({ onConfigChange, currentConfig }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [provider, setProvider] = useState<APIProvider>(currentConfig.provider);
  const [picwishKey, setPicwishKey] = useState(currentConfig.provider === APIProvider.PICWISH ? currentConfig.apiKey : '');
  const [watermarkremoverKey, setWatermarkremoverKey] = useState(currentConfig.provider === APIProvider.WATERMARKREMOVER ? currentConfig.apiKey : '');
  const [segmindKey, setSegmindKey] = useState(currentConfig.provider === APIProvider.SEGMIND ? currentConfig.apiKey : '');

  const handleSave = () => {
    let apiKey = '';

    switch (provider) {
      case APIProvider.PICWISH:
        apiKey = picwishKey;
        break;
      case APIProvider.WATERMARKREMOVER:
        apiKey = watermarkremoverKey;
        break;
      case APIProvider.SEGMIND:
        apiKey = segmindKey;
        break;
    }

    if (!apiKey.trim()) {
      alert('請輸入 API Key');
      return;
    }

    onConfigChange({
      provider,
      apiKey: apiKey.trim()
    });

    setIsExpanded(false);
  };

  const handleClear = () => {
    if (confirm('確定要清除 API Key 嗎？清除後需要重新輸入才能使用。')) {
      setPicwishKey('');
      setWatermarkremoverKey('');
      setSegmindKey('');
      onConfigChange({
        provider: APIProvider.PICWISH,
        apiKey: ''
      });
      setIsExpanded(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">API 設置</span>
          <span className="text-sm text-slate-400">
            (當前: {PROVIDER_INFO[currentConfig.provider].name})
          </span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-slate-800 rounded-lg space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">選擇 AI 提供商</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* PicWish - Recommended */}
              <button
                onClick={() => setProvider(APIProvider.PICWISH)}
                className={`relative py-3 px-4 rounded-lg border-2 transition-all text-left ${
                  provider === APIProvider.PICWISH
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                {PROVIDER_INFO[APIProvider.PICWISH].recommended && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    推薦
                  </div>
                )}
                <div className="font-medium">{PROVIDER_INFO[APIProvider.PICWISH].name}</div>
                <div className="text-xs text-slate-400 mt-1">{PROVIDER_INFO[APIProvider.PICWISH].freeCredits}</div>
                <div className="text-xs text-slate-500 mt-1">{PROVIDER_INFO[APIProvider.PICWISH].note}</div>
              </button>

              {/* Segmind */}
              <button
                onClick={() => setProvider(APIProvider.SEGMIND)}
                className={`py-3 px-4 rounded-lg border-2 transition-all text-left ${
                  provider === APIProvider.SEGMIND
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">{PROVIDER_INFO[APIProvider.SEGMIND].name}</div>
                <div className="text-xs text-slate-400 mt-1">{PROVIDER_INFO[APIProvider.SEGMIND].freeCredits}</div>
                <div className="text-xs text-slate-500 mt-1">{PROVIDER_INFO[APIProvider.SEGMIND].note}</div>
              </button>

              {/* WatermarkRemover - Not recommended for frontend */}
              <button
                onClick={() => setProvider(APIProvider.WATERMARKREMOVER)}
                className={`py-3 px-4 rounded-lg border-2 transition-all text-left opacity-60 ${
                  provider === APIProvider.WATERMARKREMOVER
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">{PROVIDER_INFO[APIProvider.WATERMARKREMOVER].name}</div>
                <div className="text-xs text-slate-400 mt-1">{PROVIDER_INFO[APIProvider.WATERMARKREMOVER].freeCredits}</div>
                <div className="text-xs text-red-400 mt-1">{PROVIDER_INFO[APIProvider.WATERMARKREMOVER].note}</div>
              </button>
            </div>
          </div>

          {/* PicWish API Key Input */}
          {provider === APIProvider.PICWISH && (
            <div>
              <label htmlFor="picwish-key" className="block text-sm font-medium mb-2">
                PicWish API Key
                <a
                  href="https://picwish.com/image-watermark-removal-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  (獲取 API Key - 免費 50 credits)
                </a>
              </label>
              <input
                id="picwish-key"
                type="password"
                value={picwishKey}
                onChange={(e) => setPicwishKey(e.target.value)}
                placeholder="輸入你的 PicWish API Key"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <p className="mt-1 text-xs text-slate-400">
                你的 API Key 僅保存在瀏覽器本地，不會上傳到任何服務器
              </p>
              <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-300">
                ✅ 推薦：支援瀏覽器直接使用，註冊即贈送 50 個免費 credits
              </div>
            </div>
          )}

          {/* Segmind API Key Input */}
          {provider === APIProvider.SEGMIND && (
            <div>
              <label htmlFor="segmind-key" className="block text-sm font-medium mb-2">
                Segmind API Key
                <a
                  href="https://www.segmind.com/pixelflows/ai-watermark-remover/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  (獲取 API Key)
                </a>
              </label>
              <input
                id="segmind-key"
                type="password"
                value={segmindKey}
                onChange={(e) => setSegmindKey(e.target.value)}
                placeholder="輸入你的 Segmind API Key"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <p className="mt-1 text-xs text-slate-400">
                你的 API Key 僅保存在瀏覽器本地，不會上傳到任何服務器
              </p>
              <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
                ℹ️ Segmind 明確支援 CORS，適合瀏覽器使用。處理時間約 5-7 秒。
              </div>
            </div>
          )}

          {/* WatermarkRemover API Key Input */}
          {provider === APIProvider.WATERMARKREMOVER && (
            <div>
              <label htmlFor="watermarkremover-key" className="block text-sm font-medium mb-2">
                WatermarkRemover (PixelBin) API Key
                <a
                  href="https://pixelbin.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  (獲取 API Key - 免費 15GB + 45 credits)
                </a>
              </label>
              <input
                id="watermarkremover-key"
                type="password"
                value={watermarkremoverKey}
                onChange={(e) => setWatermarkremoverKey(e.target.value)}
                placeholder="輸入你的 PixelBin API Key"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <p className="mt-1 text-xs text-slate-400">
                你的 API Key 僅保存在瀏覽器本地，不會上傳到任何服務器
              </p>
              <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
                ⚠️ 警告：PixelBin 需要後端伺服器生成 signed URL，不適合純前端應用。建議使用 PicWish 或 Segmind。
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-slate-300 mb-1">隱私說明</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• API Key 僅保存在你的瀏覽器本地（localStorage）</li>
                  <li>• 不會上傳到本網站的服務器</li>
                  <li>• 直接從你的瀏覽器連接到 AI 提供商</li>
                  <li>• 使用公共電腦時，請記得清除 API Key</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
            >
              保存設置
            </button>
            {currentConfig.apiKey && (
              <button
                onClick={handleClear}
                className="py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors border border-red-600/30"
              >
                清除
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

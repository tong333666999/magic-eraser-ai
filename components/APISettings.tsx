import React, { useState } from 'react';
import { APIProvider, APIConfig } from '../types';

interface APISettingsProps {
  onConfigChange: (config: APIConfig) => void;
  currentConfig: APIConfig;
}

export const APISettings: React.FC<APISettingsProps> = ({ onConfigChange, currentConfig }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [provider, setProvider] = useState<APIProvider>(currentConfig.provider);
  const [geminiKey, setGeminiKey] = useState(currentConfig.provider === APIProvider.GEMINI ? currentConfig.apiKey : '');
  const [openrouterKey, setOpenrouterKey] = useState(currentConfig.provider === APIProvider.OPENROUTER ? currentConfig.apiKey : '');

  const handleSave = () => {
    const apiKey = provider === APIProvider.GEMINI ? geminiKey : openrouterKey;

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
            (當前: {currentConfig.provider === APIProvider.GEMINI ? 'Gemini' : 'OpenRouter'})
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
            <label className="block text-sm font-medium mb-2">選擇 AI 提供商</label>
            <div className="flex gap-3">
              <button
                onClick={() => setProvider(APIProvider.GEMINI)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  provider === APIProvider.GEMINI
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">Gemini</div>
                <div className="text-xs text-slate-400">Google AI</div>
              </button>
              <button
                onClick={() => setProvider(APIProvider.OPENROUTER)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  provider === APIProvider.OPENROUTER
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">OpenRouter</div>
                <div className="text-xs text-slate-400">多模型支持</div>
              </button>
            </div>
          </div>

          {/* Gemini API Key Input */}
          {provider === APIProvider.GEMINI && (
            <div>
              <label htmlFor="gemini-key" className="block text-sm font-medium mb-2">
                Gemini API Key
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  (獲取 API Key)
                </a>
              </label>
              <input
                id="gemini-key"
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="輸入你的 Gemini API Key"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <p className="mt-1 text-xs text-slate-400">
                你的 API Key 僅保存在瀏覽器本地，不會上傳到任何服務器
              </p>
            </div>
          )}

          {/* OpenRouter API Key Input */}
          {provider === APIProvider.OPENROUTER && (
            <div>
              <label htmlFor="openrouter-key" className="block text-sm font-medium mb-2">
                OpenRouter API Key
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  (獲取 API Key)
                </a>
              </label>
              <input
                id="openrouter-key"
                type="password"
                value={openrouterKey}
                onChange={(e) => setOpenrouterKey(e.target.value)}
                placeholder="輸入你的 OpenRouter API Key"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <p className="mt-1 text-xs text-slate-400">
                你的 API Key 僅保存在瀏覽器本地，不會上傳到任何服務器
              </p>
              <p className="mt-2 text-xs text-amber-400">
                ⚠️ 注意：OpenRouter 的視覺模型目前僅支持圖片分析，暫不支持圖片編輯
              </p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
          >
            保存設置
          </button>
        </div>
      )}
    </div>
  );
};

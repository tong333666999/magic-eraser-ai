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

  const handleClear = () => {
    if (confirm('確定要清除 API Key 嗎？清除後需要重新輸入才能使用。')) {
      setGeminiKey('');
      setOpenrouterKey('');
      onConfigChange({
        provider: APIProvider.GEMINI,
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
              <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300">
                ⚠️ 注意：Gemini 目前不支持圖片編輯功能，僅能用於圖片分析
              </div>
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

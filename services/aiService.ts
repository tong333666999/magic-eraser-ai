import { APIProvider, APIConfig } from '../types';
import { removeWatermark as removeWatermarkGemini } from './geminiService';
import { removeWatermarkWithOpenRouter } from './openrouterService';

/**
 * Unified AI Service that routes to different providers
 */
export const removeWatermark = async (
  base64Image: string,
  mimeType: string,
  config: APIConfig
): Promise<string> => {
  switch (config.provider) {
    case APIProvider.GEMINI:
      return removeWatermarkGemini(base64Image, mimeType, config.apiKey);

    case APIProvider.OPENROUTER:
      return removeWatermarkWithOpenRouter(
        base64Image,
        mimeType,
        config.apiKey,
        config.model || 'google/gemini-2.0-flash-exp:free'
      );

    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
};

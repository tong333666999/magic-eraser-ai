import { APIProvider, APIConfig } from '../types';
import { removeWatermarkWithPicWish } from './picwishService';
import { removeWatermarkWithPixelBin } from './watermarkremoverService';
import { removeWatermarkWithSegmind } from './segmindService';

/**
 * Unified AI Service that routes to different providers
 */
export const removeWatermark = async (
  base64Image: string,
  mimeType: string,
  config: APIConfig
): Promise<string> => {
  switch (config.provider) {
    case APIProvider.PICWISH:
      return removeWatermarkWithPicWish(base64Image, mimeType, config.apiKey);

    case APIProvider.WATERMARKREMOVER:
      return removeWatermarkWithPixelBin(base64Image, mimeType, config.apiKey);

    case APIProvider.SEGMIND:
      return removeWatermarkWithSegmind(base64Image, mimeType, config.apiKey);

    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
};

import { GoogleGenAI } from "@google/genai";

/**
 * Sends an image to Gemini to remove watermarks/text.
 * @param base64Image The base64 string of the image (without the data:image/xxx;base64, prefix if strictly raw, but the SDK handles data URIs mostly fine via inlineData helper or we strip it).
 * @param mimeType The mime type of the image.
 * @param apiKey The Gemini API key (required)
 */
export const removeWatermark = async (
  base64Image: string,
  mimeType: string,
  apiKey?: string
): Promise<string> => {
  // API key is required
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please provide it in the API settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    // 1. Prepare the Prompt
    const prompt = "You are an expert image editor. Remove any watermarks, logos, text overlays, or date stamps from this image. Reconstruct the background seamlessly where the watermark was removed. Return the edited image without any watermarks.";

    // 2. Prepare the Image Part
    const base64Data = base64Image.includes('base64,')
      ? base64Image.split('base64,')[1]
      : base64Image;

    // 3. Try different Gemini models that support image generation
    // Note: Gemini's image editing capabilities are limited
    const models = [
      'gemini-2.0-flash-exp',
      'gemini-exp-1206',
      'gemini-2.0-flash-thinking-exp-1219'
    ];

    let lastError: any = null;

    for (const modelName of models) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        });

        // Check for image in response
        if (response.candidates && response.candidates.length > 0) {
          const parts = response.candidates[0].content.parts;

          // Look for inline image data
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              return `data:image/png;base64,${part.inlineData.data}`;
            }
          }

          // If no image, check if there's text explaining why
          const textParts = parts.filter(p => p.text);
          if (textParts.length > 0) {
            const text = textParts.map(p => p.text).join('\n');
            console.log('Model response:', text);
          }
        }
      } catch (error: any) {
        console.error(`Model ${modelName} failed:`, error);
        lastError = error;
        continue; // Try next model
      }
    }

    // If we got here, no model returned an image
    throw new Error(
      "Gemini 目前不支持直接的圖片編輯功能。\n\n" +
      "建議使用 Replicate 提供的 GFPGAN 模型進行圖像修復，" +
      "或等待 Gemini 的圖片編輯功能正式推出。\n\n" +
      "請在 API 設置中切換到 Replicate 提供商。"
    );

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Provide more helpful error messages
    if (error.message && error.message.includes('not found')) {
      throw new Error("Gemini 模型不可用。請檢查 API Key 或嘗試使用 Replicate。");
    }
    throw error;
  }
};
/**
 * OpenRouter API Service for image processing
 * Uses OpenRouter to access Gemini or other vision models
 */

export const removeWatermarkWithOpenRouter = async (
  base64Image: string,
  mimeType: string,
  apiKey: string,
  model: string = 'google/gemini-2.0-flash-exp:free'
): Promise<string> => {
  try {
    // Prepare the prompt for watermark removal
    const prompt = `You are an expert image editor. Remove any watermarks, logos, text overlays, or date stamps from this image. Reconstruct the background seamlessly where the watermark was removed. Return the edited image.`;

    // Prepare the image data
    const base64Data = base64Image.includes('base64,')
      ? base64Image
      : `data:${mimeType};base64,${base64Image}`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Watermark Remover'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Data
                }
              }
            ]
          }
        ],
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`OpenRouter API Error: ${response.statusText}`);
      }
      throw new Error(`OpenRouter API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Check if the response contains an image
    // Note: Most vision models return text, not images
    // You may need to use a specific image generation model through OpenRouter
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenRouter API');
    }

    // For now, OpenRouter vision models return descriptions, not edited images
    // This is a limitation of current vision models
    throw new Error(`OpenRouter 的視覺模型目前只支持圖片分析，無法直接編輯圖片。建議使用 Gemini 進行去浮水印。\n\n模型回應: ${content}`);

  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
};

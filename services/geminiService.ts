import { GoogleGenAI } from "@google/genai";

/**
 * Sends an image to Gemini to remove watermarks/text.
 * @param base64Image The base64 string of the image (without the data:image/xxx;base64, prefix if strictly raw, but the SDK handles data URIs mostly fine via inlineData helper or we strip it).
 * @param mimeType The mime type of the image.
 * @param apiKey The Gemini API key (optional, falls back to environment variable)
 */
export const removeWatermark = async (
  base64Image: string,
  mimeType: string,
  apiKey?: string
): Promise<string> => {
  // Use provided API key or fall back to environment variable
  const key = apiKey || process.env.API_KEY;

  if (!key) {
    throw new Error("Gemini API key is required. Please provide it in the settings or set GEMINI_API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: key });
  try {
    // 1. Prepare the Prompt
    // We use a specific prompt to guide the model to perform "inpainting" or "cleanup".
    const prompt = "Remove any watermarks, logos, text overlays, or date stamps from this image. Reconstruct the background seamlessly where the watermark was removed to make it look like the original photo. Return ONLY the processed image.";

    // 2. Prepare the Image Part
    // The SDK expects raw base64 data for inlineData.
    // If the input base64Image contains the prefix "data:image/...", we usually strip it.
    const base64Data = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    // 3. Call the Model
    // Using 'gemini-2.5-flash-image' as it is the current standard for general image editing tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
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
      // Config specific to image generation/editing if needed, 
      // but mostly defaults work well for restoration.
    });

    // 4. Extract the Image
    // The response might contain text (if it failed or chatted) or an image.
    // We iterate to find the inlineData.
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct a usable data URI
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image was returned by the AI. It might have refused the request or returned text only.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
/**
 * Segmind AI Watermark Remover API Service
 * API Documentation: https://www.segmind.com/pixelflows/ai-watermark-remover/api
 *
 * Features:
 * - Supports CORS for browser usage
 * - Asynchronous processing with polling
 * - Returns processed image URL
 */

interface SegmindPollResponse {
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  poll_url?: string;
  request_id?: string;
  output?: string;
  error?: string;
}

export const removeWatermarkWithSegmind = async (
  base64Image: string,
  mimeType: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error(
      "Segmind API key is required.\n\n" +
      "獲取免費 API Key：\n" +
      "1. 訪問 https://www.segmind.com\n" +
      "2. 註冊帳號並獲取 API Key\n\n" +
      "Segmind 明確支援 CORS，適合瀏覽器使用"
    );
  }

  try {
    // First, we need to upload the image to get a public URL
    // For now, we'll use the base64 data URL approach
    // Note: Some APIs may not accept data URLs, may need to upload to temporary storage

    const imageDataUrl = base64Image.includes('base64,')
      ? base64Image
      : `data:${mimeType};base64,${base64Image}`;

    // Submit watermark removal request
    const submitResponse = await fetch('https://api.segmind.com/workflows/67ea59aef8ea060b74cf4187-v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Watermark_Image: imageDataUrl
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`Segmind API Error: ${submitResponse.statusText}`);
      }
      throw new Error(`Segmind API Error: ${errorData.message || errorData.error || submitResponse.statusText}`);
    }

    const submitData: SegmindPollResponse = await submitResponse.json();

    if (!submitData.poll_url) {
      throw new Error('No poll URL returned from Segmind API');
    }

    // Poll for result (every 7 seconds as recommended, max 5 minutes)
    const maxPolls = 43; // 5 minutes / 7 seconds ≈ 43 polls
    const pollInterval = 7000; // 7 seconds

    for (let i = 0; i < maxPolls; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const pollResponse = await fetch(submitData.poll_url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!pollResponse.ok) {
        throw new Error(`Failed to check task status: ${pollResponse.statusText}`);
      }

      const pollData: SegmindPollResponse = await pollResponse.json();

      if (pollData.status === 'COMPLETED') {
        // Parse output to get image URL
        if (!pollData.output) {
          throw new Error('No output in completed response');
        }

        let outputData;
        try {
          outputData = JSON.parse(pollData.output);
        } catch {
          throw new Error('Failed to parse output data');
        }

        // Extract image URL from output
        const imageUrl = outputData[0]?.value?.data;

        if (!imageUrl) {
          throw new Error('No image URL in output data');
        }

        // Download the result image and convert to base64
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageBlob);
        });

      } else if (pollData.status === 'FAILED') {
        throw new Error(`Watermark removal failed: ${pollData.error || 'Unknown error'}`);
      }

      // Continue polling if status is 'QUEUED' or 'PROCESSING'
    }

    throw new Error('Task timeout: Processing took longer than 5 minutes');

  } catch (error: any) {
    console.error('Segmind API Error:', error);

    if (error.message?.includes('API key') || error.message?.includes('Unauthorized')) {
      throw new Error('Invalid Segmind API Key. 請在 https://www.segmind.com 註冊獲取 API Key');
    }

    if (error.message?.includes('data URL')) {
      throw new Error(
        'Segmind 不支援 base64 data URL。\n\n' +
        '需要先將圖片上傳到公開可訪問的 URL（如 Imgur、Cloudinary 等）。\n' +
        '建議改用 PicWish API，它支援直接上傳 base64 圖片。'
      );
    }

    throw error;
  }
};

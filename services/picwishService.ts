/**
 * PicWish Watermark Removal API Service
 * API Documentation: https://picwish.com/image-watermark-removal-api-doc
 */

export const removeWatermarkWithPicWish = async (
  base64Image: string,
  mimeType: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("PicWish API key is required. Get your free 50 credits at https://picwish.com/image-watermark-removal-api");
  }

  try {
    // Convert base64 to blob for file upload
    const base64Data = base64Image.includes('base64,')
      ? base64Image.split('base64,')[1]
      : base64Image;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Create form data
    const formData = new FormData();
    formData.append('image_file', blob, 'watermarked.png');

    // Submit task
    const response = await fetch('https://techhk.aoscdn.com/api/tasks/visual/external/watermark-remove', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`PicWish API Error: ${response.statusText}`);
      }
      throw new Error(`PicWish API Error: ${errorData.message || errorData.error || response.statusText}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.task_id) {
      throw new Error('Failed to create watermark removal task');
    }

    const taskId = data.data.task_id;

    // Poll for result (max 30 seconds, 1 second intervals)
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch(`https://techhk.aoscdn.com/api/tasks/visual/external/${taskId}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();

      if (statusData.data.state === 'success') {
        const resultUrl = statusData.data.result?.image_url;

        if (!resultUrl) {
          throw new Error('No result image URL in response');
        }

        // Download the result image and convert to base64
        const imageResponse = await fetch(resultUrl);
        const imageBlob = await imageResponse.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageBlob);
        });
      } else if (statusData.data.state === 'failed') {
        throw new Error('Watermark removal task failed');
      }

      // Continue polling if state is 'pending' or 'processing'
    }

    throw new Error('Task timeout: Processing took longer than 30 seconds');

  } catch (error: any) {
    console.error('PicWish API Error:', error);

    if (error.message?.includes('API key')) {
      throw new Error('Invalid PicWish API Key. 請在 https://picwish.com 註冊獲取免費 API Key');
    }

    throw error;
  }
};

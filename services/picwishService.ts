/**
 * PicWish Watermark Removal API Service
 * API Documentation: https://picwish.com/image-watermark-removal-api-doc
 *
 * Supported formats: JPG, PNG, BMP
 * Resolution: 20-10,000 pixels
 * File size: Up to 50MB
 * Result URL validity: 1 hour
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

    // Determine file extension from mimeType
    let fileName = 'image.png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      fileName = 'image.jpg';
    } else if (mimeType.includes('bmp')) {
      fileName = 'image.bmp';
    }

    const blob = new Blob([byteArray], { type: mimeType });

    // Create form data with correct field names
    const formData = new FormData();
    formData.append('file', blob, fileName);  // Changed from 'image_file' to 'file'
    formData.append('sync', '0');  // Asynchronous mode

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
      throw new Error(`PicWish API Error: ${errorData.message || errorData.msg || response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 200 || !data.data || !data.data.task_id) {
      throw new Error(`Failed to create task: ${data.message || data.msg || 'Unknown error'}`);
    }

    const taskId = data.data.task_id;

    // Poll for result (max 30 seconds, 1 second intervals)
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch(`https://techhk.aoscdn.com/api/tasks/visual/external/watermark-remove/${taskId}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();

      // State: 1 = success, 0 = processing, <0 = failed
      if (statusData.data.state === 1) {
        const resultUrl = statusData.data.file;

        if (!resultUrl) {
          throw new Error('No result image URL in response');
        }

        // Download the result image and convert to base64
        const imageResponse = await fetch(resultUrl);

        if (!imageResponse.ok) {
          throw new Error('Failed to download result image');
        }

        const imageBlob = await imageResponse.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageBlob);
        });
      } else if (statusData.data.state < 0) {
        throw new Error(`Watermark removal failed (state: ${statusData.data.state})`);
      }

      // Continue polling if state is 0 (processing)
    }

    throw new Error('Task timeout: Processing took longer than 30 seconds');

  } catch (error: any) {
    console.error('PicWish API Error:', error);

    if (error.message?.includes('API key') || error.message?.includes('Unauthorized')) {
      throw new Error('Invalid PicWish API Key. 請在 https://picwish.com/image-watermark-removal-api 註冊獲取免費 API Key（50 credits）');
    }

    if (error.message?.includes('input file does not exist')) {
      throw new Error('圖片上傳失敗。請確認圖片格式為 JPG、PNG 或 BMP，且檔案大小不超過 50MB。');
    }

    throw error;
  }
};

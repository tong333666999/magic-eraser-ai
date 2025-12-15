/**
 * Replicate API Service for image processing
 * Uses various models available on Replicate for watermark removal
 */

export const removeWatermarkWithReplicate = async (
  base64Image: string,
  mimeType: string,
  apiKey: string,
  model: string = 'tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c'
): Promise<string> => {
  try {
    // Convert base64 to data URI if needed
    const dataUri = base64Image.includes('data:')
      ? base64Image
      : `data:${mimeType};base64,${base64Image}`;

    // Step 1: Create a prediction
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model,
        input: {
          img: dataUri,
          // For GFPGAN model
          version: 'v1.4',
          scale: 2
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`Replicate API Error: ${createResponse.statusText}`);
      }
      throw new Error(`Replicate API Error: ${errorData.detail || errorData.error || createResponse.statusText}`);
    }

    const prediction = await createResponse.json();
    const predictionId = prediction.id;

    // Step 2: Poll for results
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${apiKey}`,
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check prediction status: ${statusResponse.statusText}`);
      }

      result = await statusResponse.json();
      attempts++;
    }

    if (result.status === 'failed') {
      throw new Error(`Replicate prediction failed: ${result.error || 'Unknown error'}`);
    }

    if (result.status !== 'succeeded') {
      throw new Error('Replicate prediction timed out');
    }

    // Step 3: Get the output image
    const output = result.output;

    if (!output) {
      throw new Error('No output from Replicate prediction');
    }

    // Output can be a URL or array of URLs
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      throw new Error('No image URL in Replicate output');
    }

    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch result image');
    }

    const imageBlob = await imageResponse.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

  } catch (error) {
    console.error('Replicate API Error:', error);
    throw error;
  }
};

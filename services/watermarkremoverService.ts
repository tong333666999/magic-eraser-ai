/**
 * WatermarkRemover.io (PixelBin) API Service
 *
 * Note: PixelBin requires a two-step process:
 * 1. Backend generates signed URL using @pixelbin/admin
 * 2. Frontend uploads and transforms using @pixelbin/core
 *
 * For pure frontend applications, this requires a backend proxy or cloud function.
 * Alternative: Use their direct transformation API with pre-uploaded images.
 *
 * Documentation: https://www.pixelbin.io/docs/api/upload-api/
 * Get API Key: https://pixelbin.io → Dashboard → Settings → Tokens → Create Token
 */

export const removeWatermarkWithPixelBin = async (
  base64Image: string,
  mimeType: string,
  apiKey: string,
  cloudName?: string,
  zone?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error(
      "PixelBin API key is required.\n\n" +
      "註冊獲取免費 API Key：\n" +
      "1. 訪問 https://pixelbin.io\n" +
      "2. Dashboard → Settings → Tokens → Create Token\n\n" +
      "免費方案包含 15 GB 儲存空間和 45 個月度 credits"
    );
  }

  if (!cloudName || !zone) {
    throw new Error(
      "PixelBin 需要 Cloud Name 和 Zone 配置。\n\n" +
      "請在 API 設置中填寫您的 Cloud Name 和 Zone。\n" +
      "可在 PixelBin Dashboard 中找到這些資訊。"
    );
  }

  throw new Error(
    "WatermarkRemover.io (PixelBin) 需要後端伺服器支援。\n\n" +
    "PixelBin 的上傳流程：\n" +
    "1. 後端使用 @pixelbin/admin 生成 signed URL\n" +
    "2. 前端使用 @pixelbin/core 上傳並轉換圖片\n\n" +
    "建議：\n" +
    "• 使用 PicWish API（純前端，50 個免費 credits）\n" +
    "• 使用 Segmind API（支援 CORS，純前端）\n\n" +
    "或者您可以建立後端服務來支援 PixelBin 整合。"
  );

  // Implementation would require:
  // 1. Backend endpoint to generate signed URLs
  // 2. Upload image to PixelBin storage
  // 3. Apply transformation: wm.remove()
  // 4. Return transformed image URL
  // 5. Download and convert to base64
};

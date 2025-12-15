export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ProcessedImage {
  original: string; // Base64 or URL
  processed: string; // Base64 or URL
}

export enum APIProvider {
  GEMINI = 'GEMINI',
  OPENROUTER = 'OPENROUTER',
  REPLICATE = 'REPLICATE'
}

export interface APIConfig {
  provider: APIProvider;
  apiKey: string;
  model?: string;
}
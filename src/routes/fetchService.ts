export const LASTFM_API_KEY = '29be9d230fbb544cb318c3f9f8fbdf7e';
export const LASTFM_SHARED_SECRET = 'fccb481f3520e0a7b4f1cd8002d89e8f';
export const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0';

class FetchService {
  private static instance: FetchService;

  private constructor() {}

  static getInstance(): FetchService {
    if (!FetchService.instance) {
      FetchService.instance = new FetchService();
    }
    return FetchService.instance;
  }

  async get(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${LASTFM_BASE_URL}${endpoint}`);
    params.api_key = LASTFM_API_KEY;
    params.format = 'json';
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key]),
    );

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }

  async post(endpoint: string, params: Record<string, string>) {
    try {
      const response = await fetch(`${LASTFM_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params).toString(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  }
}

export default FetchService.getInstance();

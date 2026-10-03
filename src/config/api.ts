const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://ieee-backend-7z25.onrender.com')
  .toString()
  .replace(/^["']|["']$/g, '')
  .trim();

export const API_BASE_URL = (
  rawBaseUrl.startsWith('http://') || rawBaseUrl.startsWith('https://')
    ? rawBaseUrl
    : `https://${rawBaseUrl}`
).replace(/\/+$/, '');

export const buildApiUrl = (endpoint: string) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${API_BASE_URL}${normalizedEndpoint}`;
};

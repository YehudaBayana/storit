// Client-side API URL: if NEXT_PUBLIC_API_URL is set and non-empty, use it.
// If unset or empty, use empty string so the browser calls same-origin /api/* (proxied by next.config.ts).
export const clientApiUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim();

// Server-side backend URL for SSR/Server Components/getSession:
// Directly calls the backend service.
export const serverApiUrl =
  (process.env.BACKEND_URL?.split('#')[0] || '').trim().replace(/\/+$/, '') ||
  'http://localhost:8080';

// Default export kept for backwards compatibility
export const apiUrl = clientApiUrl;

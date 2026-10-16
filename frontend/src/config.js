// API Configuration for BankSight
// When served by Express in production or proxied by Vite dev server, API_BASE is empty string (relative URL)
// If VITE_API_URL is set in environment, it uses that instead.
export const API_BASE = import.meta.env.VITE_API_URL || '';

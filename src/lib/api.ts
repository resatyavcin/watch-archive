const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export function apiUrl(path: string): string {
  return `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/** Fetches from the app's own API (Next.js routes) - always same-origin */
export async function fetchFromApp<T>(path: string): Promise<T> {
  const url = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

import type { NextApiRequest, NextApiResponse } from "next";

/** Backend API base URL (API_URL env) */
export function getApiBase(): string | null {
  return process.env.API_URL ?? null;
}

/** API base yoksa 500 döner, varsa base URL döner */
export function requireApiBase(res: NextApiResponse): string | null {
  const base = getApiBase();
  if (!base) {
    console.error("API_URL env is not set");
    res.status(500).json({ error: "API configuration missing" });
    return null;
  }
  return base;
}

/** Backend'e proxy isteği atar */
export async function proxyToBackend(
  base: string,
  path: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const url = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers } as HeadersInit,
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

/** HTTP method kontrolü, geçersizse 405 döner */
export function requireMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowed: ("GET" | "POST")[]
): boolean {
  if (!req.method || !allowed.includes(req.method as "GET" | "POST")) {
    res.setHeader("Allow", allowed);
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}

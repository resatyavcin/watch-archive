import type { NextApiRequest, NextApiResponse } from "next";
import {
  proxyToBackend,
  requireApiBase,
  requireMethod,
} from "@/lib/api-proxy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireMethod(req, res, ["GET"])) return;

  const q = req.query.q as string;
  const limit = req.query.limit as string;

  if (!q || typeof q !== "string" || !q.trim()) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const params = new URLSearchParams({ q: q.trim() });
  if (limit && /^\d+$/.test(limit)) {
    params.set("limit", limit);
  }

  const base = requireApiBase(res);
  if (!base) return;

  try {
    const { status, data } = await proxyToBackend(
      base,
      `/api/v0/search?${params.toString()}`
    );
    return res.status(status).json(data);
  } catch (error) {
    console.error("Search proxy error:", error);
    return res.status(500).json({ error: "Failed to fetch from API" });
  }
}

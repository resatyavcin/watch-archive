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

  const { tmdbId } = req.query;
  const type = req.query.type as string;

  if (typeof tmdbId !== "string" || !tmdbId) {
    return res.status(400).json({ error: "Invalid tmdbId" });
  }

  if (type !== "MOVIE" && type !== "SERIES") {
    return res
      .status(400)
      .json({ error: "Invalid type: use MOVIE or SERIES" });
  }

  const base = requireApiBase(res);
  if (!base) return;

  try {
    const { status, data } = await proxyToBackend(
      base,
      `/api/v0/titles/by-tmdb/${tmdbId}?type=${type}`
    );
    return res.status(status).json(data);
  } catch (error) {
    console.error("Title by-tmdb proxy error:", error);
    return res.status(500).json({ error: "Failed to fetch from API" });
  }
}

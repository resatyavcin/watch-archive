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

  const type = req.query.type as string;
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
      `/api/v0/browse/popular?type=${type}`
    );
    return res.status(status).json(data);
  } catch (error) {
    console.error("Browse popular proxy error:", error);
    return res.status(500).json({ error: "Failed to fetch from API" });
  }
}

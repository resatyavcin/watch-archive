import type { NextApiRequest, NextApiResponse } from "next";

const API_BASE = process.env.API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const type = req.query.type as string;
  if (type !== "MOVIE" && type !== "SERIES") {
    return res
      .status(400)
      .json({ error: "Invalid type: use MOVIE or SERIES" });
  }

  if (!API_BASE) {
    console.error("API_URL env is not set");
    return res.status(500).json({ error: "API configuration missing" });
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/v0/browse/popular?type=${type}`
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Browse popular proxy error:", error);
    return res.status(500).json({ error: "Failed to fetch from API" });
  }
}

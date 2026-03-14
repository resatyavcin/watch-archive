import type { NextApiRequest, NextApiResponse } from "next";

const API_BASE = process.env.API_URL;
const FALLBACK = {
  bannerIcon: "Crown",
  description: "Pro özelliklerine erken erişim ve özel rozet.",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (API_BASE) {
    try {
      const response = await fetch(`${API_BASE}/api/v0/support/pro-banner`);
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error("Pro-banner proxy error:", err);
    }
  }

  return res.status(200).json(FALLBACK);
}

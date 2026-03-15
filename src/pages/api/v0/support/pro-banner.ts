import type { NextApiRequest, NextApiResponse } from "next";
import { getApiBase, proxyToBackend, requireMethod } from "@/lib/api-proxy";

const FALLBACK = {
  bannerIcon: "Crown",
  description: "Pro özelliklerine erken erişim ve özel rozet.",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!requireMethod(req, res, ["GET"])) return;

  const base = getApiBase();
  if (base) {
    try {
      const { ok, data } = await proxyToBackend(base, "/api/v0/support/pro-banner");
      if (ok) return res.status(200).json(data);
    } catch (err) {
      console.error("Pro-banner proxy error:", err);
    }
  }

  return res.status(200).json(FALLBACK);
}

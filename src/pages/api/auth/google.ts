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
  if (!requireMethod(req, res, ["POST"])) return;

  const { idToken } = req.body as { idToken?: string };
  if (!idToken || typeof idToken !== "string") {
    return res.status(400).json({ error: "idToken is required" });
  }

  const base = requireApiBase(res);
  if (!base) return;

  try {
    const { ok, status, data } = await proxyToBackend(base, "/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
    return res.status(status).json(data);
  } catch (error) {
    console.error("Auth google proxy error:", error);
    return res.status(500).json({ error: "Failed to authenticate" });
  }
}

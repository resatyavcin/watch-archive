import type { NextApiRequest, NextApiResponse } from "next";

const API_BASE = process.env.API_URL;
const BUYMEACOFFEE_URL =
  process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL ||
  "https://buymeacoffee.com/resatyavcin";

const FALLBACK = {
  headerIcon: "Heart",
  listIcon: "Check",
  headerText: "Bana destek ol",
  description:
    "WatchArchive tamamen açık kaynak ve ücretsiz bir proje. Ancak film ve dizi verilerini sunmak için sunucu maliyetleri gerekiyor. API istekleri, veritabanı ve hosting giderleri projenin sürdürülebilirliği için kritik. Küçük bir destek bile bu açık kaynak projesinin ayakta kalmasına yardımcı olur. Destek olarak geliştirmeye katkıda bulunabilirsin 😊",
  buttonText: "Buy Me A Coffee'ye git",
  link: BUYMEACOFFEE_URL,
  features: [
    { icon: "Check", label: "İkon özelleştirmeleri" },
    { icon: "Check", label: "Özel tema seçenekleri" },
    { icon: "Check", label: "Pro rozet ve erken erişim" },
  ],
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
      const response = await fetch(`${API_BASE}/api/v0/support/pro-modal`);
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error("Pro-modal proxy error:", err);
    }
  }

  return res.status(200).json(FALLBACK);
}

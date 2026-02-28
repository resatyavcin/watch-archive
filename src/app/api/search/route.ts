import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export async function GET(request: NextRequest) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "TMDB_API_KEY is not defined. Add it to .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "movie";

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const endpoint =
      type === "tv"
        ? `${TMDB_BASE}/search/tv?api_key=${apiKey}&language=tr-TR&include_adult=true&query=${encodeURIComponent(q)}`
        : `${TMDB_BASE}/search/movie?api_key=${apiKey}&language=tr-TR&include_adult=true&query=${encodeURIComponent(q)}`;

    const res = await fetch(endpoint, {
      next: { revalidate: 600 },
    });
    const data = await res.json();

    const rawResults = (data.results || []).slice(0, 12);
    const creditsEndpoint = type === "tv" ? "tv" : "movie";

    const results = await Promise.all(
      rawResults.map(
        async (item: { id: number; title?: string; name?: string; poster_path: string | null; release_date?: string; first_air_date?: string }) => {
          let director: string | null = null;
          try {
            const credRes = await fetch(
              `${TMDB_BASE}/${creditsEndpoint}/${item.id}/credits?api_key=${apiKey}`,
              { next: { revalidate: 600 } }
            );
            const credData = await credRes.json();
            const crew = credData.crew || [];
            const directors = crew.filter((c: { job: string }) => c.job === "Director");
            director = directors.length > 0 ? directors[0].name : null;
          } catch {
            // director yoksa boş bırak
          }
          return {
            id: item.id,
            title: item.title || item.name || "",
            posterPath: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null,
            releaseYear: (item.release_date || item.first_air_date || "").slice(0, 4),
            director,
            type,
          };
        }
      )
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json(
      { error: "Arama sırasında hata oluştu." },
      { status: 500 }
    );
  }
}

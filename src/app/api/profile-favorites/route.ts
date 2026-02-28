import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export type ProfileFavoriteItem = {
  type: "movie" | "tv";
  position: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseYear: string | null;
};

function rowToItem(r: {
  type: string;
  position: number;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  release_year: string | null;
}): ProfileFavoriteItem {
  return {
    type: r.type as "movie" | "tv",
    position: r.position,
    tmdbId: r.tmdb_id,
    title: r.title,
    posterPath: r.poster_path,
    releaseYear: r.release_year ?? null,
  };
}

/** GET: 4 film + 4 dizi slot (boş slot yok, sadece dolu olanlar veya position ile sıralı) */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profile_favorites")
    .select("type, position, tmdb_id, title, poster_path, release_year")
    .eq("user_id", session.user.email)
    .order("type")
    .order("position");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const movies: (ProfileFavoriteItem | null)[] = [null, null, null, null];
  const tv: (ProfileFavoriteItem | null)[] = [null, null, null, null];
  for (const r of data ?? []) {
    const item = rowToItem(r as Parameters<typeof rowToItem>[0]);
    const arr = item.type === "movie" ? movies : tv;
    if (item.position >= 1 && item.position <= 4) {
      arr[item.position - 1] = item;
    }
  }
  return NextResponse.json({ movies, tv });
}

/** POST: Bir slotu ayarla. Body: { type, position, tmdbId, title, posterPath?, releaseYear? } */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { type, position, tmdbId, title, posterPath, releaseYear } = body;
  if (!type || !position || position < 1 || position > 4 || !tmdbId || !title) {
    return NextResponse.json(
      { error: "type, position (1-4), tmdbId, title gerekli" },
      { status: 400 }
    );
  }
  if (type !== "movie" && type !== "tv") {
    return NextResponse.json({ error: "type movie veya tv olmalı" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("profile_favorites").upsert(
    {
      user_id: session.user.email,
      type,
      position: Number(position),
      tmdb_id: Number(tmdbId),
      title: String(title),
      poster_path: posterPath ?? null,
      release_year: releaseYear ?? null,
    },
    { onConflict: "user_id,type,position" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** DELETE: Bir slotu temizle. Query: type, position */
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const position = searchParams.get("position");
  if (!type || !position) {
    return NextResponse.json(
      { error: "type ve position query gerekli" },
      { status: 400 }
    );
  }
  const pos = Number(position);
  if (pos < 1 || pos > 4) {
    return NextResponse.json({ error: "position 1-4 arası olmalı" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("profile_favorites")
    .delete()
    .eq("user_id", session.user.email)
    .eq("type", type)
    .eq("position", pos);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

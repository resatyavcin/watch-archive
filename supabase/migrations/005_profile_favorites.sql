-- Beni ben yapan: 4 film + 4 dizi (izleme listesindeki favoriden bağımsız)
create table if not exists profile_favorites (
  user_id text not null,
  type text not null check (type in ('movie', 'tv')),
  position integer not null check (position >= 1 and position <= 4),
  tmdb_id integer not null,
  title text not null,
  poster_path text,
  release_year text,
  created_at timestamptz default now(),
  primary key (user_id, type, position)
);

create index idx_profile_favorites_user on profile_favorites(user_id);

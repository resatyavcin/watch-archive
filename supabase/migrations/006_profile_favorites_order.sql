-- Sıra bilgisinin (position) güncellenmesi ve okuma performansı için:
-- 1) updated_at kolonu ve trigger
-- 2) Sıralı okuma için index (PK zaten var; position ile sıra garanti)

-- updated_at: satır güncellendiğinde (sıra değişince) otomatik güncellenir
alter table profile_favorites
  add column if not exists updated_at timestamptz default now();

-- Mevcut satırlar için updated_at = created_at
update profile_favorites
set updated_at = created_at
where updated_at is null;

-- Trigger: INSERT/UPDATE'te updated_at = now()
create or replace function profile_favorites_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profile_favorites_updated_at on profile_favorites;
create trigger profile_favorites_updated_at
  before insert or update on profile_favorites
  for each row
  execute function profile_favorites_set_updated_at();

comment on column profile_favorites.position is 'Görüntüleme sırası: 1-4 (1 = ilk slot)';

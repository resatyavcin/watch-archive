-- Remove watched_episodes column from watched_items
alter table watched_items drop column if exists watched_episodes;

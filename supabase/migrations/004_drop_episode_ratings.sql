-- Remove episode_ratings column from watched_items
alter table watched_items drop column if exists episode_ratings;

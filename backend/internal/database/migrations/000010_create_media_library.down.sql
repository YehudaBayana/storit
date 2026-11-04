DROP INDEX IF EXISTS idx_video_trashed;
DROP INDEX IF EXISTS idx_video_folder;
ALTER TABLE video DROP COLUMN IF EXISTS trashed_at;
ALTER TABLE video DROP COLUMN IF EXISTS item_type;
ALTER TABLE video DROP COLUMN IF EXISTS folder_id;

DROP INDEX IF EXISTS idx_folders_trashed;
DROP INDEX IF EXISTS idx_folders_owner_parent;
DROP TABLE IF EXISTS folders;

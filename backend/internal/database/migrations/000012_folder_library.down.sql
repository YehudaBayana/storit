-- @@ALLOW_REPLACE backend/internal/database/migrations/000012_folder_library.down.sql
DROP INDEX IF EXISTS idx_video_deleted_batch;
DROP INDEX IF EXISTS idx_video_folder_id;
ALTER TABLE video DROP COLUMN IF EXISTS version;
ALTER TABLE video DROP COLUMN IF EXISTS original_folder_id;
ALTER TABLE video DROP COLUMN IF EXISTS deleted_batch_id;
ALTER TABLE video DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE video DROP COLUMN IF EXISTS folder_id;

DROP INDEX IF EXISTS idx_folders_deleted_batch;
DROP INDEX IF EXISTS idx_folders_user_parent;
DROP INDEX IF EXISTS idx_folders_user_root;
DROP INDEX IF EXISTS idx_folders_user_parent_name_active;
DROP TABLE IF EXISTS folders;

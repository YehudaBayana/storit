-- 1. Add the column back (it will be empty for existing rows)
ALTER TABLE video ADD COLUMN recorded_at date;

-- 2. Drop the new index we created in the Up migration
DROP INDEX IF EXISTS idx_video_owner_created_at;

-- 3. Recreate the original index exactly as you had it before
CREATE INDEX IF NOT EXISTS idx_video_owner_recorded_at
    ON video (owner_id, recorded_at DESC, created_at DESC);
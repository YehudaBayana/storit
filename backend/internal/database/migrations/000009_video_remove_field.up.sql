-- 1. Drop the old index that relies on 'recorded_at'
DROP INDEX IF EXISTS idx_video_owner_recorded_at;

-- 2. Remove the column from the table
ALTER TABLE video DROP COLUMN recorded_at;

-- 3. Create a new index to keep video lookups fast, now just using 'created_at'
CREATE INDEX IF NOT EXISTS idx_video_owner_created_at
    ON video (owner_id, created_at DESC);
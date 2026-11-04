-- Migration to enhance folders and trash according to specs
ALTER TABLE folders ADD COLUMN IF NOT EXISTS name_normalized VARCHAR(255);
ALTER TABLE folders ADD COLUMN IF NOT EXISTS is_root BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE folders ADD COLUMN IF NOT EXISTS depth INT NOT NULL DEFAULT 0;
ALTER TABLE folders ADD COLUMN IF NOT EXISTS deleted_batch_id UUID;
ALTER TABLE folders ADD COLUMN IF NOT EXISTS original_parent_id UUID;
ALTER TABLE folders ADD COLUMN IF NOT EXISTS original_name VARCHAR(255);

-- Update normalized names for existing folders
UPDATE folders SET name_normalized = LOWER(TRIM(name)) WHERE name_normalized IS NULL;

-- Unique partial index for non-deleted folders under the same parent
CREATE UNIQUE INDEX IF NOT EXISTS idx_folders_unique_name ON folders (owner_id, parent_id, name_normalized) WHERE trashed_at IS NULL AND parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_folders_owner_parent_trashed ON folders (owner_id, parent_id, trashed_at);
CREATE INDEX IF NOT EXISTS idx_folders_trashed_updated ON folders (owner_id, trashed_at, updated_at);
CREATE INDEX IF NOT EXISTS idx_folders_deleted_batch ON folders (deleted_batch_id);

-- Enhance video table for media trash / folders
ALTER TABLE video ADD COLUMN IF NOT EXISTS deleted_batch_id UUID;
ALTER TABLE video ADD COLUMN IF NOT EXISTS original_folder_id UUID;
ALTER TABLE video ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_video_deleted_batch ON video (deleted_batch_id);

-- Trash batch table
CREATE TABLE IF NOT EXISTS trash_batches (
    id UUID PRIMARY KEY,
    owner_id UUID NOT NULL,
    root_item_type VARCHAR(32) NOT NULL,
    root_item_id UUID NOT NULL,
    original_parent_id UUID,
    original_path_snapshot TEXT,
    item_count INT NOT NULL DEFAULT 1,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    purge_after TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_trash_batches_owner ON trash_batches (owner_id, status);

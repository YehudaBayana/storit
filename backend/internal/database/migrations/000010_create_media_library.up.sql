CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY,
    owner_id UUID NOT NULL,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    trashed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_folders_owner_parent ON folders(owner_id, parent_id);
CREATE INDEX idx_folders_trashed ON folders(owner_id, trashed_at);

ALTER TABLE video ADD COLUMN folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;
ALTER TABLE video ADD COLUMN item_type VARCHAR(32) NOT NULL DEFAULT 'video';
ALTER TABLE video ADD COLUMN trashed_at TIMESTAMPTZ;

CREATE INDEX idx_video_folder ON video(owner_id, folder_id);
CREATE INDEX idx_video_trashed ON video(owner_id, trashed_at);

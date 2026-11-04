-- Migration 12: Folder-Based Media Library & Trash System
-- Ensure folders table exists properly
CREATE TABLE IF NOT EXISTS folders_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    parent_id UUID REFERENCES folders_v2(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_normalized TEXT NOT NULL,
    is_root BOOLEAN NOT NULL DEFAULT FALSE,
    depth INT NOT NULL DEFAULT 0,
    version INT NOT NULL DEFAULT 1,
    deleted_at TIMESTAMPTZ,
    deleted_batch_id UUID,
    original_parent_id UUID,
    original_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

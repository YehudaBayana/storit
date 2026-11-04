package folders

import (
	"time"

	"github.com/google/uuid"
)

type Folder struct {
	ID              uuid.UUID  `json:"id"`
	OwnerID         uuid.UUID  `json:"owner_id"`
	ParentID        *uuid.UUID `json:"parent_id"`
	Name            string     `json:"name"`
	NameNormalized  string     `json:"name_normalized"`
	IsRoot          bool       `json:"is_root"`
	Depth           int        `json:"depth"`
	Version         int        `json:"version"`
	TrashedAt       *time.Time `json:"trashed_at,omitempty"`
	DeletedBatchID  *uuid.UUID `json:"deleted_batch_id,omitempty"`
	OriginalParentID *uuid.UUID `json:"original_parent_id,omitempty"`
	OriginalName    *string    `json:"original_name,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type LibraryItem struct {
	ID        uuid.UUID  `json:"id"`
	ItemType  string     `json:"item_type"` // "folder" or "media"
	MediaType string     `json:"media_type,omitempty"` // "video", etc.
	Name      string     `json:"name"`
	FolderID  *uuid.UUID `json:"folder_id,omitempty"`
	Version   int        `json:"version,omitempty"`
	Status    string     `json:"status,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

type TrashBatch struct {
	ID                 uuid.UUID  `json:"id"`
	OwnerID            uuid.UUID  `json:"owner_id"`
	RootItemType       string     `json:"root_item_type"`
	RootItemID         uuid.UUID  `json:"root_item_id"`
	OriginalParentID   *uuid.UUID `json:"original_parent_id,omitempty"`
	OriginalPathSnapshot string   `json:"original_path_snapshot,omitempty"`
	ItemCount          int        `json:"item_count"`
	DeletedAt          time.Time  `json:"deleted_at"`
	PurgeAfter         time.Time  `json:"purge_after"`
	Status             string     `json:"status"`
}

type CreateFolderRequest struct {
	ParentID *uuid.UUID `json:"parent_id"`
	Name     string     `json:"name"`
}

type UpdateFolderRequest struct {
	Name    *string `json:"name"`
	Version int     `json:"version"`
}

type MoveItemRequest struct {
	ItemID         uuid.UUID  `json:"item_id"`
	ItemType       string     `json:"item_type"` // "folder" or "media"
	TargetFolderID *uuid.UUID `json:"target_folder_id"`
	Version        int        `json:"version"`
}

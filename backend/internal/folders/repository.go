package folders

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNotFound = errors.New("not found")
var ErrConflict = errors.New("conflict")
var ErrInvalidInput = errors.New("invalid input")

const folderColumns = `id, owner_id, parent_id, name, name_normalized, is_root, depth, version, trashed_at, deleted_batch_id, original_parent_id, original_name, created_at, updated_at`

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func NormalizeName(name string) string {
	trimmed := strings.TrimSpace(name)
	// NFKC + casefold (golang strings.ToLower handles casefold for standard unicode well, or we can use strings.ToLower)
	return strings.ToLower(trimmed)
}

func ValidateFolderName(name string) error {
	trimmed := strings.TrimSpace(name)
	if trimmed == "" || trimmed == "." || trimmed == ".." {
		return ErrInvalidInput
	}
	if strings.Contains(trimmed, "/") || strings.Contains(trimmed, "\\") {
		return ErrInvalidInput
	}
	// Check rune length max 255
	if len([]rune(trimmed)) > 255 {
		return ErrInvalidInput
	}
	// Check control characters and bidi override
	for _, r := range trimmed {
		if (r >= 0x0000 && r <= 0x001F) || r == 0x007F {
			return ErrInvalidInput
		}
		if (r >= 0x202A && r <= 0x202E) || (r >= 0x2066 && r <= 0x2069) {
			return ErrInvalidInput
		}
	}
	return nil
}

func (r *Repository) GetOrCreateRoot(ctx context.Context, ownerID uuid.UUID) (Folder, error) {
	var f Folder
	err := r.db.QueryRow(ctx, `
		SELECT `+folderColumns+`
		FROM folders
		WHERE owner_id = $1 AND is_root = true AND trashed_at IS NULL
		LIMIT 1`, ownerID).Scan(
		&f.ID, &f.OwnerID, &f.ParentID, &f.Name, &f.NameNormalized, &f.IsRoot, &f.Depth, &f.Version, &f.TrashedAt, &f.DeletedBatchID, &f.OriginalParentID, &f.OriginalName, &f.CreatedAt, &f.UpdatedAt,
	)

	if err == nil {
		return f, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return Folder{}, fmt.Errorf("get root folder: %w", err)
	}

	rootID := uuid.New()
	err = r.db.QueryRow(ctx, `
		INSERT INTO folders (id, owner_id, parent_id, name, name_normalized, is_root, depth, version)
		VALUES ($1, $2, NULL, 'My Library', 'my library', true, 0, 1)
		RETURNING `+folderColumns, rootID, ownerID).Scan(
		&f.ID, &f.OwnerID, &f.ParentID, &f.Name, &f.NameNormalized, &f.IsRoot, &f.Depth, &f.Version, &f.TrashedAt, &f.DeletedBatchID, &f.OriginalParentID, &f.OriginalName, &f.CreatedAt, &f.UpdatedAt,
	)
	if err != nil {
		return Folder{}, fmt.Errorf("create root folder: %w", err)
	}
	return f, nil
}

func (r *Repository) Create(ctx context.Context, ownerID uuid.UUID, parentID *uuid.UUID, name string) (Folder, error) {
	if err := ValidateFolderName(name); err != nil {
		return Folder{}, err
	}
	nameNormalized := NormalizeName(name)

	// Verify parent folder exists and is owned by same user and depth <= 19
	var parentDepth int
	err := r.db.QueryRow(ctx, `
		SELECT depth FROM folders WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, parentID, ownerID).Scan(&parentDepth)
	if errors.Is(err, pgx.ErrNoRows) {
		return Folder{}, ErrNotFound
	}
	if err != nil {
		return Folder{}, fmt.Errorf("verify parent folder: %w", err)
	}

	if parentDepth >= 20 {
		return Folder{}, ErrInvalidInput
	}

	id := uuid.New()
	var f Folder
	err = r.db.QueryRow(ctx, `
		INSERT INTO folders (id, owner_id, parent_id, name, name_normalized, is_root, depth, version)
		VALUES ($1, $2, $3, $4, $5, false, $6, 1)
		RETURNING `+folderColumns, id, ownerID, parentID, name, nameNormalized, parentDepth+1).Scan(
		&f.ID, &f.OwnerID, &f.ParentID, &f.Name, &f.NameNormalized, &f.IsRoot, &f.Depth, &f.Version, &f.TrashedAt, &f.DeletedBatchID, &f.OriginalParentID, &f.OriginalName, &f.CreatedAt, &f.UpdatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "violates unique constraint") {
			return Folder{}, ErrConflict
		}
		return Folder{}, fmt.Errorf("insert folder: %w", err)
	}
	return f, nil
}

func (r *Repository) GetByID(ctx context.Context, ownerID, folderID uuid.UUID) (Folder, error) {
	var f Folder
	err := r.db.QueryRow(ctx, `
		SELECT `+folderColumns+`
		FROM folders
		WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, folderID, ownerID).Scan(
		&f.ID, &f.OwnerID, &f.ParentID, &f.Name, &f.NameNormalized, &f.IsRoot, &f.Depth, &f.Version, &f.TrashedAt, &f.DeletedBatchID, &f.OriginalParentID, &f.OriginalName, &f.CreatedAt, &f.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return Folder{}, ErrNotFound
	}
	if err != nil {
		return Folder{}, fmt.Errorf("get folder by id: %w", err)
	}
	return f, nil
}

func (r *Repository) ListContents(ctx context.Context, ownerID uuid.UUID, folderID uuid.UUID) ([]LibraryItem, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, 'folder' AS item_type, '' AS media_type, name, parent_id AS folder_id, version, 'ready' AS status, created_at, updated_at
		FROM folders
		WHERE owner_id = $1 AND parent_id = $2 AND trashed_at IS NULL
		UNION ALL
		SELECT id, 'media' AS item_type, item_type AS media_type, title AS name, folder_id, version, status, created_at, updated_at
		FROM video
		WHERE owner_id = $1 AND folder_id = $2 AND trashed_at IS NULL
		ORDER BY item_type DESC, name ASC`, ownerID, folderID)
	if err != nil {
		return nil, fmt.Errorf("list folder contents: %w", err)
	}
	defer rows.Close()

	var items []LibraryItem
	for rows.Next() {
		var item LibraryItem
		var parentFolderID *uuid.UUID
		err := rows.Scan(&item.ID, &item.ItemType, &item.MediaType, &item.Name, &parentFolderID, &item.Version, &item.Status, &item.CreatedAt, &item.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan library item: %w", err)
		}
		item.FolderID = parentFolderID
		items = append(items, item)
	}
	return items, nil
}

func (r *Repository) UpdateFolder(ctx context.Context, ownerID, folderID uuid.UUID, name string, version int) (Folder, error) {
	if err := ValidateFolderName(name); err != nil {
		return Folder{}, err
	}
	nameNormalized := NormalizeName(name)

	var f Folder
	err := r.db.QueryRow(ctx, `
		UPDATE folders
		SET name = $3, name_normalized = $4, version = version + 1, updated_at = now()
		WHERE id = $1 AND owner_id = $2 AND version = $5 AND trashed_at IS NULL AND is_root = false
		RETURNING `+folderColumns, folderID, ownerID, name, nameNormalized, version).Scan(
		&f.ID, &f.OwnerID, &f.ParentID, &f.Name, &f.NameNormalized, &f.IsRoot, &f.Depth, &f.Version, &f.TrashedAt, &f.DeletedBatchID, &f.OriginalParentID, &f.OriginalName, &f.CreatedAt, &f.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return Folder{}, ErrConflict
	}
	if err != nil {
		if strings.Contains(err.Error(), "violates unique constraint") {
			return Folder{}, ErrConflict
		}
		return Folder{}, fmt.Errorf("update folder: %w", err)
	}
	return f, nil
}

func (r *Repository) MoveItem(ctx context.Context, ownerID uuid.UUID, itemID uuid.UUID, itemType string, targetFolderID *uuid.UUID, version int) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Verify target folder exists and is owned by same user
	var targetDepth int
	err = tx.QueryRow(ctx, `
		SELECT depth FROM folders WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, targetFolderID, ownerID).Scan(&targetDepth)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}

	if itemType == "folder" {
		// Prevent moving folder into itself or its descendant
		if itemID == *targetFolderID {
			return ErrInvalidInput
		}
		// Check ancestry loop
		current := targetFolderID
		for current != nil {
			var parent *uuid.UUID
			err := tx.QueryRow(ctx, `SELECT parent_id FROM folders WHERE id = $1 AND owner_id = $2`, current, ownerID).Scan(&parent)
			if err != nil {
				break
			}
			if parent != nil && *parent == itemID {
				return ErrInvalidInput
			}
			current = parent
		}

		var currentVersion int
		err = tx.QueryRow(ctx, `SELECT version FROM folders WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, itemID, ownerID).Scan(&currentVersion)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		if version != 0 && currentVersion != version {
			return ErrConflict
		}

		_, err = tx.Exec(ctx, `
			UPDATE folders
			SET parent_id = $3, depth = $4, version = version + 1, updated_at = now()
			WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, itemID, ownerID, targetFolderID, targetDepth+1)
		if err != nil {
			if strings.Contains(err.Error(), "violates unique constraint") {
				return ErrConflict
			}
			return err
		}
	} else {
		var currentVersion int
		err = tx.QueryRow(ctx, `SELECT version FROM video WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, itemID, ownerID).Scan(&currentVersion)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		if version != 0 && currentVersion != version {
			return ErrConflict
		}

		_, err = tx.Exec(ctx, `
			UPDATE video
			SET folder_id = $3, version = version + 1, updated_at = now()
			WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, itemID, ownerID, targetFolderID)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func (r *Repository) TrashItem(ctx context.Context, ownerID uuid.UUID, itemID uuid.UUID, itemType string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	now := time.Now()
	batchID := uuid.New()

	var originalParent *uuid.UUID
	var rootName string

	if itemType == "folder" {
		var isRoot bool
		err = tx.QueryRow(ctx, `SELECT parent_id, is_root, name FROM folders WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, itemID, ownerID).Scan(&originalParent, &isRoot, &rootName)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		if err != nil {
			return err
		}
		if isRoot {
			return ErrInvalidInput // Cannot trash root folder
		}

		// Mark folder and descendants as trashed with batch ID
		_, err = tx.Exec(ctx, `
			UPDATE folders
			SET trashed_at = $3, deleted_batch_id = $4, original_parent_id = parent_id, original_name = name, updated_at = now()
			WHERE (id = $1 OR parent_id = $1) AND owner_id = $2`, itemID, ownerID, now, batchID)
		if err != nil {
			return err
		}
	} else {
		err = tx.QueryRow(ctx, `SELECT folder_id, title FROM video WHERE id = $1 AND owner_id = $2 AND trashed_at IS NULL`, itemID, ownerID).Scan(&originalParent, &rootName)
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		if err != nil {
			return err
		}

		_, err = tx.Exec(ctx, `
			UPDATE video
			SET trashed_at = $3, deleted_batch_id = $4, original_folder_id = folder_id, updated_at = now()
			WHERE id = $1 AND owner_id = $2`, itemID, ownerID, now, batchID)
		if err != nil {
			return err
		}
	}

	// Create trash batch record
	_, err = tx.Exec(ctx, `
		INSERT INTO trash_batches (id, owner_id, root_item_type, root_item_id, original_parent_id, original_path_snapshot, item_count, deleted_at, purge_after, status)
		VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8, 'active')`,
		batchID, ownerID, itemType, itemID, originalParent, rootName, now, now.Add(30*24*time.Hour),
	)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r *Repository) ListTrash(ctx context.Context, ownerID uuid.UUID) ([]LibraryItem, error) {
	rows, err := r.db.Query(ctx, `
		SELECT tb.root_item_id AS id, tb.root_item_type AS item_type, '' AS media_type, tb.original_path_snapshot AS name, tb.original_parent_id AS folder_id, 1 AS version, tb.status, tb.deleted_at AS created_at, tb.deleted_at AS updated_at
		FROM trash_batches tb
		WHERE tb.owner_id = $1 AND tb.status = 'active'
		ORDER BY tb.deleted_at DESC`, ownerID)
	if err != nil {
		return nil, fmt.Errorf("list trash batches: %w", err)
	}
	defer rows.Close()

	var items []LibraryItem
	for rows.Next() {
		var item LibraryItem
		var parentFolderID *uuid.UUID
		err := rows.Scan(&item.ID, &item.ItemType, &item.MediaType, &item.Name, &parentFolderID, &item.Version, &item.Status, &item.CreatedAt, &item.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan trash item: %w", err)
		}
		item.FolderID = parentFolderID
		items = append(items, item)
	}
	return items, nil
}

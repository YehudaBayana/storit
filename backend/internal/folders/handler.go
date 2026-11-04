package folders

import (
	"encoding/json"
	"errors"
	"net/http"

	"backend/internal/auth"
	"backend/internal/httputil"

	"github.com/google/uuid"
)

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) HandleRoot(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	root, err := h.repo.GetOrCreateRoot(r.Context(), userID)
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to get root folder")
		return
	}

	httputil.WriteJSON(w, http.StatusOK, root)
}

func (h *Handler) HandleList(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	root, err := h.repo.GetOrCreateRoot(r.Context(), userID)
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to get root folder")
		return
	}

	items, err := h.repo.ListContents(r.Context(), userID, root.ID)
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to list folders")
		return
	}

	// Filter out only folders or return folders as requested
	var folders []Folder
	for _, item := range items {
		if item.ItemType == "folder" {
			folders = append(folders, Folder{
				ID:        item.ID,
				OwnerID:   userID,
				ParentID:  item.FolderID,
				Name:      item.Name,
				Version:   item.Version,
				CreatedAt: item.CreatedAt,
				UpdatedAt: item.UpdatedAt,
			})
		}
	}
	if folders == nil {
		folders = []Folder{}
	}

	httputil.WriteJSON(w, http.StatusOK, folders)
}

func (h *Handler) HandleCreate(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	var req CreateFolderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_request", "invalid request body")
		return
	}

	parentID := req.ParentID
	if parentID == nil {
		root, err := h.repo.GetOrCreateRoot(r.Context(), userID)
		if err != nil {
			httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to get root folder")
			return
		}
		parentID = &root.ID
	}

	folder, err := h.repo.Create(r.Context(), userID, parentID, req.Name)
	if errors.Is(err, ErrInvalidInput) {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_name", "invalid folder name or input")
		return
	}
	if errors.Is(err, ErrConflict) {
		httputil.WriteError(w, http.StatusConflict, "conflict", "folder with this name already exists")
		return
	}
	if errors.Is(err, ErrNotFound) {
		httputil.WriteError(w, http.StatusNotFound, "not_found", "parent folder not found")
		return
	}
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to create folder")
		return
	}

	httputil.WriteJSON(w, http.StatusCreated, folder)
}

func (h *Handler) HandleContents(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	folderIDStr := r.PathValue("id")
	var folderID uuid.UUID
	if folderIDStr == "" || folderIDStr == "root" {
		root, err := h.repo.GetOrCreateRoot(r.Context(), userID)
		if err != nil {
			httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to get root folder")
			return
		}
		folderID = root.ID
	} else {
		parsed, err := uuid.Parse(folderIDStr)
		if err != nil {
			httputil.WriteError(w, http.StatusBadRequest, "invalid_id", "invalid folder id")
			return
		}
		folderID = parsed
	}

	items, err := h.repo.ListContents(r.Context(), userID, folderID)
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to list folder contents")
		return
	}

	httputil.WriteJSON(w, http.StatusOK, items)
}

func (h *Handler) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	folderIDStr := r.PathValue("id")
	folderID, err := uuid.Parse(folderIDStr)
	if err != nil {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_id", "invalid folder id")
		return
	}

	var req UpdateFolderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_request", "invalid request body")
		return
	}

	if req.Name == nil {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_name", "folder name is required")
		return
	}

	folder, err := h.repo.UpdateFolder(r.Context(), userID, folderID, *req.Name, req.Version)
	if errors.Is(err, ErrInvalidInput) {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_name", "invalid folder name")
		return
	}
	if errors.Is(err, ErrConflict) {
		httputil.WriteError(w, http.StatusConflict, "version_conflict", "version conflict or duplicate name")
		return
	}
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to update folder")
		return
	}

	httputil.WriteJSON(w, http.StatusOK, folder)
}

func (h *Handler) HandleMove(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	var req MoveItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_request", "invalid request body")
		return
	}

	err := h.repo.MoveItem(r.Context(), userID, req.ItemID, req.ItemType, req.TargetFolderID, req.Version)
	if errors.Is(err, ErrNotFound) {
		httputil.WriteError(w, http.StatusNotFound, "not_found", "item or target folder not found")
		return
	}
	if errors.Is(err, ErrConflict) {
		httputil.WriteError(w, http.StatusConflict, "version_conflict", "version conflict")
		return
	}
	if errors.Is(err, ErrInvalidInput) {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_move", "invalid move operation")
		return
	}
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to move item")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) HandleTrash(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	itemIDStr := r.PathValue("id")
	itemID, err := uuid.Parse(itemIDStr)
	if err != nil {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_id", "invalid item id")
		return
	}

	itemType := r.URL.Query().Get("type")
	if itemType == "" {
		itemType = "media"
	}

	err = h.repo.TrashItem(r.Context(), userID, itemID, itemType)
	if errors.Is(err, ErrNotFound) {
		httputil.WriteError(w, http.StatusNotFound, "not_found", "item not found")
		return
	}
	if errors.Is(err, ErrInvalidInput) {
		httputil.WriteError(w, http.StatusBadRequest, "invalid_trash", "cannot trash root folder")
		return
	}
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to trash item")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) HandleListTrash(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFrom(r.Context())
	if !ok {
		httputil.WriteError(w, http.StatusUnauthorized, "unauthenticated", "authentication required")
		return
	}

	items, err := h.repo.ListTrash(r.Context(), userID)
	if err != nil {
		httputil.WriteError(w, http.StatusInternalServerError, "internal_error", "failed to list trash")
		return
	}

	httputil.WriteJSON(w, http.StatusOK, items)
}

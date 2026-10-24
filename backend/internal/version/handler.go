package version

import (
	"net/http"

	"backend/internal/httputil"
)

// Handler handles version requests.
type Handler struct {
	version Version
}

// NewHandler creates a new version Handler.
func NewHandler(commitHash, commitDate string) *Handler {
	return &Handler{
		version: Version{
			CommitHash: commitHash,
			CommitDate: commitDate,
		},
	}
}

// Handle handles GET /api/version and GET /version.
func (handler *Handler) Handle(responseWriter http.ResponseWriter, request *http.Request) {
	httputil.WriteJSON(responseWriter, http.StatusOK, handler.version)
}

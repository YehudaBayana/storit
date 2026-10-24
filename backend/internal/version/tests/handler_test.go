package version_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/version"
)

func TestHandleReturnsCommitVersion(t *testing.T) {
	handler := version.NewHandler("abc1234", "2026-10-24 19:00:00 +0000")
	response := httptest.NewRecorder()
	handler.Handle(response, httptest.NewRequest(http.MethodGet, "/api/version", nil))

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}
	if got := response.Header().Get("Content-Type"); got != "application/json; charset=utf-8" {
		t.Errorf("Content-Type = %q, want application/json; charset=utf-8", got)
	}

	var payload version.Version
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if payload.CommitHash != "abc1234" {
		t.Errorf("CommitHash = %q, want abc1234", payload.CommitHash)
	}
	if payload.CommitDate != "2026-10-24 19:00:00 +0000" {
		t.Errorf("CommitDate = %q, want 2026-10-24 19:00:00 +0000", payload.CommitDate)
	}
}

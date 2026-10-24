package config_test

import (
	"testing"
	"time"

	"backend/internal/config"
)

func TestLoadUsesDatabaseURLWhenConfigured(t *testing.T) {
	t.Setenv("DB_URL", "postgres://configured")
	t.Setenv("PORT", "8080")
	t.Setenv("DB_HOST", "ignored-host")
	t.Setenv("DB_PORT", "5433")
	t.Setenv("DB_USER", "ignored-user")
	t.Setenv("DB_PASSWORD", "ignored-password")
	t.Setenv("DB_NAME", "ignored-database")

	got := config.Load()
	if got.DatabaseURL != "postgres://configured" {
		t.Errorf("DatabaseURL = %q, want configured DB_URL", got.DatabaseURL)
	}
	if got.Port != "8080" {
		t.Errorf("Port = %q, want %q", got.Port, "8080")
	}
}

func TestLoadBuildsDatabaseURLFromParts(t *testing.T) {
	t.Setenv("DB_URL", "")
	t.Setenv("DATABASE_URL", "")
	t.Setenv("PORT", "8080")
	t.Setenv("DB_HOST", "127.0.0.1")
	t.Setenv("DB_PORT", "5432")
	t.Setenv("DB_USER", "storit")
	t.Setenv("DB_PASSWORD", "test-password")
	t.Setenv("DB_NAME", "storit_test")

	got := config.Load()
	want := "postgres://storit:test-password@127.0.0.1:5432/storit_test?sslmode=disable"
	if got.DatabaseURL != want {
		t.Errorf("DatabaseURL = %q, want %q", got.DatabaseURL, want)
	}
	if got.Port != "8080" {
		t.Errorf("Port = %q, want %q", got.Port, "8080")
	}
}

func TestLoadReadsStorageSettings(t *testing.T) {
	t.Setenv("R2_BUCKET", "dance-videos")
	t.Setenv("PLAYBACK_URL_TTL", "30m")
	t.Setenv("UPLOAD_URL_TTL", "not-a-duration")
	t.Setenv("MAX_UPLOAD_BYTES", "21474836480")

	got := config.Load()
	if got.R2Bucket != "dance-videos" {
		t.Fatalf("R2Bucket = %q, want %q", got.R2Bucket, "dance-videos")
	}
	if got.PlaybackURLTTL != 30*time.Minute {
		t.Fatalf("PlaybackURLTTL = %v, want 30m", got.PlaybackURLTTL)
	}
	if got.UploadURLTTL != time.Hour {
		t.Fatalf("UploadURLTTL = %v, want the 1h default for an invalid value", got.UploadURLTTL)
	}
	if got.MaxUploadBytes != 21474836480 {
		t.Fatalf("MaxUploadBytes = %d, want %d", got.MaxUploadBytes, 21474836480)
	}
}

func TestLoadReadsCommitVersionInfo(t *testing.T) {
	t.Setenv("COMMIT_HASH", "abc1234")
	t.Setenv("COMMIT_DATE", "2026-10-24 19:00:00 +0000")

	got := config.Load()
	if got.CommitHash != "abc1234" {
		t.Errorf("CommitHash = %q, want abc1234", got.CommitHash)
	}
	if got.CommitDate != "2026-10-24 19:00:00 +0000" {
		t.Errorf("CommitDate = %q, want 2026-10-24 19:00:00 +0000", got.CommitDate)
	}
}

func TestLoadFallsBackForMissingCommitVersionInfo(t *testing.T) {
	t.Setenv("COMMIT_HASH", "")
	t.Setenv("COMMIT_DATE", "")

	got := config.Load()
	if got.CommitHash != "local" {
		t.Errorf("CommitHash = %q, want local", got.CommitHash)
	}
	if got.CommitDate != "development" {
		t.Errorf("CommitDate = %q, want development", got.CommitDate)
	}
}


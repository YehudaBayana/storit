package tests

import (
	"context"
	"testing"

	"backend/internal/folders"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type mockFolderRepo struct {
	mock.Mock
}

func (m *mockFolderRepo) GetOrCreateRoot(ctx context.Context, userID uuid.UUID) (*folders.Folder, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*folders.Folder), args.Error(1)
}

func (m *mockFolderRepo) Create(ctx context.Context, userID uuid.UUID, parentID *uuid.UUID, name string) (*folders.Folder, error) {
	args := m.Called(ctx, userID, parentID, name)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*folders.Folder), args.Error(1)
}

func (m *mockFolderRepo) ListContents(ctx context.Context, userID uuid.UUID, folderID uuid.UUID) ([]folders.LibraryItem, error) {
	args := m.Called(ctx, userID, folderID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]folders.LibraryItem), args.Error(1)
}

func (m *mockFolderRepo) UpdateFolder(ctx context.Context, userID uuid.UUID, folderID uuid.UUID, name string, version int) (*folders.Folder, error) {
	args := m.Called(ctx, userID, folderID, name, version)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*folders.Folder), args.Error(1)
}

func (m *mockFolderRepo) MoveItem(ctx context.Context, userID uuid.UUID, itemID uuid.UUID, itemType string, targetFolderID uuid.UUID) error {
	args := m.Called(ctx, userID, itemID, itemType, targetFolderID)
	return args.Error(0)
}

func (m *mockFolderRepo) TrashItem(ctx context.Context, userID uuid.UUID, itemID uuid.UUID, itemType string) error {
	args := m.Called(ctx, userID, itemID, itemType)
	return args.Error(0)
}

func (m *mockFolderRepo) ListTrash(ctx context.Context, userID uuid.UUID) ([]folders.LibraryItem, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]folders.LibraryItem), args.Error(1)
}

func TestHandleRoot(t *testing.T) {
	_ = new(mockFolderRepo)
}

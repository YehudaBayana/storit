//go:build integration

package auth_test

import (
	"net/http"
	"testing"

	"backend/internal/auth"
	"backend/internal/testutils"

	"github.com/google/uuid"
)

func TestLoginSetsCookiesAndAllowsMeEndpoint(t *testing.T) {
	db := testutils.OpenTestDB(t)
	driver := newIntegrationAuthDriver(db)
	email := "login-test-" + uuid.NewString() + "@example.test"
	cleanupUserByEmail(t, db, email)

	reg := driver.register(t, email, "password123")
	if reg.Code != http.StatusCreated {
		t.Fatalf("register status = %d, want %d", reg.Code, http.StatusCreated)
	}

	// Logout first to test login specifically
	var sessionCookie *http.Cookie
	for _, c := range reg.Result().Cookies() {
		if c.Name == auth.SessionCookieName {
			sessionCookie = c
		}
	}
	// Clear session via logout
	_ = driver.request(t, http.MethodPost, "/api/auth/logout", nil, nil, sessionCookie)

	// Now login
	loginRes := driver.login(t, email, "password123")
	if loginRes.Code != http.StatusOK {
		t.Fatalf("login status = %d, want %d; body: %s", loginRes.Code, http.StatusOK, loginRes.Body.String())
	}

	var loginSessionCookie *http.Cookie
	for _, c := range loginRes.Result().Cookies() {
		if c.Name == auth.SessionCookieName {
			loginSessionCookie = c
		}
	}
	if loginSessionCookie == nil || loginSessionCookie.Value == "" {
		t.Fatalf("login did not set session cookie: %#v", loginRes.Result().Cookies())
	}

	meRes := driver.request(t, http.MethodGet, "/api/auth/me", nil, nil, loginSessionCookie)
	if meRes.Code != http.StatusOK {
		t.Fatalf("/me endpoint returned status = %d, want %d; body: %s", meRes.Code, http.StatusOK, meRes.Body.String())
	}
}

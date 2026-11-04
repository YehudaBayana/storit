package tests

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"backend/internal/logging"
)

func TestMiddlewareLogsRedactedBodiesAndClient(t *testing.T) {
	var output bytes.Buffer
	previous := slog.Default()
	slog.SetDefault(slog.New(slog.NewJSONHandler(&output, nil)))
	defer slog.SetDefault(previous)

	handler := logging.Middleware(http.HandlerFunc(func(responseWriter http.ResponseWriter, request *http.Request) {
		var ignored map[string]any
		_ = json.NewDecoder(request.Body).Decode(&ignored)
		responseWriter.WriteHeader(http.StatusUnauthorized)
		_, _ = responseWriter.Write([]byte(`{"error":{"code":"invalid_credentials"}}`))
	}))

	request := httptest.NewRequest(http.MethodPost, "/api/auth/login?token=abc&page=1", strings.NewReader(`{"email":"a@b.c","password":"hunter2","name":"x"}`))
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("User-Agent", "test-agent")
	request.Header.Set("X-Forwarded-For", "1.2.3.4, 5.6.7.8")
	handler.ServeHTTP(httptest.NewRecorder(), request)

	line := output.String()
	for _, secret := range []string{"hunter2", "a@b.c", "abc"} {
		if strings.Contains(line, secret) {
			t.Fatalf("log leaked %q: %s", secret, line)
		}
	}
	for _, expected := range []string{`"client_ip":"1.2.3.4"`, `"user_agent":"test-agent"`, `"name":"x"`, "invalid_credentials"} {
		if !strings.Contains(line, expected) {
			t.Fatalf("log missing %q: %s", expected, line)
		}
	}
}

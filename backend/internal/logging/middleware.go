package logging

import (
	"bytes"
	"io"
	"log/slog"
	"net/http"
	"runtime/debug"
	"time"

	"backend/internal/httputil"
)

const maxLoggedBodyBytes = 2048

type statusRecorder struct {
	http.ResponseWriter
	status int
	body   bytes.Buffer
}

// capturedBody keeps the first maxLoggedBodyBytes bytes that pass through it.
type capturedBody struct {
	io.ReadCloser
	buffer bytes.Buffer
}

func (captured *capturedBody) Read(destination []byte) (int, error) {
	count, err := captured.ReadCloser.Read(destination)
	if remaining := maxLoggedBodyBytes + 1 - captured.buffer.Len(); remaining > 0 && count > 0 {
		captured.buffer.Write(destination[:min(count, remaining)])
	}
	return count, err
}

func (recorder *statusRecorder) Write(data []byte) (int, error) {
	if remaining := maxLoggedBodyBytes + 1 - recorder.body.Len(); remaining > 0 {
		recorder.body.Write(data[:min(len(data), remaining)])
	}
	return recorder.ResponseWriter.Write(data)
}

func (recorder *statusRecorder) WriteHeader(status int) {
	recorder.status = status
	recorder.ResponseWriter.WriteHeader(status)
}

// Unwrap lets http.ResponseController reach the real writer (deadlines, flushing).
func (recorder *statusRecorder) Unwrap() http.ResponseWriter {
	return recorder.ResponseWriter
}

// Middleware logs one line per request and turns panics into a logged 500.
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(responseWriter http.ResponseWriter, request *http.Request) {
		recorder := &statusRecorder{ResponseWriter: responseWriter, status: http.StatusOK}
		startedAt := time.Now()
		var requestCapture *capturedBody
		if request.Body != nil && request.Body != http.NoBody && isJSON(request.Header.Get("Content-Type")) {
			requestCapture = &capturedBody{ReadCloser: request.Body}
			request.Body = requestCapture
		}

		defer func() {
			if recovered := recover(); recovered != nil {
				slog.Error("Request panicked",
					"panic", recovered,
					"stack", string(debug.Stack()),
					"method", request.Method,
					"path", request.URL.Path,
				)
				httputil.WriteError(recorder, http.StatusInternalServerError, "internal_error", "Internal server error")
				recorder.status = http.StatusInternalServerError
			}
			if request.URL.Path == "/health" || request.URL.Path == "/api/health" {
				return // Docker healthchecks would flood the logs.
			}
			attributes := []any{
				"method", request.Method,
				"path", request.URL.Path,
				"query", redactQuery(request.URL.RawQuery),
				"status", recorder.status,
				"duration_ms", time.Since(startedAt).Milliseconds(),
				"client_ip", clientIP(request),
				"user_agent", request.UserAgent(),
				"origin", request.Header.Get("Origin"),
				"referer", request.Referer(),
			}
			if requestCapture != nil && requestCapture.buffer.Len() > 0 {
				attributes = append(attributes, "request_body", redactJSON(requestCapture.buffer.Bytes()))
			}
			level := slog.LevelInfo
			if recorder.status >= http.StatusInternalServerError {
				level = slog.LevelWarn
			}
			if recorder.status >= http.StatusBadRequest && recorder.body.Len() > 0 {
				attributes = append(attributes, "response_body", truncate(recorder.body.String()))
			}
			slog.Log(request.Context(), level, "HTTP request", attributes...)
		}()

		next.ServeHTTP(recorder, request)
	})
}

package logging

import (
	"encoding/json"
	"net"
	"net/http"
	"net/url"
	"strings"
)

const redactedValue = "[redacted]"

var sensitiveKeyParts = []string{"password", "token", "secret", "authorization", "cookie", "csrf", "session", "email", "signature", "credential", "url"}

func isJSON(contentType string) bool {
	return strings.HasPrefix(strings.ToLower(contentType), "application/json")
}

func isSensitiveKey(key string) bool {
	lowered := strings.ToLower(key)
	for _, part := range sensitiveKeyParts {
		if strings.Contains(lowered, part) {
			return true
		}
	}
	return false
}

func redactValue(value any) any {
	switch typed := value.(type) {
	case map[string]any:
		for key, nested := range typed {
			if isSensitiveKey(key) {
				typed[key] = redactedValue
			} else {
				typed[key] = redactValue(nested)
			}
		}
	case []any:
		for index, nested := range typed {
			typed[index] = redactValue(nested)
		}
	}
	return value
}

// redactJSON masks sensitive keys. Truncated or invalid JSON is never logged raw.
func redactJSON(raw []byte) any {
	if len(raw) > maxLoggedBodyBytes {
		return "[body too large to log]"
	}
	var parsed any
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return "[unparseable body]"
	}
	return redactValue(parsed)
}

func redactQuery(rawQuery string) string {
	if rawQuery == "" {
		return ""
	}
	values, err := url.ParseQuery(rawQuery)
	if err != nil {
		return "[unparseable query]"
	}
	for key := range values {
		if isSensitiveKey(key) {
			values[key] = []string{redactedValue}
		}
	}
	return values.Encode()
}

// truncate shortens a response body and masks it when it is not a small JSON document.
func truncate(body string) any {
	if len(body) > maxLoggedBodyBytes {
		return body[:maxLoggedBodyBytes] + "…[truncated]"
	}
	var parsed any
	if err := json.Unmarshal([]byte(body), &parsed); err == nil {
		return redactValue(parsed)
	}
	return body
}

func clientIP(request *http.Request) string {
	if forwarded := request.Header.Get("X-Forwarded-For"); forwarded != "" {
		return strings.TrimSpace(strings.Split(forwarded, ",")[0])
	}
	if host, _, err := net.SplitHostPort(request.RemoteAddr); err == nil {
		return host
	}
	return request.RemoteAddr
}

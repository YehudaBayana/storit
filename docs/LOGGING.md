# Logging architecture

Backend logs and errors flow through three tools. Read this before adding a feature that logs, handles errors, or changes the Docker setup.

| Tool                           | Purpose                                             | Where                |
| ------------------------------ | --------------------------------------------------- | -------------------- |
| `slog` to stdout               | The only way the backend emits logs                 | `internal/logging`   |
| Sentry                         | Errors and panics, grouped into issues, with alerts | sentry.io            |
| Grafana Cloud (Loki) via Alloy | Searchable log history and dashboards               | grafana.com          |
| Dozzle                         | Live container log viewer for quick debugging       | SSH tunnel to the VM |

```mermaid
flowchart LR
  Backend[backend slog JSON stdout] --> Docker[Docker json-file logs]
  Docker --> Alloy --> Loki[Grafana Cloud Loki]
  Docker --> Dozzle
  Backend -- Error level --> Sentry
```

## How the backend logs

- `logging.Setup(cfg)` in `main.go` installs the default logger. `ENV=production` writes JSON at Info level; anything else writes text at Debug level.
- If `SENTRY_DSN` is set, every `slog.Error` is also sent to Sentry. Without it nothing is sent, so local development needs no setup.
- `logging.Middleware` wraps the whole HTTP handler. It logs one `HTTP request` line (method, path, query, status, duration_ms, client_ip, user_agent, origin, referer, plus `request_body` for JSON requests and `response_body` for 4xx/5xx), skips `/health`, and converts panics into a logged 500. 5xx are logged at `WARN`. Bodies are capped at 2 KB and keys containing password, token, secret, cookie, csrf, session, email, signature, credential or url are replaced by `[redacted]` (`internal/logging/redact.go`). Non-JSON bodies (uploads) are never logged.

## Rules for new code

1. Use `slog` with key/value pairs. Never `fmt.Println`, `log.Printf` or `println`.
2. Put the error under the key `error`: `slog.Error("Failed to create video", "error", err, "owner_id", ownerID)`. The Sentry handler reads that key to build the issue, and groups issues by message.
3. Keep messages constant and put variable data in attributes. Do not interpolate ids into the message, or Sentry creates one issue per id.
4. Levels:
   - `Error`: something broke and a person should look (reported to Sentry). Use it for unexpected failures only.
   - `Warn`: handled or expected problems (bad input, retries, a missing optional config). Not sent to Sentry.
   - `Info`: lifecycle events and business milestones (startup, shutdown, video ready).
   - `Debug`: development detail. Dropped in production.
5. Log an error once, at the layer that handles it (usually the handler's `writeServiceError` or a worker loop). Services wrap and return errors; they do not also log them.
6. Never log secrets or personal data: passwords, session ids, CSRF tokens, cookies, `Authorization` headers, presigned URLs, DSNs, email addresses. Ids (`uuid`) are fine.
7. Do not log request or response bodies yourself. Only `logging.Middleware` does, with redaction. If you add a sensitive field name, make sure it matches a key in `redact.go`.
8. Background work (processor, janitor) logs `Error` for a failed job with the job id attribute so the Sentry issue is traceable.
9. New configuration (DSNs, tokens) is read in `config.Load()` only. Numbers such as timeouts live in `config/limits.go`.
10. Frontend errors are out of scope here. If the frontend gets Sentry later, use a separate Sentry project and DSN.

## Setup on the VM

1. **Sentry**: create a Go project, copy the DSN, set `SENTRY_DSN` in `.env`. Add an alert rule for new issues.
2. **Grafana Cloud**: in the stack, open Connections, then Loki, and note the push URL, the user id and create an access token with the `logs:write` scope. Set in `.env`:
   ```
   GRAFANA_LOKI_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push
   GRAFANA_LOKI_USER=<numeric user id>
   GRAFANA_LOKI_TOKEN=<access token>
   ```
3. Start everything (set `ENV=production` in `.env`):
   ```
   docker compose --profile observability up -d --build
   ```
   Without `--profile observability` only the backend and Postgres run.
4. **Dozzle** listens on `127.0.0.1:8888` on the VM only. Open it from your laptop with a tunnel:
   ```
   ssh -L 8888:127.0.0.1:8888 <user>@151.145.93.160
   ```
   then browse to http://localhost:8888. Do not open port 8888 in the Oracle security list.

## Querying in Grafana

- All backend errors: `{service="backend", level="ERROR"}`
- One request path: `{service="backend"} | json | path="/api/videos"`
- Slow requests: `{service="backend"} | json | duration_ms > 1000`

## Request monitoring dashboard

Create it in Grafana: Dashboards > New > New dashboard, pick the Loki data source for every panel. Put a `$status`-free base selector in each query: `{service="backend"} | json | msg="HTTP request"`.

Variables (Settings > Variables > Query, type Label/Custom): `path` (custom, `All` allowed) and `search` (Text box). Filter with `| path=~"$path"` and `|~ "(?i)$search"`.

| Panel (type)              | Query                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Requests/sec (Stat)       | `sum(rate({service="backend"} \| json \| msg="HTTP request" [$__interval]))`                                                                            |
| Requests by status (Time series, stacked) | `sum by (status) (count_over_time({service="backend"} \| json \| msg="HTTP request" [$__interval]))`                                    |
| Error rate % (Gauge)      | `100 * sum(count_over_time({service="backend"} \| json \| status>=400 [$__range])) / sum(count_over_time({service="backend"} \| json \| msg="HTTP request" [$__range]))` |
| p95 latency (Time series) | `quantile_over_time(0.95, {service="backend"} \| json \| msg="HTTP request" \| unwrap duration_ms [$__interval]) by (path)`                           |
| Top paths (Bar gauge)     | `topk(10, sum by (path) (count_over_time({service="backend"} \| json \| msg="HTTP request" [$__range])))`                                              |
| Top clients (Table)       | `topk(10, sum by (client_ip, user_agent) (count_over_time({service="backend"} \| json \| msg="HTTP request" [$__range])))`                             |
| Failed requests (Logs)    | `{service="backend"} \| json \| msg="HTTP request" \| status>=400 \| line_format "{{.status}} {{.method}} {{.path}} {{.client_ip}} req={{.request_body}} res={{.response_body}}"` |
| All requests (Logs)       | `{service="backend"} \| json \| msg="HTTP request" \| path=~"$path" \|~ "(?i)$search"`                                                                |

Readable times: the Logs panel shows the Loki timestamp in the browser timezone. Set Dashboard settings > Timezone to Browser and the Logs panel option "Time" on; use `line_format` as above to put the useful fields first. In Time series panels set Standard options > Unit to `duration (ms)` for latency.

## Security notes

- Alloy and Dozzle mount `/var/run/docker.sock` read-only. That still exposes container metadata, which is why Dozzle stays on localhost.
- Keep tokens in `.env` (gitignored). Never commit them.
- Log rotation is set in `docker-compose.yml` (10 MB x 3 files per container).

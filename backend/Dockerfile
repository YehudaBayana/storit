FROM golang:1.27.0-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /server ./cmd/server

FROM alpine:3.20

RUN apk add --no-cache ffmpeg ca-certificates && \
    adduser -D -u 10001 app

COPY --from=build /server /usr/local/bin/server

USER app

EXPOSE 8080
CMD ["server"]

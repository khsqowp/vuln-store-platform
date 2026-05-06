#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/shop"
LOG_DIR="$ROOT_DIR/logs/dev"
COMMAND="${1:-start}"

FRONTEND_CANDIDATES=(3100 3003 3200 3301 3400)
BACKEND_CANDIDATES=(8100 8003 8181 9000 9100)

PIDS=()
DETACHED_STARTED=0
MYSQL_STARTED=0

if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

if [[ "$COMMAND" == "foreground" || "${FOREGROUND:-0}" == "1" ]]; then
  DETACH=0
else
  DETACH="${DETACH:-1}"
fi

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Killing processes on port $port: $pids"
    kill $pids 2>/dev/null || true
    sleep 1
    pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
    if [[ -n "$pids" ]]; then
      kill -9 $pids 2>/dev/null || true
    fi
  fi
}

is_free() {
  local port="$1"
  ! lsof -ti tcp:"$port" >/dev/null 2>&1
}

pick_port() {
  local port
  for port in "$@"; do
    if is_free "$port"; then
      echo "$port"
      return 0
    fi
  done
  return 1
}

cleanup() {
  if [[ "${DETACHED_STARTED:-0}" == "1" ]]; then
    return
  fi
  for pid in "${PIDS[@]:-}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
}

trap cleanup EXIT INT TERM

wait_for_url() {
  local name="$1"
  local url="$2"
  local log_file="$3"
  local pid="$4"
  local attempts=60

  for _ in $(seq 1 "$attempts"); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "$name is ready: $url"
      return 0
    fi

    if ! kill -0 "$pid" 2>/dev/null; then
      echo "$name failed to start. Recent log:" >&2
      tail -80 "$log_file" >&2 || true
      exit 1
    fi

    sleep 1
  done

  echo "$name did not become ready within ${attempts}s. Recent log:" >&2
  tail -80 "$log_file" >&2 || true
  exit 1
}

start_mysql_if_available() {
  if [[ "${SKIP_DOCKER:-0}" == "1" ]]; then
    return
  fi
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker command not found. Backend will use configured datasource fallback." >&2
    return
  fi
  if [[ ! -f "$ROOT_DIR/docker-compose.local.yml" ]]; then
    return
  fi

  echo "Starting MySQL/Redis infrastructure with Docker Compose..."
  if ! docker compose -f "$ROOT_DIR/docker-compose.local.yml" up -d mysql redis; then
    if [[ "${REQUIRE_MYSQL:-0}" == "1" ]]; then
      echo "Docker MySQL is required but Docker is not available." >&2
      exit 1
    fi
    echo "Docker is not available. Continuing with Spring datasource fallback." >&2
    return
  fi

  local attempts=60
  for _ in $(seq 1 "$attempts"); do
    if docker compose -f "$ROOT_DIR/docker-compose.local.yml" exec -T mysql mysqladmin ping -h 127.0.0.1 -P "${MYSQL_PORT:-13306}" -uroot -p"${MYSQL_ROOT_PASSWORD:-vulshop-local-root-password}" >/dev/null 2>&1; then
      echo "MySQL is ready on 127.0.0.1:${MYSQL_PORT:-13306}"
      MYSQL_STARTED=1
      return
    fi
    sleep 1
  done

  echo "MySQL did not become ready within ${attempts}s." >&2
  exit 1
}

if [[ "$COMMAND" == "stop" ]]; then
  echo "Stopping known development ports..."
  for port in "${FRONTEND_CANDIDATES[@]}" "${BACKEND_CANDIDATES[@]}"; do
    kill_port "$port"
  done
  echo "Stopped."
  exit 0
fi

echo "Cleaning known development ports..."
for port in "${FRONTEND_CANDIDATES[@]}" "${BACKEND_CANDIDATES[@]}"; do
  kill_port "$port"
done

FRONTEND_PORT="$(pick_port "${FRONTEND_CANDIDATES[@]}")"
BACKEND_PORT="$(pick_port "${BACKEND_CANDIDATES[@]}")"

if [[ -z "${FRONTEND_PORT:-}" || -z "${BACKEND_PORT:-}" ]]; then
  echo "No free development port found." >&2
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Installing frontend dependencies..."
  npm install --prefix "$FRONTEND_DIR"
fi

start_mysql_if_available

mkdir -p "$LOG_DIR"
BACKEND_LOG="$LOG_DIR/backend-$BACKEND_PORT.log"
FRONTEND_LOG="$LOG_DIR/frontend-$FRONTEND_PORT.log"

export VITE_API_BASE_URL="http://127.0.0.1:$BACKEND_PORT"
export SERVER_PORT="$BACKEND_PORT"
if [[ "$MYSQL_STARTED" == "1" ]]; then
  export SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL:-jdbc:mysql://127.0.0.1:${MYSQL_PORT:-13306}/${MYSQL_DATABASE:-vulshop}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul}"
  export SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME:-${MYSQL_USER:-vulshop}}"
  export SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD:-${MYSQL_PASSWORD:-vulshop-local-password}}"
  export SPRING_JPA_DATABASE_PLATFORM="${SPRING_JPA_DATABASE_PLATFORM:-org.hibernate.dialect.MySQLDialect}"
  export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO:-update}"
else
  unset SPRING_DATASOURCE_URL SPRING_DATASOURCE_USERNAME SPRING_DATASOURCE_PASSWORD SPRING_JPA_DATABASE_PLATFORM
  export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO:-update}"
  echo "MySQL is not active. Backend will use H2 fallback for this run." >&2
fi
if [[ "${USE_PROJECT_GRADLE_HOME:-0}" == "1" ]]; then
  export GRADLE_USER_HOME="$ROOT_DIR/.gradle"
fi

echo "Starting backend on http://127.0.0.1:$BACKEND_PORT"
if [[ "${DETACH:-1}" == "1" ]]; then
  nohup bash -c '
    cd "$1"
    if [[ -d /opt/homebrew/Cellar/openjdk/25.0.2/libexec/openjdk.jdk/Contents/Home ]]; then
      export JAVA_HOME=/opt/homebrew/Cellar/openjdk/25.0.2/libexec/openjdk.jdk/Contents/Home
    fi
    exec ./gradlew --console=plain bootRun --args="--server.port=$2"
  ' bash "$BACKEND_DIR" "$BACKEND_PORT" >"$BACKEND_LOG" 2>&1 &
else
  (
    cd "$BACKEND_DIR"
    if [[ -d /opt/homebrew/Cellar/openjdk/25.0.2/libexec/openjdk.jdk/Contents/Home ]]; then
      export JAVA_HOME=/opt/homebrew/Cellar/openjdk/25.0.2/libexec/openjdk.jdk/Contents/Home
    fi
    ./gradlew --console=plain bootRun --args="--server.port=$BACKEND_PORT"
  ) >"$BACKEND_LOG" 2>&1 &
fi
BACKEND_PID="$!"
PIDS+=("$BACKEND_PID")

echo "Starting frontend on http://127.0.0.1:$FRONTEND_PORT"
if [[ "${DETACH:-1}" == "1" ]]; then
  nohup bash -c '
    cd "$1"
    exec npm run dev -- --host 127.0.0.1 --port "$2" --strictPort
  ' bash "$FRONTEND_DIR" "$FRONTEND_PORT" >"$FRONTEND_LOG" 2>&1 &
else
  (
    cd "$FRONTEND_DIR"
    npm run dev -- --host 127.0.0.1 --port "$FRONTEND_PORT" --strictPort
  ) >"$FRONTEND_LOG" 2>&1 &
fi
FRONTEND_PID="$!"
PIDS+=("$FRONTEND_PID")

wait_for_url "Backend" "http://127.0.0.1:$BACKEND_PORT/api/vulnerability-scenarios/VULN-001" "$BACKEND_LOG" "$BACKEND_PID"
wait_for_url "Frontend" "http://127.0.0.1:$FRONTEND_PORT/" "$FRONTEND_LOG" "$FRONTEND_PID"

echo
echo "Development servers are running."
echo "Frontend: http://127.0.0.1:$FRONTEND_PORT"
echo "Backend:  http://127.0.0.1:$BACKEND_PORT"
echo "Backend log:  $BACKEND_LOG"
echo "Frontend log: $FRONTEND_LOG"
echo

if [[ "${DETACH:-1}" == "1" ]]; then
  DETACHED_STARTED=1
  echo "Detached mode enabled. Server PIDs: backend=$BACKEND_PID frontend=$FRONTEND_PID"
  echo "Stop with: ./scripts/dev.sh stop"
  exit 0
fi

echo "Foreground mode enabled. Press Ctrl+C to stop both servers."

wait

#!/usr/bin/env bash
# Free TCP listen ports 3000–3020 (macOS / Linux with lsof).
set -u
for port in $(seq 3000 3020); do
  pids=$(lsof -ti TCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$pids" ]; then
    # shellcheck disable=SC2086
    kill -9 $pids 2>/dev/null || true
  fi
done

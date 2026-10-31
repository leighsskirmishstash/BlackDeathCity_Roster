#!/usr/bin/env bash
# Opens the Black Death City roster builder in the default browser.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
export PATH="/usr/bin:/bin:${PATH}"
PORT=4173

if [[ ! -d node_modules ]]; then
  /usr/bin/npm install
fi
if [[ ! -f dist/index.html || src/ui/App.tsx -nt dist/index.html ]]; then
  /usr/bin/npm run build
fi

if [[ -f "$DIR/.preview.pid" ]]; then
  old="$(cat "$DIR/.preview.pid" || true)"
  if [[ -n "${old}" ]]; then
    kill "${old}" 2>/dev/null || true
  fi
fi
if /usr/bin/ss -ltn | /usr/bin/grep -q ":${PORT} "; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
  sleep 0.3
fi

nohup /usr/bin/npm run preview -- --host 127.0.0.1 --port "${PORT}" --strictPort \
  > "$DIR/.preview.log" 2>&1 &
echo $! > "$DIR/.preview.pid"

ready=0
for _ in $(seq 1 50); do
  if /usr/bin/curl -sf -o /dev/null "http://127.0.0.1:${PORT}/"; then
    ready=1
    break
  fi
  sleep 0.2
done

if [[ "${ready}" -ne 1 ]]; then
  /usr/bin/notify-send "Black Death City" "The roster builder did not start. See roster-builder/.preview.log" || true
  exit 1
fi

/usr/bin/xdg-open "http://127.0.0.1:${PORT}/"

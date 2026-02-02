#!/bin/sh
set -eu

# Generate runtime config (consumed by your frontend fetch("/config.json"))
# Expect VITE_WS_URL to be something like:
#   wss://proxy....azurecontainerapps.io
# or wss://ws.teemutero.com
WS_URL="${VITE_WS_URL:-}"

cat > /usr/share/nginx/html/config.json <<EOF
{
  "wsUrl": "${WS_URL}"
}
EOF

exec "$@"
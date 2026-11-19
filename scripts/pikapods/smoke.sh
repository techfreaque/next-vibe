#!/bin/bash
# Run on the release runner with a disposable PostgreSQL database and the loaded image.
set -euo pipefail
: "${IMAGE:?}" "${POD_NETWORK:?}" "${DATABASE_URL:?}"
export VIBE_ADMIN_USER_EMAIL=pod-check@example.org
VIBE_ADMIN_USER_PASSWORD=$(openssl rand -hex 18)
JWT_SECRET_KEY=$(openssl rand -hex 32)
CRON_SECRET=$(openssl rand -hex 32)
export VIBE_ADMIN_USER_PASSWORD JWT_SECRET_KEY CRON_SECRET
export NEXT_PUBLIC_APP_URL=http://localhost:3000
pod="pod-smoke-$RANDOM-$$"
scratch=${RUNNER_TEMP:-$PWD/.tmp}
mkdir -p "$scratch"
work=$(mktemp -d "$scratch/pod-smoke-XXXXXX")
cleanup() {
  docker stop "$pod" >/dev/null 2>&1 || true
  : > "$work/cookies"
  : > "$work/session"
}
trap cleanup EXIT
start_pod() {
  docker run --rm -d --name "$pod" --network "$POD_NETWORK" -p 127.0.0.1:3000:3000 \
    -v "$pod:/data" -e DATABASE_URL -e NEXT_PUBLIC_APP_URL -e VIBE_ADMIN_USER_EMAIL \
    -e VIBE_ADMIN_USER_PASSWORD -e JWT_SECRET_KEY -e CRON_SECRET "$IMAGE"
  for attempt in {1..120}; do
    if [[ $(curl -s --max-time 3 -o /dev/null -w '%{http_code}' "$NEXT_PUBLIC_APP_URL/en-US/tools" || true) == 303 ]]; then return; fi
    if [[ $(docker inspect -f '{{.State.Running}}' "$pod") != true ]]; then break; fi
    sleep 2
  done
  echo "Pod failed to serve the protected tools page" >&2
  exit 1
}
start_pod
api="$NEXT_PUBLIC_APP_URL/api/en-US"
[[ $(curl -s -o /dev/null -w '%{http_code}' "$api/vibe/help-tool?query=brave") == 401 ]]
[[ $(curl --http1.1 --max-time 10 -s -o /dev/null -w '%{http_code}' -H 'Upgrade: websocket' \
  -H 'Connection: Upgrade' -H 'Sec-WebSocket-Version: 13' \
  -H "Sec-WebSocket-Key: $(openssl rand -base64 16)" "$NEXT_PUBLIC_APP_URL/ws") == 401 ]]
# Get the real login page and its CSRF and lead cookies before posting the form.
curl --retry 10 --retry-all-errors -fsSL -c "$work/cookies" -b "$work/cookies" "$NEXT_PUBLIC_APP_URL/en-US/user/login" > "$work/login"
csrf=$(awk '$6 == "csrf_token" { print $7 }' "$work/cookies" | tail -1)
test -n "$csrf"
jq -n '{email:env.VIBE_ADMIN_USER_EMAIL,password:env.VIBE_ADMIN_USER_PASSWORD}' |
  curl -fsS -b "$work/cookies" -c "$work/cookies" -H "X-CSRF-Token: $csrf" \
    -H 'Content-Type: application/json' --data-binary @- "$api/user/public/login" > "$work/session"
jq -e '.success == true and (.data.token | length > 20)' "$work/session" > /dev/null
curl -fsS -b "$work/cookies" "$api/vibe/help-tool?query=brave" | grep 'brave-search' > /dev/null
# Use the release's browser driver and the runner's installed Chrome.
docker cp "$pod:/app/node_modules/playwright-core" "$work/playwright-core"
POD_WORK="$work" CHROME_BIN="$(command -v google-chrome)" node <<'JS'
const { chromium } = require(process.env.POD_WORK + "/playwright-core");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN });
  try {
    const page = await browser.newPage();
    const { token, leadId } = JSON.parse(fs.readFileSync(process.env.POD_WORK + "/session")).data;
    const url = process.env.NEXT_PUBLIC_APP_URL;
    await page.context().addCookies([
      { name: "token", value: token, url },
      { name: "lead_id", value: leadId, url }
    ]);
    await page.goto(url + "/en-US/tools?q=brave&sf=all", { waitUntil: "domcontentloaded" });
    await page.getByText("Brave Search", { exact: true }).first().waitFor({ timeout: 60000 });
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err.message); process.exitCode = 1; });
JS
docker exec "$pod" vibe tool-help --query=brave | grep -E 'Call as[[:space:]]+vibe brave-search' > /dev/null
python3 scripts/pikapods/flowstacks-mcp.py docker exec -i "$pod" vibe mcp
file_id=$(docker exec "$pod" bun -e '
  import { LocalStorageAdapter } from "./src/vibe/agent/chat/storage/local-adapter";
  const result = await new LocalStorageAdapter().uploadFile(Buffer.from("pod smoke"), {
    filename: "example.txt", mimeType: "text/plain", threadId: "release-check"
  });
  process.stdout.write(result.fileId);
')
# Recreate the disposable container using the same DB and named volume.
docker stop "$pod" > /dev/null
start_pod
docker exec -e "PROBE_FILE_ID=$file_id" "$pod" bun -e '
  import { LocalStorageAdapter } from "./src/vibe/agent/chat/storage/local-adapter";
  const contents = await new LocalStorageAdapter().readFileAsBase64(process.env.PROBE_FILE_ID, "release-check");
  if (contents !== Buffer.from("pod smoke").toString("base64")) process.exit(1);
'
curl -fsS -b "$work/cookies" "$api/vibe/help-tool?query=brave" | grep 'brave-search' > /dev/null

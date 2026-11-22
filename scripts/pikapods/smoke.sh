#!/bin/bash
# Verify a loaded pod image against a disposable PostgreSQL database.
# Used by the release workflow and by scripts/pikapods/release.sh.
# Needs docker, node, python3, curl, openssl and Chrome or Chromium on the host.
set -euo pipefail
: "${IMAGE:?}" "${POD_NETWORK:?}" "${DATABASE_URL:?}"
export VIBE_ADMIN_USER_EMAIL=pod-check@example.org
VIBE_ADMIN_USER_PASSWORD=$(openssl rand -hex 18)
JWT_SECRET_KEY=$(openssl rand -hex 32)
CRON_SECRET=$(openssl rand -hex 32)
export VIBE_ADMIN_USER_PASSWORD JWT_SECRET_KEY CRON_SECRET
# A random loopback port keeps the check clear of local dev servers.
POD_PORT=${POD_PORT:-$((40000 + RANDOM % 20000))}
export NEXT_PUBLIC_APP_URL="http://localhost:$POD_PORT"
CHROME_BIN=${CHROME_BIN:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}
pod="pod-smoke-$RANDOM-$$"
volume="$pod-data"
scratch=${RUNNER_TEMP:-$PWD/.tmp}
mkdir -p "$scratch"
work=$(mktemp -d "$scratch/pod-smoke-XXXXXX")
step() { printf '== %s\n' "$*"; }
cleanup() {
  docker rm -f "$pod" >/dev/null 2>&1 || true
  docker volume rm "$volume" >/dev/null 2>&1 || true
  : > "$work/cookies"
  : > "$work/session"
}
trap cleanup EXIT
start_pod() {
  docker run --rm -d --name "$pod" --network "$POD_NETWORK" -p "127.0.0.1:$POD_PORT:3000" \
    -v "$volume:/data" -e DATABASE_URL -e NEXT_PUBLIC_APP_URL -e VIBE_ADMIN_USER_EMAIL \
    -e VIBE_ADMIN_USER_PASSWORD -e JWT_SECRET_KEY -e CRON_SECRET "$IMAGE" > /dev/null
  local started=$SECONDS
  for _ in {1..150}; do
    if [[ $(curl -s --max-time 3 -o /dev/null -w '%{http_code}' "$NEXT_PUBLIC_APP_URL/en-US/tools" || true) == 303 ]]; then
      step "pod serving after $((SECONDS - started)) s"
      return
    fi
    if [[ $(docker inspect -f '{{.State.Running}}' "$pod" 2>/dev/null || echo false) != true ]]; then break; fi
    sleep 2
  done
  docker logs "$pod" 2>&1 | tail -50 >&2 || true
  echo "Pod failed to serve the protected tools page" >&2
  exit 1
}
json_check() {
  node -e 'const v = JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8"));
    if (!new Function("v", "return " + process.argv[2])(v)) process.exit(1);' "$1" "$2"
}

step "fresh install: $IMAGE on $NEXT_PUBLIC_APP_URL"
start_pod
api="$NEXT_PUBLIC_APP_URL/api/en-US"
step "guests are rejected"
[[ $(curl -s -o /dev/null -w '%{http_code}' "$NEXT_PUBLIC_APP_URL/en-US/threads") == 303 ]]
[[ $(curl -s -o /dev/null -w '%{http_code}' "$api/vibe/help-tool?query=brave") == 401 ]]
[[ $(curl --http1.1 --max-time 10 -s -o /dev/null -w '%{http_code}' -H 'Upgrade: websocket' \
  -H 'Connection: Upgrade' -H 'Sec-WebSocket-Version: 13' \
  -H "Sec-WebSocket-Key: $(openssl rand -base64 16)" "$NEXT_PUBLIC_APP_URL/ws") == 401 ]]

step "administrator login"
# Load the real login page first, like a browser, to get the lead cookie.
curl --retry 10 --retry-all-errors -fsSL -c "$work/cookies" -b "$work/cookies" "$NEXT_PUBLIC_APP_URL/en-US/user/login" > "$work/login"
grep -q '<form' "$work/login"
# A first visit may not carry a CSRF cookie yet; the server only checks the
# header against a cookie it has issued.
csrf=$(awk '$6 == "csrf_token" { print $7 }' "$work/cookies" | tail -1)
csrf_header=()
if [[ -n $csrf ]]; then csrf_header=(-H "X-CSRF-Token: $csrf"); fi
node -e 'process.stdout.write(JSON.stringify({ email: process.env.VIBE_ADMIN_USER_EMAIL, password: process.env.VIBE_ADMIN_USER_PASSWORD }))' |
  curl -fsS -b "$work/cookies" -c "$work/cookies" "${csrf_header[@]}" \
    -H 'Content-Type: application/json' --data-binary @- "$api/user/public/login" > "$work/session"
json_check "$work/session" 'v.success === true && v.data.token.length > 20'

step "tool via HTTP"
curl -fsS -b "$work/cookies" "$api/vibe/help-tool?query=brave" | grep 'brave-search' > /dev/null

step "web: chat UI and tool directory in headless Chrome"
# Use the release's browser driver and the host's installed Chrome.
docker cp "$pod:/app/node_modules/playwright-core" "$work/playwright-core"
POD_WORK="$work" CHROME_BIN="$CHROME_BIN" node <<'JS'
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
    await page.goto(url + "/en-US/threads", { waitUntil: "domcontentloaded" });
    await page.locator("textarea").first().waitFor({ state: "visible", timeout: 90000 });
    await page.screenshot({ path: process.env.POD_WORK + "/chat.png" });
    await page.goto(url + "/en-US/tools?q=brave&sf=all", { waitUntil: "domcontentloaded" });
    await page.getByText("Brave Search", { exact: true }).first().waitFor({ timeout: 90000 });
    await page.screenshot({ path: process.env.POD_WORK + "/tools.png" });
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err.message); process.exitCode = 1; });
JS

step "CLI"
docker exec "$pod" vibe tool-help --query=brave | grep -E 'Call as[[:space:]]+vibe brave-search' > /dev/null
step "MCP"
python3 scripts/pikapods/flowstacks-mcp.py docker exec -i "$pod" vibe mcp

step "files persist on the volume across a container restart"
file_id=$(docker exec "$pod" bun -e '
  import { LocalStorageAdapter } from "./src/vibe/agent/chat/storage/local-adapter";
  const result = await new LocalStorageAdapter().uploadFile(Buffer.from("pod smoke"), {
    filename: "example.txt", mimeType: "text/plain", threadId: "release-check"
  });
  process.stdout.write(result.fileId);
')
test -n "$file_id"
# Recreate the disposable container using the same DB and named volume.
docker stop "$pod" > /dev/null
for _ in {1..30}; do docker inspect "$pod" > /dev/null 2>&1 || break; sleep 1; done
start_pod
docker exec -e "PROBE_FILE_ID=$file_id" "$pod" bun -e '
  import { LocalStorageAdapter } from "./src/vibe/agent/chat/storage/local-adapter";
  const contents = await new LocalStorageAdapter().readFileAsBase64(process.env.PROBE_FILE_ID, "release-check");
  if (contents !== Buffer.from("pod smoke").toString("base64")) process.exit(1);
'
step "session survives the restart"
curl -fsS -b "$work/cookies" "$api/vibe/help-tool?query=brave" | grep 'brave-search' > /dev/null
step "all checks passed (screenshots in $work)"

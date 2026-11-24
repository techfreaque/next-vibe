#!/bin/bash
# Read-only. Run on the node before releasing its drain. The public apex can
# serve the peer while drained; the local origin listener cannot.
set -euo pipefail
if [[ ${1:-} == --wait ]]; then
  for ((i=0; i<10; i++)); do
    if bash "$0"; then exit 0; fi
    sleep 2
  done
  echo "Edge canary still failing after 10 attempts" >&2
  exit 1
fi
. /etc/ha-failover/ha.env
case "${HA_NODE:?}" in
  s1) app=next-vibe-app; caddy=caddy-caddy-1; drain=/caddy/data/ha-drain/s1 ;;
  s2) app=unbottled-app; caddy=caddy; drain=/root/caddy_data/ha-drain/s2 ;;
  *) exit 1 ;;
esac
name=unbottled.ai
expected="$app:3000"
edge_pid=$(docker inspect -f '{{.State.Pid}}' "$caddy")
app_pid=$(docker inspect -f '{{.State.Pid}}' "$app")
edge=(nsenter -t "$edge_pid" -n)
origin=(nsenter -t "$app_pid" -n)
http=(curl --noproxy '*' -fsS --connect-timeout 2 --max-time 4)
# An unavailable admin API must fail the check. The active config can contain
# credentials. Only the listener classification leaves the parser.
mode=$("${edge[@]}" "${http[@]}" http://127.0.0.1:2019/config/apps/http/servers/ |
  python3 -c 'import json,sys
servers=json.load(sys.stdin)
def listens(server, port):
    return any(address.rsplit(":", 1)[-1] == port for address in server["listen"])
origins = [s for s in servers.values() if listens(s, "19381")]
if not any(listens(s, "443") for s in servers.values()):
    sys.exit("Missing HTTPS listener")
if any(json.dumps("/_ha/admit") in json.dumps(s) for s in origins):
    print("v1")
else:
    print("gated" if origins else "legacy")')

# Keep headers and body together from one request. A redirect, peer response
# or diagnostic HTML must never satisfy an own-origin canary.
check() {
  local kind=$1 upstream=$2 response headers body status
  shift 2
  response=$("$@" -D - -w '\n%{http_code}') || return 1
  status=${response##*$'\n'}
  [[ $status == 200 && $response == *$'\r\n\r\n'* ]] || return 1
  headers=${response%%$'\r\n\r\n'*}
  body=${response#*$'\r\n\r\n'}
  body=${body%$'\n'200}
  if [[ -n $upstream ]]; then
    grep -Fxiq "x-ha-upstream: $upstream" <<< "$(tr -d '\r' <<< "$headers")" || return 1
    # The warm app can use the same logical upstream during a primary handoff.
    if [[ $mode == v1 ]] || grep -iq '^x-ha-app-instance:' <<< "$headers"; then
      grep -Fxiq "x-ha-app-instance: $upstream" <<< "$(tr -d '\r' <<< "$headers")" || return 1
    fi
  fi
  case "$kind" in
    robots) grep -iq '^user-agent:' <<< "$body" ;;
    versioned)
      grep -Fxiq 'x-ha-readiness: v1-ready' <<< "$(tr -d '\r' <<< "$headers")" &&
        [[ $body == $'ready\n' ]] ;;
    ready) [[ $body == $'ready\n' ]] ;;
  esac
}

public=("${http[@]}" --resolve "$name:443:${HA_SELF_PUBLIC:?}")
if [[ ${1:-} == --activation || $mode == v1 ]]; then
  for port in 3099 3000; do
    check versioned "" "${origin[@]}" "${http[@]}" "http://127.0.0.1:$port/_ha/ready" ||
      { echo "Activation blocked: $app:$port lacks healthy v1 readiness" >&2; exit 1; }
  done
fi
check robots "" "${origin[@]}" "${http[@]}" http://127.0.0.1:3000/robots.txt ||
  { echo "$HA_NODE app renderer failed" >&2; exit 1; }
if [[ $mode != legacy ]]; then
  check ready "$expected" "${public[@]}" "https://$name/_ha/ready" ||
    { echo "$HA_NODE pinned readiness failed" >&2; exit 1; }
  check robots "$expected" "${edge[@]}" "${http[@]}" -H "X-HA-Host: $name" \
    http://127.0.0.1:19381/robots.txt ||
    { echo "$HA_NODE local edge rejected $expected" >&2; exit 1; }
fi
public_upstream=$expected
if [[ -f $drain ]]; then public_upstream=""; fi
check robots "$public_upstream" "${public[@]}" "https://$name/robots.txt" ||
  { echo "$HA_NODE pinned HTTPS canary failed" >&2; exit 1; }
echo "$HA_NODE $mode edge canary passed"

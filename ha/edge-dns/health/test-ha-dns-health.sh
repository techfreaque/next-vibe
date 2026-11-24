#!/bin/sh
# Offline test of ha-dns-health.sh: stub curl, scripted responses, real
# sweep()/render() logic. Run in the same image as the daemon:
#   docker run --rm -v "$PWD/ha/edge-dns/health:/t:ro" alpine:3.20 sh /t/test-ha-dns-health.sh
set -u
T="$(cd "$(dirname "$0")" && pwd)"
W="$(mktemp -d)"; trap 'rm -rf "$W"' EXIT
mkdir -p "$W/bin"
cat > "$W/bin/curl" <<'STUB'
#!/bin/sh
# stub curl: response chosen by $SCEN/<key>, key = resolve IP (public) or host:port (direct)
hdr=""; key=""; url=""
while [ $# -gt 0 ]; do
  case "$1" in
    -D) hdr="$2"; shift ;;
    --resolve) key="${2##*:}"; shift ;;
    -w|--max-time|-A|-H) shift ;;
    -*) ;;
    *) url="$1" ;;
  esac; shift
done
[ -z "$key" ] && { key="${url#http://}"; key="${key%%/*}"; }
echo "$key $url" >> "$SCEN/calls"
f="$SCEN/$key"
[ -f "$f" ] || { printf '\n000'; exit 7; }
code="$(sed -n 1p "$f")"; up="$(sed -n 2p "$f")"; body="$(sed -n 3p "$f")"
[ "$code" = "000" ] && { printf '\n000'; exit 28; }
if [ -n "$hdr" ]; then
  { printf 'HTTP/2 %s\r\n' "$code"; printf 'content-type: application/json\r\n'
    [ "$up" != "-" ] && printf 'X-Ha-Upstream: %s\r\n' "$up"; printf '\r\n'; } > "$hdr"
fi
printf '%s\n%s' "$body" "$code"
STUB
chmod +x "$W/bin/curl"
printf '$TTL 300\n@ 300 IN SOA ns1 hostmaster @@SERIAL@@ 1 1 1 1\n;;APEX_A_RECORDS;;\n;;WWW_A_RECORDS;;\n' > "$W/tmpl"
export PATH="$W/bin:$PATH" SCEN="$W/run/scen"
fails=0
ok(){ echo "  ok   $*"; }
bad(){ echo "  FAIL $*"; fails=$((fails+1)); }
S1=72.61.156.49; S2=179.198.214.41
resp(){ printf '%s\n%s\n%s\n' "$2" "$3" "$4" > "$SCEN/$1"; }
good='{"success":true,"data":{}}'
apex(){ grep -E '^@[[:space:]]+[0-9]+[[:space:]]+IN[[:space:]]+A' $W/run/zones/z | awk '{print $NF}' | sort | tr '\n' ' '; }
setup(){ # setup <self_ip> [extra env assignments...]
  rm -rf "$W/run"; mkdir -p $W/run/zones $W/run/state "$SCEN"; : > "$SCEN/calls"
  export NODES="s1=$S1 s2=$S2" HEALTH_PATH=/api/en-US/credits HEALTH_EXPECT='"success":true' \
    ZONE_FILE=$W/run/zones/z ZONE_TMPL=$W/tmpl STATE_DIR=$W/run/state CHECK_INTERVAL=0 \
    SERVED_BY="s1=next-vibe-app:3000 s2=unbottled-app:3000" \
    DIRECT_URLS="s1=http://10.88.0.1:3000 s2=http://10.88.0.2:3100" DIRECT_SCOPE=self \
    SELF_IP="$1" SELF_NODE="" HA_DNS_HEALTH_LIB=1 PROBE_COOKIE_FILE=""
  shift; for a in "$@"; do export "$a"; done
  . $T/ha-dns-health.sh
  for n in $(node_names); do join "$n"; done
  # healthy baseline
  resp $S1 200 next-vibe-app:3000 "$good"; resp $S2 200 unbottled-app:3000 "$good"
  resp 10.88.0.1:3000 200 - "$good"; resp 10.88.0.2:3100 200 - "$good"
}
sweeps(){ i=0; while [ $i -lt $1 ]; do sweep >>$W/run/log 2>&1; i=$((i+1)); done; }
expect(){ got="$(apex)"; [ "$got" = "$2" ] && ok "$1 -> [$got]" || bad "$1: want [$2] got [$got]"; }

echo "== A: S2 daemon (self=s2), both healthy"
setup $S2; sweeps 2; expect "baseline" "$S2 $S1 "
grep -q "^10.88.0.2:3100 " $SCEN/calls && ok "direct probe for self (s2)" || bad "no direct probe for s2"
grep -q "^10.88.0.1:3000 " $SCEN/calls && bad "direct probe hit peer s1 with scope=self" || ok "no direct probe of peer"

echo "== B: 2026-11-17 incident: S2 app dead, S2 Caddy falls back to S1 (public 200, served by 10.88.0.1:3000)"
resp $S2 200 10.88.0.1:3000 "$good"; resp 10.88.0.2:3100 000 - ""
sweeps 1; expect "after 1 fail (hysteresis keeps it)" "$S2 $S1 "
sweeps 1; expect "after 2 fails S2 removed" "$S1 "
grep -q "served by '10.88.0.1:3000'" $W/run/log && ok "reason logged" || bad "reason not logged"
[ "$(grep -c 'node s2 probe failing' $W/run/log)" = 1 ] && ok "reason logged once" || bad "reason logged $(grep -c 'node s2 probe failing' $W/run/log)x"
echo "   recovery:"
resp $S2 200 unbottled-app:3000 "$good"; resp 10.88.0.2:3100 200 - "$good"
sweeps 1; expect "1 pass not enough" "$S1 "
sweeps 1; expect "2 passes restore" "$S2 $S1 "
grep -q "node s2 probe passing again" $W/run/log && ok "recovery logged" || bad "no recovery log"

echo "== C: same incident seen from S1's daemon (self=s1, no direct probe of s2)"
setup $S1; sweeps 1
resp $S2 200 10.88.0.1:3000 "$good"
sweeps 2; expect "S1 drops S2 on header alone" "$S1 "

echo "== D: header missing (Caddy not updated) = fail"
setup $S1; resp $S1 200 - "$good"; sweeps 2; expect "S1 without header dropped" "$S2 "
grep -q "<no X-HA-Upstream header>" $W/run/log && ok "missing header reason" || bad "missing header reason"

echo "== E: S2 public path ok + own header, but direct app probe fails (self=s2)"
setup $S2; resp 10.88.0.2:3100 503 - "oops"; sweeps 2; expect "S2 dropped via direct" "$S1 "
grep -q "direct http://10.88.0.2:3100 http 503" $W/run/log && ok "direct reason logged" || bad "direct reason"

echo "== F: WG down from S2's view: direct to s1 fails, but scope=self ignores it"
setup $S2; resp 10.88.0.1:3000 000 - ""; sweeps 3; expect "S1 kept" "$S2 $S1 "
echo "   scope=all would drop it:"
setup $S2 DIRECT_SCOPE=all; resp 10.88.0.1:3000 000 - ""; sweeps 2; expect "S1 dropped (scope=all)" "$S2 "

echo "== G: drain file still wins, both fail -> never-dark"
setup $S1; touch $W/run/zones/drain.s2; sweeps 1; expect "drain.s2" "$S1 "
rm $W/run/zones/drain.s2; sweeps 2; expect "undrained after rise" "$S2 $S1 "
resp $S1 000 - ""; resp $S2 200 10.88.0.1:3000 "$good"; sweeps 2; expect "never-dark" "$S2 $S1 "

touch "$W/run/zones/drain.s2"; sweeps 1; expect "never-dark respects a drained node" "$S1 "
APEX_TTL=10; sweeps 1
awk '$1=="@" && $3=="IN" && $4=="A" && $2==10 {found=1} END{exit !found}' "$ZONE_FILE" && ok "TTL-only update" || bad "TTL unchanged"

echo "== H: body / code checks unchanged"
setup $S1; resp $S2 200 unbottled-app:3000 '{"success":false}'; sweeps 2; expect "bad body" "$S1 "
setup $S1; resp $S2 502 unbottled-app:3000 "$good"; sweeps 2; expect "502" "$S1 "

echo "== I: SERVED_BY empty = old behaviour (fallback passes)"
setup $S1 SERVED_BY= DIRECT_SCOPE=off; resp $S2 200 10.88.0.1:3000 "$good"; sweeps 2; expect "legacy" "$S2 $S1 "

echo "== J: multiple accepted upstreams, header case-insensitive"
setup $S1 "SERVED_BY=s1=next-vibe-app:3000,next-vibe-app-2:3000 s2=unbottled-app:3000"; resp $S1 200 next-vibe-app-2:3000 "$good"; sweeps 2; expect "alt upstream ok" "$S2 $S1 "

echo "== K: SELF_NODE explicit overrides SELF_IP"
setup "" SELF_NODE=s1; resp 10.88.0.1:3000 000 - ""; sweeps 2; expect "self=s1 direct fail" "$S2 "

echo; [ $fails = 0 ] && echo "ALL PASSED" || { echo "$fails FAILED"; exit 1; }

#!/bin/bash
set -euo pipefail
# ============================================================================
# Postgres logical replication setup: Server 1 (publisher) → Server 2 (subscriber)
#
# Run from a workstation that can SSH to BOTH servers (reads SSH_SERVER* from
# the repo .env). Idempotent. Split into stages so the one disruptive step
# (wal_level restart on the primary) is explicit and runbook-gated.
#
# Stages (pass as $1, default: all non-disruptive ones):
#   primary-role    create unbottled_repl role + publication on Server 1 (safe)
#   schema-sync     pg_dump --schema-only Server1 → load into Server2 unbottled DB (safe)
#   subscribe       create unbottled DB + CREATE SUBSCRIPTION on Server 2 (safe; needs
#                   wal_level=logical ALREADY active on Server 1)
#   verify          print replication status on both ends
#   check-wal       report Server 1 wal_level (does NOT change it)
#
# The wal_level=logical flip + restart is NOT performed here — see runbook.
# ============================================================================

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO/.env}"

# Private (WireGuard) address of the primary — replication connects here.
PRIMARY_WG="${PRIMARY_WG:-10.88.0.1}"
REPL_PASSWORD="${REPL_PASSWORD:?set REPL_PASSWORD (the unbottled_repl role password)}"
PRIMARY_DB="${PRIMARY_DB:-postgres}"
PRIMARY_PGUSER="${PRIMARY_PGUSER:-postgres}"
REPLICA_DB="${REPLICA_DB:-unbottled}"
SHARED_PG_CONTAINER="${SHARED_PG_CONTAINER:-prod-postgres}"
PRIMARY_PG_CONTAINER="${PRIMARY_PG_CONTAINER:-prod-postgres}"

# --- credential loading (quoted .env values) ------------------------------
getenv() { python3 - "$1" "$ENV_FILE" <<'PY'
import re,sys
k,f=sys.argv[1],sys.argv[2]
m=re.search(r'^'+re.escape(k)+r'=(.*)$',open(f).read(),re.M)
v=m.group(1).strip() if m else ''
if len(v)>=2 and v[0]==v[-1] and v[0] in '"\'': v=v[1:-1]
print(v)
PY
}
S1="$(getenv SSH_SERVER)";  S1_PWD="$(getenv SSH_SERVER_PWD)"
S2="$(getenv SSH_SERVER2)"; S2_PWD="$(getenv SSH_SERVER2_PWD)"
s1() { sshpass -p "$S1_PWD" ssh -o StrictHostKeyChecking=accept-new "$S1" "$@"; }
s2() { sshpass -p "$S2_PWD" ssh -o StrictHostKeyChecking=accept-new "$S2" "$@"; }
# psql on the primary / shared container
p1() { s1 "docker exec -i $PRIMARY_PG_CONTAINER psql -v ON_ERROR_STOP=1 -U $PRIMARY_PGUSER $*"; }
p2() { s2 "docker exec -i $SHARED_PG_CONTAINER psql -v ON_ERROR_STOP=1 -U postgres $*"; }

stage="${1:-default}"

check_wal() {
  echo "== Server 1 wal_level =="
  p1 "-d $PRIMARY_DB -tc 'SHOW wal_level;'"
}

primary_role() {
  echo "== Server 1: role + publication =="
  # Pass the password via a session GUC so it never lands in shell history/logs.
  p1 "-d $PRIMARY_DB" <<SQL
SET unbottled.repl_password = '$REPL_PASSWORD';
$(cat "$HERE/01-primary-setup.sql")
SQL
  # pg_hba: allow the repl role from the WG subnet (idempotent append).
  s1 "docker exec $PRIMARY_PG_CONTAINER sh -c '
    HBA=\$(psql -U $PRIMARY_PGUSER -tAc \"SHOW hba_file;\" -d $PRIMARY_DB);
    grep -q \"unbottled_repl\" \"\$HBA\" || printf \"host all unbottled_repl 10.88.0.0/24 scram-sha-256\\nhost replication unbottled_repl 10.88.0.0/24 scram-sha-256\\n\" >> \"\$HBA\";
    psql -U $PRIMARY_PGUSER -d $PRIMARY_DB -c \"SELECT pg_reload_conf();\" '"
  echo "   publication + role ready; pg_hba reloaded."
}

schema_sync() {
  echo "== schema-only dump Server1 → Server2 ($REPLICA_DB) =="
  s2 "docker exec $SHARED_PG_CONTAINER psql -U postgres -tc \"SELECT 1 FROM pg_database WHERE datname='$REPLICA_DB'\" | grep -q 1 || docker exec $SHARED_PG_CONTAINER psql -U postgres -c 'CREATE DATABASE $REPLICA_DB'"
  # Stream the schema dump directly over SSH→SSH (no intermediate file on disk).
  s1 "docker exec $PRIMARY_PG_CONTAINER pg_dump -U $PRIMARY_PGUSER -d $PRIMARY_DB --schema-only --no-owner --no-privileges" \
    | s2 "docker exec -i $SHARED_PG_CONTAINER psql -v ON_ERROR_STOP=1 -U postgres -d $REPLICA_DB"
  echo "   schema loaded into Server2 $REPLICA_DB."
}

subscribe() {
  echo "== Server 2: create subscription =="
  local wl; wl="$(p1 "-d $PRIMARY_DB -tAc 'SHOW wal_level;'" | tr -d '[:space:]')"
  if [ "$wl" != "logical" ]; then
    echo "ABORT: Server 1 wal_level is '$wl', must be 'logical' first (runbook restart step)." >&2
    exit 2
  fi
  p2 "-d $REPLICA_DB" <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_subscription WHERE subname='unbottled_sub') THEN
    EXECUTE format(
      'CREATE SUBSCRIPTION unbottled_sub CONNECTION %L PUBLICATION unbottled_pub '
      || 'WITH (copy_data=true, create_slot=true, slot_name=%L, streaming=on, synchronous_commit=off)',
      'host=$PRIMARY_WG port=5432 dbname=$PRIMARY_DB user=unbottled_repl password=$REPL_PASSWORD sslmode=disable',
      'unbottled_sub_slot');
  END IF;
END \$\$;
SQL
  echo "   subscription created; initial copy running (watch: verify)."
}

verify() {
  echo "== Server 1 publication/slots =="
  p1 "-d $PRIMARY_DB -c 'SELECT pubname FROM pg_publication;'"
  p1 "-d $PRIMARY_DB -c 'SELECT slot_name, active, restart_lsn FROM pg_replication_slots;'"
  echo "== Server 2 subscription state ('r'=ready) =="
  p2 "-d $REPLICA_DB -c 'SELECT subname, subenabled FROM pg_subscription;'"
  p2 "-d $REPLICA_DB -c 'SELECT srsubstate, count(*) FROM pg_subscription_rel GROUP BY 1;'"
  p2 "-d $REPLICA_DB -c 'SELECT * FROM pg_stat_subscription;'"
}

case "$stage" in
  check-wal)    check_wal ;;
  primary-role) primary_role ;;
  schema-sync)  schema_sync ;;
  subscribe)    subscribe ;;
  verify)       verify ;;
  default)      check_wal; primary_role; schema_sync;
                echo "NEXT: ensure Server1 wal_level=logical (restart), then: $0 subscribe && $0 verify" ;;
  *) echo "unknown stage: $stage" >&2; exit 1 ;;
esac

#!/bin/bash
# Disposable synthetic writer/standby to time unexpected writer loss while the
# real S1 is powered off AFTER handing production writes to S2. No host ports,
# production volumes, credentials, external services, or production records.
set -euo pipefail
primary=q104-pg-writer
standby=q104-pg-standby
network=q104-isolated
label=ai.unbottled.q104
data=/var/lib/postgresql/data/q104
event() { date -u "+%FT%T.%3NZ $*"; }
owned() { [ "$(docker inspect -f '{{index .Config.Labels "ai.unbottled.q104"}}' "$1")" = fixture ]; }
sql() { docker exec -u postgres "$1" psql -X -v ON_ERROR_STOP=1 -U postgres -Atqc "$2"; }
wait_sql() {
  local i
  for i in {1..60}; do
    if [ "$(sql "$1" "$2" 2>/dev/null)" = "$3" ]; then return 0; fi
    sleep 1
  done
  return 1
}
mode="${1:-help}"
case "$mode" in
prepare|crash|promote)
  stamp="$(date -u +%Y-%m-%dT%H:%M)"
  earliest=2026-11-26T03:00
  [ "$mode" != prepare ] || earliest=2026-11-26T02:45
  if [[ "$stamp" < "$earliest" || ! "$stamp" < "2026-11-26T03:45" ]]; then
    echo "outside approved Q104 window"; exit 3
  fi
  ;;
esac
case "$mode" in
prepare)
  image="${2:?supply a locally loaded PostgreSQL 16 image ID}"
  [[ "$image" =~ ^sha256:[a-f0-9]{64}$ ]]
  [ "$(docker image inspect -f '{{.Id}}' "$image")" = "$image" ]
  # Refuse every collision, including data or a network left by an older run.
  for name in "$primary" "$standby"; do
    if docker container inspect "$name" >/dev/null 2>&1 || docker volume inspect "$name" >/dev/null 2>&1; then
      echo "preserve existing fixture $name"; exit 1
    fi
  done
  if docker network inspect "$network" >/dev/null 2>&1; then echo "preserve existing fixture network"; exit 1; fi
  docker network create --internal --label "$label=fixture" "$network" >/dev/null
  for name in "$primary" "$standby"; do docker volume create --label "$label=fixture" "$name" >/dev/null; done
  args=(--detach --user postgres --restart=no --pull=never --network "$network" --label "$label=fixture" --cpus=.5 --memory=256m -e PGDATA="$data")
  docker run "${args[@]}" --name "$primary" -v "$primary:/var/lib/postgresql/data" --entrypoint sh "$image" -ec '
    postgres --version | grep -q " 16\."
    initdb -D "$PGDATA" --no-locale --auth-local=trust --auth-host=scram-sha-256 >/dev/null
    printf "%s\n" "host replication postgres 0.0.0.0/0 trust" >> "$PGDATA/pg_hba.conf"
    exec postgres -D "$PGDATA" -c listen_addresses="*" -c shared_buffers=16MB' >/dev/null
  wait_sql "$primary" 'select pg_is_in_recovery()' f
  sql "$primary" "create table q104_events(id integer primary key); insert into q104_events values (1)"
  docker run "${args[@]}" --name "$standby" -v "$standby:/var/lib/postgresql/data" --entrypoint sh "$image" -ec '
    pg_basebackup -h q104-pg-writer -U postgres -D "$PGDATA" -R -X stream
    exec postgres -D "$PGDATA" -c shared_buffers=16MB' >/dev/null
  wait_sql "$standby" 'select pg_is_in_recovery() and exists(select from q104_events where id=1)' t
  event "synthetic streaming pair ready"
  ;;
crash)
  owned "$primary" && owned "$standby" || exit 1
  [ "$(sql "$standby" 'select pg_is_in_recovery()')" = t ]
  sql "$primary" "insert into q104_events values (2)"
  event "synthetic last write ACK id=2"
  docker kill --signal KILL "$primary" >/dev/null
  event "synthetic writer confirmed stopped"
  ;;
promote)
  owned "$standby" && owned "$primary" || exit 1
  [ "$(docker inspect -f '{{.State.Status}}' "$primary")" = exited ]
  /usr/local/sbin/ha-failover q104-promote-fixture
  sql "$standby" "insert into q104_events values (3)"
  event "synthetic first readback after promotion ids=$(sql "$standby" 'select string_agg(id::text, chr(44) order by id) from q104_events')"
  ;;
retire)
  for name in "$primary" "$standby"; do owned "$name" && docker stop "$name" >/dev/null; done
  event "retired both synthetic containers; labeled volumes retained for inspection"
  ;;
*) echo "usage: $0 prepare <image-id> | crash | promote | retire"; exit 2 ;;
esac

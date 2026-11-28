#!/bin/bash
# Pre-deploy guard: the shared prod Postgres must be running a REAL postgres
# image, and the image its compose service resolves to must be that same
# image. Otherwise any compose command that touches the service (a
# `compose run` of the app without --no-deps, an `up` of a dependent service)
# recreates prod-postgres onto the wrong image and takes the database down.
#
# Incident 2026-11-28: install-docker.sh resolved the app image with
# `compose config --images app | head -1`. Compose prints the app's
# depends_on images too, in random order, so the failed-deploy rollback ran
# `docker tag <previous app image> unbottled-postgres` (2026-11-27 ~22:19
# UTC). The next deploy's `compose run --rm app migrate` saw the postgres
# service image drift and recreated prod-postgres on the app image.
#
# Read-only: inspects containers/images and runs `pg_isready` inside the
# running container. Never builds, pulls, stops or recreates anything.
# Run from the compose project dir (e.g. /unbottled). Exit 0 = safe.
# Usage: bash scripts/pg-image-guard.sh   (PG_CONTAINER_NAME overrides prod-postgres)
set -u

C="${PG_CONTAINER_NAME:-prod-postgres}"
fail() { echo "PG GUARD: $*" >&2; exit 1; }

is_pg_image() {
  docker image inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$1" 2>/dev/null | grep -q '^PGDATA='
}

[ "$(docker inspect -f '{{.State.Running}}' "$C" 2>/dev/null)" = "true" ] \
  || fail "$C is not running. A deploy would build/start it. Start it deliberately first."

running_img="$(docker inspect -f '{{.Image}}' "$C")"
is_pg_image "$running_img" \
  || fail "$C runs image ${running_img:7:12}, which is NOT a postgres image (no PGDATA). Restore a postgres image (e.g. unbottled-postgres:prod-s1) before deploying."
docker exec "$C" pg_isready -q -U "${POSTGRES_USER:-postgres}" \
  || fail "pg_isready failed inside $C."

# Resolve the service image exactly as compose would, from the files and
# project the running container was created with.
cfg_files="$(docker inspect -f '{{index .Config.Labels "com.docker.compose.project.config_files"}}' "$C")"
project="$(docker inspect -f '{{index .Config.Labels "com.docker.compose.project"}}' "$C")"
service="$(docker inspect -f '{{index .Config.Labels "com.docker.compose.service"}}' "$C")"
want_hash="$(docker inspect -f '{{index .Config.Labels "com.docker.compose.config-hash"}}' "$C")"
[ -n "$cfg_files" ] && [ -n "$project" ] && [ -n "$service" ] \
  || fail "$C has no compose labels; cannot verify its service image."

compose_args=(-p "$project")
IFS=',' read -ra files <<< "$cfg_files"
for f in "${files[@]}"; do compose_args+=(-f "$f"); done

service_ref="$(docker compose "${compose_args[@]}" config --format json 2>/dev/null \
  | python3 -c '
import json, sys
d = json.load(sys.stdin)
s = d.get("services", {}).get(sys.argv[1], {})
print(s.get("image") or "{}-{}".format(d.get("name", ""), sys.argv[1]))
' "$service")" || fail "could not render the compose config."
[ -n "$service_ref" ] || fail "could not resolve the $service service image."

service_img="$(docker image inspect -f '{{.Id}}' "$service_ref" 2>/dev/null)" \
  || fail "service image $service_ref is missing: compose would BUILD postgres on the next dependent command."
is_pg_image "$service_img" \
  || fail "service image $service_ref (${service_img:7:12}) is NOT a postgres image. Re-tag it: docker tag unbottled-postgres:prod-s1 $service_ref"
[ "$service_img" = "$running_img" ] \
  || fail "service image $service_ref (${service_img:7:12}) differs from what $C runs (${running_img:7:12}): compose would recreate $C."

have_hash="$(docker compose "${compose_args[@]}" config --hash "$service" 2>/dev/null | awk '{print $2}')"
[ -n "$want_hash" ] && [ "$have_hash" = "$want_hash" ] \
  || fail "compose config for $service changed since $C was created (hash ${want_hash:0:12} -> ${have_hash:0:12}): compose would recreate $C."

echo "PG GUARD: OK ($C on $service_ref ${running_img:7:12}, config unchanged)"

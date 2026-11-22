#!/bin/bash
# Build, verify and optionally publish the self-hosted pod image from a commit.
#
#   scripts/pikapods/release.sh [--ref <git-ref>] [--image <loaded-image>] [--push]
#
# Default: builds the committed state of --ref (default HEAD) with Dockerfile.pikapods,
# checks size, port and volume, runs smoke.sh against a throwaway PostgreSQL 16
# container on its own network, then removes every container, network, volume and
# local image it created. Uncommitted files never reach the image.
# --image skips the build and verifies an image that is already loaded.
# --push publishes ghcr.io/techfreaque/next-vibe-pod:<vX.Y.Z> (the ref must be a
# stable vX.Y.Z tag) and moves :latest when it is the highest stable tag. Publishing
# is normally done by .github/workflows/pikapods-image.yml; use --push only when
# a release is approved and CI is unavailable.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

ref=HEAD
image=""
push=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref) ref=$2; shift 2 ;;
    --image) image=$2; shift 2 ;;
    --push) push=true; shift ;;
    *) echo "Unknown option $1" >&2; exit 2 ;;
  esac
done

repo=${POD_IMAGE_REPO:-ghcr.io/techfreaque/next-vibe-pod}
max_bytes=${POD_IMAGE_MAX_BYTES:-3221225472}
sha=$(git rev-parse --verify "$ref^{commit}")
version=$(git describe --tags --exact-match "$sha" 2>/dev/null | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' || true)
if $push && [[ -z $version ]]; then
  echo "--push needs a ref that is exactly a stable vX.Y.Z tag" >&2
  exit 1
fi

# Never compete with a production deploy build for memory.
lock=scratchpad/DEPLOY_RUNNING
# An empty lock file or a dead PID is stale.
if [[ -z $image && -s $lock ]] && kill -0 "$(cat "$lock")" 2>/dev/null; then
  echo "A deploy is running ($lock). Retry when it has finished." >&2
  exit 1
fi

suffix="$RANDOM-$$"
net="pod-release-$suffix"
pg="pod-release-pg-$suffix"
built=""
ctx=""
cleanup() {
  docker rm -f "$pg" > /dev/null 2>&1 || true
  docker network rm "$net" > /dev/null 2>&1 || true
  if [[ -n $built ]]; then
    docker image rm "$built" "$repo:latest" > /dev/null 2>&1 || true
  fi
  if [[ -n $ctx && -d $ctx ]]; then rm -rf "$ctx"; fi
}
trap cleanup EXIT

if [[ -z $image ]]; then
  image="$repo:${version:-${sha:0:10}}"
  # Large build contexts stay on disk, never in a RAM-backed /tmp.
  ctx="${POD_BUILD_DIR:-$HOME/.cache/next-vibe-pod-build}/ctx-$sha"
  mkdir -p "$ctx"
  git archive "$sha" | tar -x -C "$ctx"
  builder=()
  # The dedicated image-push builder is memory-capped; prefer it when present.
  if docker buildx inspect "${POD_BUILDER:-vibe-image-build}" > /dev/null 2>&1; then
    builder=(--builder "${POD_BUILDER:-vibe-image-build}")
  fi
  built=$image
  docker buildx build "${builder[@]}" --platform linux/amd64 --load -t "$image" -f "$ctx/Dockerfile.pikapods" \
    --label "org.opencontainers.image.source=https://github.com/techfreaque/next-vibe" \
    --label "org.opencontainers.image.revision=$sha" \
    --label "org.opencontainers.image.version=${version:-${sha:0:10}}" "$ctx"
fi

bytes=$(docker image inspect -f '{{.Size}}' "$image")
echo "== image $image: $bytes bytes ($((bytes / 1048576)) MiB)"
test "$bytes" -lt "$max_bytes"
test "$(docker image inspect -f '{{json .Config.ExposedPorts}}' "$image")" = '{"3000/tcp":{}}'
test "$(docker image inspect -f '{{json .Config.Volumes}}' "$image")" = '{"/data":{}}'

docker network create "$net" > /dev/null
docker run -d --name "$pg" --network "$net" -e POSTGRES_PASSWORD=pod-release-only postgres:16-alpine > /dev/null
for _ in {1..60}; do docker exec "$pg" pg_isready -U postgres > /dev/null 2>&1 && break; sleep 1; done
sleep 2
# The pod gets an ordinary role that owns its database, like a managed host.
docker exec -i "$pg" psql -U postgres -v ON_ERROR_STOP=1 > /dev/null <<'SQL'
CREATE ROLE pod_owner LOGIN PASSWORD 'pod-owner-release-only';
CREATE DATABASE pod OWNER pod_owner;
SQL
IMAGE="$image" POD_NETWORK="$net" DATABASE_URL="postgres://pod_owner:pod-owner-release-only@$pg:5432/pod" \
  bash scripts/pikapods/smoke.sh

if $push; then
  if [[ $image != "$repo:$version" ]]; then
    docker tag "$image" "$repo:$version"
    image="$repo:$version"
    built=${built:-$image}
  fi
  docker push "$image"
  highest=$(git tag -l 'v[0-9]*.[0-9]*.[0-9]*' --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -1)
  if [[ $highest == "$version" ]]; then
    docker tag "$image" "$repo:latest"
    docker push "$repo:latest"
  fi
  echo "== published $image"
fi

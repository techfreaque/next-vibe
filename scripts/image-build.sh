#!/usr/bin/env bash
# Run the image solve on a memory-limited BuildKit daemon. The Docker CLI
# alone has no compiler children: dockerd starts them in another PID tree.
set -euo pipefail
builder=$1
limit_gb=$2
shift 2
[[ $limit_gb =~ ^[1-9][0-9]{0,6}$ ]] || { echo 'Invalid build memory limit (GB)' >&2; exit 1; }
# cgroup v2 exposes page-aligned limits. Whole MiB works on 4K and 64K kernels.
limit_bytes=$((limit_gb * 1000000000 / 1048576 * 1048576))
container=buildx_buildkit_${builder}0

if ! docker buildx inspect "$builder" >/dev/null 2>&1; then
  docker buildx create --name "$builder" --driver docker-container \
    --driver-opt "memory=$limit_bytes,memory-swap=$limit_bytes,network=host" >/dev/null ||
    docker buildx inspect "$builder" >/dev/null
fi
docker buildx inspect --bootstrap "$builder" >/dev/null
# Serialize solves on this builder, including callers from other checkouts.
# Closing the caller's pipe releases flock even if the CLI is interrupted.
coproc LEASE { docker exec -i "$container" flock -n /tmp/vibe-image-build.lock sh -c 'echo locked; cat >/dev/null'; }
if ! read -r lock_reply <&"${LEASE[0]}" || [[ $lock_reply != locked ]]; then
  echo 'Image build lock unavailable. Another image build may be running.' >&2
  exit 1
fi
limits=$(docker inspect -f '{{.HostConfig.Memory}} {{.HostConfig.MemorySwap}}' "$container")
if [[ $limits != "$limit_bytes $limit_bytes" ]]; then
  docker update --memory "$limit_bytes" --memory-swap "$limit_bytes" "$container" >/dev/null
fi

# This shell runs INSIDE BuildKit's PID namespace, which also contains its
# nested RUN namespaces. The kernel enforces the cgroup limit between samples.
sample() {
  docker exec "$container" sh -ec '
    if [ -r /sys/fs/cgroup/memory.max ]; then
      read -r limit < /sys/fs/cgroup/memory.max
      read -r swap < /sys/fs/cgroup/memory.swap.max
      [ "$swap" = 0 ] || exit 1
      events=/sys/fs/cgroup/memory.events
    else
      read -r limit < /sys/fs/cgroup/memory/memory.limit_in_bytes
      read -r combined < /sys/fs/cgroup/memory/memory.memsw.limit_in_bytes
      [ "$combined" = "$limit" ] || exit 1
      events=/sys/fs/cgroup/memory/memory.oom_control
    fi
    [ "$limit" = "$1" ] || exit 1
    rss=0
    for status in /proc/[0-9]*/status; do
      [ -r "$status" ] || continue
      while read -r key value rest; do
        if [ "$key" = VmRSS: ]; then rss=$((rss + value)); break; fi
      done < "$status" 2>/dev/null || :
    done
    oom=$(awk '\''$1 == "oom_kill" {print $2}'\'' "$events")
    echo "$rss ${oom:?}"
  ' sh "$limit_bytes"
}
if ! read -r peak initial_oom < <(sample); then
  echo "Cannot verify the $limit_gb GB cgroup limit or read BuildKit RSS." >&2
  exit 1
fi
# Docker invokes buildx as a CLI plugin. Give both processes the same job
# group so cancellation also closes the BuildKit solve session.
set -m
docker buildx build --builder "$builder" --allow network.host "$@" </dev/null &
build_pid=$!
set +m
cancel() {
  kill -TERM -- "-$build_pid" 2>/dev/null || :
  for attempt in 1 2 3 4 5; do
    kill -0 -- "-$build_pid" 2>/dev/null || break
    sleep 1
  done
  kill -KILL -- "-$build_pid" 2>/dev/null || :
  wait "$build_pid" 2>/dev/null || :
}
trap 'cancel; exit 130' INT TERM HUP
result=0
while kill -0 "$build_pid" 2>/dev/null; do
  sleep 1 &
  tick=$!
  if ! read -r rss oom < <(sample); then
    echo "BuildKit memory monitor stopped (limit $limit_gb GB). Cancelling build." >&2
    cancel; result=1; break
  fi
  # The caller, Docker CLI and buildx exporter live outside the builder cgroup.
  # Include their RSS in both the reported total and the cancellation threshold.
  if ! client_rss=$(ps -A -o pid=,ppid=,rss= | awk -v root="$$" -v caller="$PPID" '
    { parent[$1] = $2; rss[$1] = $3 }
    END {
      for (pid in rss) {
        p = pid
        while (p && p != root && p in parent && p != parent[p]) p = parent[p]
        if (p == root || pid == caller) total += rss[pid]
      }
      print total + 0
    }
  '); then
    echo "Cannot read the image-push process tree. Cancelling build." >&2
    cancel; result=1; break
  fi
  rss=$((rss + client_rss))
  if ((rss > peak)); then peak=$rss; fi
  if [[ ${VIBE_BUILD_RSS_SAMPLES:-0} == 1 ]]; then
    echo "Image build RSS $(date +%s) $rss KiB" >&2
  fi
  if ((rss * 1024 > limit_bytes || oom > initial_oom)); then
    echo "Build exceeded the $limit_gb GB memory ceiling. Cancelling build." >&2
    cancel; result=42; break
  fi
  wait "$tick"
done
if ((result == 0)); then wait "$build_pid" || result=$?; fi
trap - INT TERM HUP
# A fast kernel OOM can finish the solve between the last poll and wait.
if read -r rss oom < <(sample); then
  if ((oom > initial_oom)); then result=42; fi
elif [[ $(docker inspect -f '{{.State.OOMKilled}}' "$container") == true ]]; then
  result=42
fi
echo "Image build peak RSS: $peak KiB (ceiling $limit_gb GB)" >&2
exit "$result"

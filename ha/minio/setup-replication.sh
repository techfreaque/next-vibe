#!/bin/bash
set -euo pipefail
# ============================================================================
# MinIO two-way bucket replication: Server 1 chat-media ⇄ Server 2 chat-media
# over WireGuard. Idempotent. Run from a workstation with SSH to both nodes.
#
# Prereq: both MinIO instances up and bound to their WG IP
# (ha/minio/minio-wg.override.yml), bucket `chat-media` exists (minio-init).
# ============================================================================
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO/.env}"
BUCKET="${S3_BUCKET:-chat-media}"
MC_IMAGE="${MC_IMAGE:-cgr.dev/chainguard/minio:latest}"
SRV1_WG="${SRV1_WG:-10.88.0.1}"
SRV2_WG="${SRV2_WG:-10.88.0.2}"

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
MUSER="$(getenv MINIO_ROOT_USER)"; MUSER="${MUSER:-minioadmin}"
MPASS="$(getenv MINIO_ROOT_PASSWORD)"; MPASS="${MPASS:-minioadmin}"
s1() { sshpass -p "$S1_PWD" ssh -o StrictHostKeyChecking=accept-new "$S1" "$@"; }

# Run a throwaway mc container ON SERVER 1 (it can reach both WG endpoints).
# It configures aliases to both sites, enables versioning, and adds the two
# replication rules.
s1 "docker run --rm --network host \
  -e MUSER='$MUSER' -e MPASS='$MPASS' -e BUCKET='$BUCKET' \
  -e SRV1='http://$SRV1_WG:9000' -e SRV2='http://$SRV2_WG:9000' \
  --entrypoint /bin/sh '$MC_IMAGE' -c '
    set -e
    mc alias set s1 \$SRV1 \$MUSER \$MPASS
    mc alias set s2 \$SRV2 \$MUSER \$MPASS
    # Replication requires versioning on both buckets.
    mc version enable s1/\$BUCKET
    mc version enable s2/\$BUCKET
    # Two-way bucket replication (idempotent: add fails if the rule exists → ignore).
    mc replicate add s1/\$BUCKET --remote-bucket http://\$MUSER:\$MPASS@'$SRV2_WG':9000/\$BUCKET --priority 1 2>/dev/null || echo \"s1→s2 rule exists\"
    mc replicate add s2/\$BUCKET --remote-bucket http://\$MUSER:\$MPASS@'$SRV1_WG':9000/\$BUCKET --priority 1 2>/dev/null || echo \"s2→s1 rule exists\"
    echo \"--- s1 replication status ---\"; mc replicate status s1/\$BUCKET || true
    echo \"--- s2 replication status ---\"; mc replicate status s2/\$BUCKET || true
  '"
echo "MinIO two-way replication configured for bucket '$BUCKET'."

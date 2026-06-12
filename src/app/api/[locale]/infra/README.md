# Infra Module

Provision and manage a k3s Kubernetes cluster from tagged SSH connections. No external tooling required beyond SSH access to your servers.

## Prerequisites

1. **Tag your servers** in SSH connection settings (`vibe ssh-connections-patch`):
   - At least one server → `Cluster Role: control-plane`
   - Optional workers → `Cluster Role: worker`
   - Optional storage nodes → `Cluster Role: storage`

2. **Servers must be reachable** via the SSH credentials stored in those connections.

## Workflow

```
tag servers → cluster-init → cluster-status → (scale / deploy)
```

---

## Commands

### `vibe cluster-init`

Provisions k3s on all tagged servers. Idempotent — safe to re-run.

Installs in order: k3s → CloudNativePG (Postgres) → Redis Sentinel → MinIO → nginx-ingress + cert-manager

```bash
# Dry run first (no changes made)
vibe cluster-init \
  --clusterName="prod" \
  --domain="example.com" \
  --email="admin@example.com" \
  --dryRun=true

# Real init
vibe cluster-init \
  --clusterName="prod" \
  --domain="example.com" \
  --email="admin@example.com"
```

| Param          | Required | Default        | Description                        |
| -------------- | -------- | -------------- | ---------------------------------- |
| `clusterName`  | yes      | —              | Name used in kubeconfig and labels |
| `domain`       | yes      | —              | Base domain for ingress rules      |
| `email`        | yes      | —              | Let's Encrypt contact email        |
| `k3sVersion`   | no       | `v1.31.0+k3s1` | k3s release to install             |
| `dryRun`       | no       | `false`        | Preview only, no changes           |
| `skipDatabase` | no       | `false`        | Skip CloudNativePG                 |
| `skipRedis`    | no       | `false`        | Skip Redis Sentinel                |
| `skipStorage`  | no       | `false`        | Skip MinIO                         |
| `skipIngress`  | no       | `false`        | Skip nginx-ingress + cert-manager  |

Kubeconfig is written to `.pulumi/<clusterName>/kubeconfig.yaml`.

---

### `vibe cluster-status`

Check node health, component status, and pod counts.

```bash
vibe cluster-status
```

Returns: nodes (name, role, status, IP), components (postgres, redis, minio, ingress-nginx, cert-manager), pod counts by namespace.

---

### `vibe scale`

Scale a deployment. Set replicas to `0` to pause.

```bash
vibe scale --component=web --replicas=3
vibe scale --component=tasks --replicas=0   # pause
```

| Component | Deployment        |
| --------- | ----------------- |
| `web`     | `next-vibe-web`   |
| `tasks`   | `next-vibe-tasks` |
| `storage` | `minio-tenant`    |

---

### `vibe deploy` / `vibe deploy-preview`

Run Pulumi against the infra stack. Requires Pulumi CLI installed (`~/.pulumi/bin/pulumi` or `$PULUMI_BIN`).

```bash
vibe deploy-preview --stack=prod       # see what would change
vibe deploy --stack=prod               # apply changes
vibe deploy --stack=prod --skipPreview=true  # apply without preview
```

State is stored locally in `.pulumi/` (auto-added to `.gitignore`).

---

## Storage: MinIO distributed mode

- 1 storage node → standalone (1 server, 1 volume)
- 2+ storage nodes → distributed erasure coding (1 node can fail, data survives)
- Accessible at `http://minio.next-vibe.svc.cluster.local:9000` inside the cluster
- S3-compatible — use it as the default object store for backups, uploads, assets

Default credentials: `minioadmin` / `minioadmin123` — change via the `minio-env-config` secret.

---

## Postgres replicas

Replicas = `min(2, total node count)`. Single node → 1 instance. Two or more nodes → 2 instances with streaming replication via CloudNativePG.

---

## Aliases

| Command               | Aliases                         |
| --------------------- | ------------------------------- |
| `vibe cluster-init`   | `init-cluster`, `infra-init`    |
| `vibe cluster-status` | `infra-status`                  |
| `vibe scale`          | `scale-replicas`, `infra-scale` |
| `vibe deploy`         | `infra-deploy`, `push`          |
| `vibe deploy-preview` | `infra-preview`                 |

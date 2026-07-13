import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { kubectl } from "next-vibe/tooling/infra/shared/pulumi/k3s/scripts";

import type { ClientT } from "@/app/api/[locale]/ssh/client";
import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "@/app/api/[locale]/ssh/client";
import type { SshConnection } from "@/app/api/[locale]/ssh/db";

/**
 * Install Redis Sentinel via Bitnami Helm chart.
 * 1 master + 1 replica + 3 sentinel instances.
 */

const INSTALL_HELM = `
which helm || (curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash)
helm repo add bitnami https://charts.bitnami.com/bitnami --force-update
`.trim();

function buildRedisSentinelValues(): string {
  return `
architecture: replication
auth:
  enabled: false
sentinel:
  enabled: true
  masterSet: mymaster
  quorum: 2
master:
  count: 1
  persistence:
    enabled: true
    size: 2Gi
replica:
  replicaCount: 1
  persistence:
    enabled: true
    size: 2Gi
`.trim();
}

export async function installRedis(
  controlPlaneNode: SshConnection,
  t: ClientT,
): Promise<ResponseType<{ installed: boolean; message: string }>> {
  try {
    const creds = await getConnectionCredentials(
      controlPlaneNode.id,
      controlPlaneNode.userId,
      t,
    );
    if (!creds.success) {
      return fail({
        message: creds.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const clientResult = await openSshClient(creds.data, t);
    if (!clientResult.success) {
      return fail({
        message: clientResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const { client } = clientResult.data;

    // Install Helm if not present, add bitnami repo
    await sshExecCommand(client, INSTALL_HELM, 120000);

    // Ensure namespace
    await sshExecCommand(
      client,
      kubectl(
        `create namespace next-vibe --dry-run=client -o yaml | k3s kubectl apply -f -`,
      ),
      15000,
    );

    const values = buildRedisSentinelValues();
    const helmInstall = `
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
echo '${values.replace(/'/g, "'\\''")}' > /tmp/redis-values.yaml
helm upgrade --install redis bitnami/redis \
  --namespace next-vibe \
  --create-namespace \
  --values /tmp/redis-values.yaml \
  --wait \
  --timeout 5m
rm /tmp/redis-values.yaml
`.trim();

    const result = await sshExecCommand(client, helmInstall, 360000); // 6 min

    client.end();

    if (result.exitCode !== 0) {
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      installed: true,
      message: "Redis Sentinel installed (1 master + 1 replica + 3 sentinels)",
    });
  } catch (error) {
    void parseError(error);
    return fail({
      message: t("errors.sshConnectionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

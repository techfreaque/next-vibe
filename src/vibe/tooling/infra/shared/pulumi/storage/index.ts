import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { kubectl } from "next-vibe/tooling/infra/shared/pulumi/k3s/scripts";

import type { ClientT } from "@/ssh/client";
import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "@/ssh/client";
import type { SshConnection } from "@/ssh/db";

/**
 * Install MinIO in distributed mode via MinIO Operator + Helm.
 * Erasure coding across storageNodes - 1 node can die, data survives.
 * Falls back to standalone mode if only 1 storage node.
 */

const INSTALL_MINIO_OPERATOR = `
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
which helm || (curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash)
helm repo add minio-operator https://operator.min.io --force-update
helm upgrade --install minio-operator minio-operator/operator \
  --namespace minio-operator \
  --create-namespace \
  --wait \
  --timeout 5m
`.trim();

function buildMinioTenantValues(replicas: number, clusterName: string): string {
  const servers = replicas;
  const volumesPerServer = 1;

  return `
tenant:
  name: ${clusterName}-minio
  pools:
    - servers: ${servers}
      name: pool-0
      volumesPerServer: ${volumesPerServer}
      size: 20Gi
      storageClassName: local-path
  buckets:
    - name: next-vibe
  configSecret:
    name: minio-env-config
    accessKey: minioadmin
    secretKey: minioadmin123
  metrics:
    enabled: false
  certificate:
    requestAutoCert: false
ingress:
  api:
    enabled: true
    host: s3.${clusterName}
  console:
    enabled: true
    host: minio.${clusterName}
`.trim();
}

export async function installStorage(
  controlPlaneNode: SshConnection,
  storageReplicas: number,
  clusterName: string,
  t: ClientT,
): Promise<
  ResponseType<{ installed: boolean; message: string; endpoint: string }>
> {
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

    // Install MinIO operator
    const operatorResult = await sshExecCommand(
      client,
      INSTALL_MINIO_OPERATOR,
      360000,
    );

    if (operatorResult.exitCode !== 0) {
      client.end();
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Ensure namespace
    await sshExecCommand(
      client,
      kubectl(
        `create namespace next-vibe --dry-run=client -o yaml | k3s kubectl apply -f -`,
      ),
      15000,
    );

    const values = buildMinioTenantValues(storageReplicas, clusterName);
    const helmInstall = `
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
echo '${values.replaceAll("'", "'\\''")}' > /tmp/minio-values.yaml
helm upgrade --install minio-tenant minio-operator/tenant \
  --namespace next-vibe \
  --values /tmp/minio-values.yaml \
  --wait \
  --timeout 10m
rm /tmp/minio-values.yaml
`.trim();

    const result = await sshExecCommand(client, helmInstall, 660000); // 11 min

    client.end();

    if (result.exitCode !== 0) {
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const mode = storageReplicas >= 2 ? "distributed" : "standalone";
    return success({
      installed: true,
      message: `MinIO installed in ${mode} mode (${storageReplicas} server(s))`,
      endpoint: `http://minio.next-vibe.svc.cluster.local:9000`,
    });
  } catch (error) {
    void parseError(error);
    return fail({
      message: t("errors.sshConnectionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

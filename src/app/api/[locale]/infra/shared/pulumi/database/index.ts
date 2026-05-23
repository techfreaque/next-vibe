import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ClientT } from "@/app/api/[locale]/ssh/client";
import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "@/app/api/[locale]/ssh/client";
import type { SshConnection } from "@/app/api/[locale]/ssh/db";

import { kubectl } from "../k3s/scripts";

const CNPG_OPERATOR_URL =
  "https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.22/releases/cnpg-1.22.0.yaml";

function buildPostgresClusterManifest(
  clusterName: string,
  replicas: number,
): string {
  return `
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: ${clusterName}-postgres
  namespace: next-vibe
spec:
  instances: ${replicas}
  imageName: ghcr.io/cloudnative-pg/postgresql:16
  storage:
    size: 10Gi
  postgresql:
    parameters:
      max_connections: "200"
      shared_buffers: "256MB"
  monitoring:
    enablePodMonitor: false
  backup:
    retentionPolicy: "7d"
  nodeMaintenanceWindow:
    inProgress: false
    reusePVC: true
`.trim();
}

export async function installDatabase(
  controlPlaneNode: SshConnection,
  clusterName: string,
  postgresReplicas: number,
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

    // Install CloudNativePG operator
    const operatorResult = await sshExecCommand(
      client,
      kubectl(`apply --server-side -f ${CNPG_OPERATOR_URL}`),
      120000,
    );

    if (operatorResult.exitCode !== 0) {
      client.end();
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Wait for operator to be ready
    await sshExecCommand(
      client,
      kubectl(
        "rollout status deployment/cnpg-controller-manager -n cnpg-system --timeout=120s",
      ),
      130000,
    );

    // Ensure namespace exists
    await sshExecCommand(
      client,
      kubectl(
        `create namespace next-vibe --dry-run=client -o yaml | k3s kubectl apply -f -`,
      ),
      15000,
    );

    // Apply PostgresCluster CR
    const manifest = buildPostgresClusterManifest(
      clusterName,
      postgresReplicas,
    );
    const applyResult = await sshExecCommand(
      client,
      `echo '${manifest.replace(/'/g, "'\\''")}' | k3s kubectl apply -f -`,
      30000,
    );

    client.end();

    if (applyResult.exitCode !== 0) {
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      installed: true,
      message: `CloudNativePG installed with ${postgresReplicas} instance(s)`,
    });
  } catch {
    return fail({
      message: t("errors.sshConnectionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

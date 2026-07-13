import "server-only";

import type { SshConnection } from "@/ssh/db";

/**
 * Typed configuration for infra provisioning.
 * Control-plane / worker / storage nodes come from SSH connections
 * tagged with the appropriate clusterRole.
 */
export interface InfraConfig {
  clusterName: string;
  domain: string;
  email: string;
  k3sVersion: string;
  controlPlaneNodes: SshConnection[];
  workerNodes: SshConnection[];
  storageNodes: SshConnection[];
  /** Auto-derived: storageNodes.length (min 1) */
  minioReplicas: number;
  /** Auto-derived: min(2, controlPlane + worker count) */
  postgresReplicas: number;
  /** Path to write/read kubeconfig */
  kubeconfigPath: string;
  /** Path to Pulumi state directory */
  stateDir: string;
}

export function buildInfraConfig(
  clusterName: string,
  domain: string,
  email: string,
  k3sVersion: string,
  controlPlaneNodes: SshConnection[],
  workerNodes: SshConnection[],
  storageNodes: SshConnection[],
): InfraConfig {
  const totalNodes =
    controlPlaneNodes.length + workerNodes.length + storageNodes.length;
  return {
    clusterName,
    domain,
    email,
    k3sVersion,
    controlPlaneNodes,
    workerNodes,
    storageNodes,
    minioReplicas: Math.max(1, storageNodes.length),
    postgresReplicas: Math.min(2, totalNodes),
    kubeconfigPath: `${process.cwd()}/.pulumi/${clusterName}/kubeconfig.yaml`,
    stateDir: `${process.cwd()}/.pulumi/${clusterName}`,
  };
}

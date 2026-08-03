import "server-only";

import type { ResponseType } from "../../../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../../../core/route/response.schema";
import { parseError } from "../../../../../core/utils/parse-error";

import type { ClientT } from "@/ssh/client";
import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "@/ssh/client";

import type { InfraConfig } from "../config";
import { writeClusterState, writeKubeconfig } from "../state";
import {
  CHECK_K3S,
  GET_NODES,
  installK3sAgent,
  installK3sServer,
  patchKubeconfig,
  READ_KUBECONFIG,
  READ_NODE_TOKEN,
} from "./scripts";

interface K3sProvisionResult {
  nodesProvisioned: number;
  controlPlaneIp: string;
  kubeconfig: string;
}

/**
 * Provision k3s on all nodes in the config.
 * Idempotent: skips nodes where k3s is already installed.
 */
export async function provisionK3s(
  config: InfraConfig,
  dryRun: boolean,
  t: ClientT,
): Promise<ResponseType<K3sProvisionResult>> {
  try {
    const { controlPlaneNodes, workerNodes, storageNodes } = config;

    if (controlPlaneNodes.length === 0) {
      return fail({
        message: t("errors.connectionNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const primaryCp = controlPlaneNodes[0];

    if (dryRun) {
      return success({
        nodesProvisioned: 0,
        controlPlaneIp: primaryCp.host,
        kubeconfig: "[dry-run: no kubeconfig generated]",
      });
    }

    // ── Step 1: Install k3s server on control-plane ──────────────────────────

    const cpCreds = await getConnectionCredentials(
      primaryCp.id,
      primaryCp.userId,
      t,
    );
    if (!cpCreds.success) {
      return fail({
        message: cpCreds.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const cpClient = await openSshClient(cpCreds.data, t);
    if (!cpClient.success) {
      return fail({
        message: cpClient.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Check if already installed
    const checkResult = await sshExecCommand(
      cpClient.data.client,
      CHECK_K3S,
      10000,
    );
    const alreadyInstalled = !checkResult.stdout.includes("NOT_INSTALLED");

    if (!alreadyInstalled) {
      const installScript = installK3sServer(
        config.k3sVersion,
        config.clusterName,
      );
      const installResult = await sshExecCommand(
        cpClient.data.client,
        installScript,
        300000, // 5 min
      );
      if (!installResult.stdout.includes("K3S_READY")) {
        cpClient.data.client.end();
        return fail({
          message: t("errors.sshConnectionFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    // ── Step 2: Read node token and kubeconfig ────────────────────────────────

    const tokenResult = await sshExecCommand(
      cpClient.data.client,
      READ_NODE_TOKEN,
      10000,
    );
    if (!tokenResult.stdout.trim()) {
      cpClient.data.client.end();
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const nodeToken = tokenResult.stdout.trim();

    const kubeconfigResult = await sshExecCommand(
      cpClient.data.client,
      READ_KUBECONFIG,
      10000,
    );
    if (!kubeconfigResult.stdout.trim()) {
      cpClient.data.client.end();
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const rawKubeconfig = kubeconfigResult.stdout.trim();
    const kubeconfig = patchKubeconfig(rawKubeconfig, primaryCp.host);

    // Verify cluster is responding
    await sshExecCommand(cpClient.data.client, GET_NODES, 30000);
    cpClient.data.client.end();

    let nodesProvisioned = alreadyInstalled ? 0 : 1;

    // ── Step 3: Join worker and storage nodes ─────────────────────────────────

    const agentNodes = [
      ...workerNodes.map((n) => ({ node: n, role: "worker" as const })),
      ...storageNodes.map((n) => ({ node: n, role: "storage" as const })),
    ];

    for (const { node, role } of agentNodes) {
      const agentCreds = await getConnectionCredentials(
        node.id,
        node.userId,
        t,
      );
      if (!agentCreds.success) {
        continue; // log and continue - don't fail entire provision
      }

      const agentClient = await openSshClient(agentCreds.data, t);
      if (!agentClient.success) {
        continue;
      }

      const agentCheck = await sshExecCommand(
        agentClient.data.client,
        CHECK_K3S,
        10000,
      );
      const agentInstalled = !agentCheck.stdout.includes("NOT_INSTALLED");

      if (!agentInstalled) {
        const agentScript = installK3sAgent(
          config.k3sVersion,
          primaryCp.host,
          nodeToken,
          config.clusterName,
          role,
        );
        await sshExecCommand(agentClient.data.client, agentScript, 300000);
        nodesProvisioned++;
      }

      agentClient.data.client.end();
    }

    // ── Step 4: Persist state ─────────────────────────────────────────────────

    writeKubeconfig(config.kubeconfigPath, kubeconfig);
    writeClusterState(config.stateDir, {
      clusterName: config.clusterName,
      kubeconfig,
      controlPlaneIp: primaryCp.host,
      nodeToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return success({
      nodesProvisioned,
      controlPlaneIp: primaryCp.host,
      kubeconfig,
    });
  } catch (error) {
    void parseError(error);
    return fail({
      message: t("errors.sshConnectionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

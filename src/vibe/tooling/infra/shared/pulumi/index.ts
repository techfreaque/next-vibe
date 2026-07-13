import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { installDatabase } from "next-vibe/tooling/infra/shared/pulumi/database/index";
import { installIngress } from "next-vibe/tooling/infra/shared/pulumi/ingress/index";
import { provisionK3s } from "next-vibe/tooling/infra/shared/pulumi/k3s/index";
import { installRedis } from "next-vibe/tooling/infra/shared/pulumi/redis/index";
import { installStorage } from "next-vibe/tooling/infra/shared/pulumi/storage/index";

import type { ClientT } from "@/ssh/client";

import type { InfraConfig } from "./config";
interface ProvisionAllResult {
  success: boolean;
  message: string;
  nodesProvisioned: number;
  componentsInstalled: string[];
  kubeconfig: string;
  duration: number;
}

/**
 * Orchestrate full cluster provisioning.
 * Steps run sequentially: k3s → database → redis → storage → ingress.
 */
export async function provisionAll(
  config: InfraConfig,
  options: {
    dryRun: boolean;
    skipDatabase: boolean;
    skipRedis: boolean;
    skipStorage: boolean;
    skipIngress: boolean;
  },
  t: ClientT,
): Promise<ResponseType<ProvisionAllResult>> {
  const start = Date.now();
  const componentsInstalled: string[] = [];

  try {
    // ── k3s ──────────────────────────────────────────────────────────────────
    const k3sResult = await provisionK3s(config, options.dryRun, t);
    if (!k3sResult.success) {
      return fail({
        message: k3sResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    componentsInstalled.push("k3s");
    const { nodesProvisioned, kubeconfig } = k3sResult.data;

    if (options.dryRun) {
      return success({
        success: true,
        message: "Dry run complete. No changes made.",
        nodesProvisioned: 0,
        componentsInstalled: [
          "k3s (preview)",
          "database (preview)",
          "redis (preview)",
          "storage (preview)",
          "ingress (preview)",
        ],
        kubeconfig: "",
        duration: Date.now() - start,
      });
    }

    const controlPlane = config.controlPlaneNodes[0];

    // ── Database ──────────────────────────────────────────────────────────────
    if (!options.skipDatabase) {
      const dbResult = await installDatabase(
        controlPlane,
        config.clusterName,
        config.postgresReplicas,
        t,
      );
      if (dbResult.success) {
        componentsInstalled.push("database (CloudNativePG)");
      }
    }

    // ── Redis ─────────────────────────────────────────────────────────────────
    if (!options.skipRedis) {
      const redisResult = await installRedis(controlPlane, t);
      if (redisResult.success) {
        componentsInstalled.push("redis (sentinel)");
      }
    }

    // ── Storage ───────────────────────────────────────────────────────────────
    if (!options.skipStorage) {
      const storageResult = await installStorage(
        controlPlane,
        config.minioReplicas,
        config.clusterName,
        t,
      );
      if (storageResult.success) {
        componentsInstalled.push("storage (MinIO)");
      }
    }

    // ── Ingress ───────────────────────────────────────────────────────────────
    if (!options.skipIngress) {
      const ingressResult = await installIngress(controlPlane, config.email, t);
      if (ingressResult.success) {
        componentsInstalled.push("ingress (nginx + cert-manager)");
      }
    }

    const duration = Date.now() - start;
    const message = `Cluster '${config.clusterName}' ready. ${nodesProvisioned} node(s) provisioned. Components: ${componentsInstalled.join(", ")}.`;

    return success({
      success: true,
      message,
      nodesProvisioned,
      componentsInstalled,
      kubeconfig,
      duration,
    });
  } catch (error) {
    void parseError(error);
    return fail({
      message: t("errors.sshConnectionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

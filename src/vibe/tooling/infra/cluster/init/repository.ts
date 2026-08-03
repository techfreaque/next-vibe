import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "../../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../../core/route/response.schema";
import { parseError } from "../../../../core/utils/parse-error";
import { db } from "../../../../database";
import type { EndpointLogger } from "../../../../logger/types";
import type { InfraT } from "../../i18n";
import { buildInfraConfig } from "../../shared/pulumi/config";
import { provisionAll } from "../../shared/pulumi/index";
import { ensureGitignore } from "../../shared/pulumi/state";

import { sshConnections } from "@/ssh/db";
import { ClusterRole } from "@/ssh/enum";

import type {
  ClusterInitRequestOutput,
  ClusterInitResponseOutput,
} from "./definition";

export class ClusterInitRepository {
  static async init(
    data: ClusterInitRequestOutput,
    logger: EndpointLogger,
    t: InfraT,
  ): Promise<ResponseType<ClusterInitResponseOutput>> {
    try {
      logger.info("cluster-init: starting", {
        clusterName: data.clusterName,
        dryRun: data.dryRun,
      });

      // Load SSH connections tagged with cluster roles
      const [controlPlane, workers, storage] = await Promise.all([
        db
          .select()
          .from(sshConnections)
          .where(eq(sshConnections.clusterRole, ClusterRole.CONTROL_PLANE)),
        db
          .select()
          .from(sshConnections)
          .where(eq(sshConnections.clusterRole, ClusterRole.WORKER)),
        db
          .select()
          .from(sshConnections)
          .where(eq(sshConnections.clusterRole, ClusterRole.STORAGE)),
      ]);

      if (controlPlane.length === 0) {
        return fail({
          message: t("errors.noControlPlane"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.info(
        `cluster-init: found ${controlPlane.length} control-plane, ${workers.length} worker, ${storage.length} storage nodes`,
      );

      // Ensure .pulumi/ is in .gitignore
      ensureGitignore(process.cwd());

      const config = buildInfraConfig(
        data.clusterName,
        data.domain,
        data.email,
        data.k3sVersion ?? "v1.31.0+k3s1",
        controlPlane,
        workers,
        storage,
      );

      const result = await provisionAll(
        config,
        {
          dryRun: data.dryRun ?? false,
          skipDatabase: data.skipDatabase ?? false,
          skipRedis: data.skipRedis ?? false,
          skipStorage: data.skipStorage ?? false,
          skipIngress: data.skipIngress ?? false,
        },
        t,
      );

      if (!result.success) {
        logger.error("cluster-init: provisioning failed", {
          message: result.message,
        });
        return fail({
          message: result.message,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("cluster-init: complete", {
        nodesProvisioned: result.data.nodesProvisioned,
        components: result.data.componentsInstalled,
      });

      return success({
        success: result.data.success,
        message: result.data.message,
        nodesProvisioned: result.data.nodesProvisioned,
        componentsInstalled: result.data.componentsInstalled,
        kubeconfig: result.data.kubeconfig,
        duration: result.data.duration,
      });
    } catch (error) {
      logger.error("cluster-init: unexpected error", parseError(error));
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

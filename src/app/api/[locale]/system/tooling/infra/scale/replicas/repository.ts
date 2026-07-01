import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { InfraT } from "next-vibe/tooling/infra/i18n";
import type {
  ScaleReplicasRequestOutput,
  ScaleReplicasResponseOutput,
} from "next-vibe/tooling/infra/scale/replicas/definition";
import { scaleDeploymentInCluster } from "next-vibe/tooling/infra/shared/pulumi/app/index";

import { sshConnections } from "@/app/api/[locale]/ssh/db";
import { ClusterRole } from "@/app/api/[locale]/ssh/enum";

export class ScaleReplicasRepository {
  static async scale(
    data: ScaleReplicasRequestOutput,
    logger: EndpointLogger,
    t: InfraT,
  ): Promise<ResponseType<ScaleReplicasResponseOutput>> {
    try {
      const [controlPlane] = await db
        .select()
        .from(sshConnections)
        .where(eq(sshConnections.clusterRole, ClusterRole.CONTROL_PLANE))
        .limit(1);

      if (!controlPlane) {
        return fail({
          message: t("errors.noControlPlane"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.info("scale: scaling deployment", {
        component: data.component,
        replicas: data.replicas,
      });

      const result = await scaleDeploymentInCluster(
        controlPlane,
        data.component,
        data.replicas,
        t,
      );

      if (!result.success) {
        return fail({
          message: result.message,
          errorType: result.errorType,
        });
      }

      logger.info("scale: done", result.data);

      return success({
        success: true,
        message: result.data.message,
        previousReplicas: result.data.previousReplicas,
        newReplicas: result.data.newReplicas,
      });
    } catch (error) {
      logger.error("scale: failed", parseError(error));
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

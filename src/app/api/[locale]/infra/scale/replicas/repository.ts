import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { sshConnections } from "@/app/api/[locale]/ssh/db";
import { ClusterRole } from "@/app/api/[locale]/ssh/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";

import type { InfraT } from "../../i18n";
import { scaleDeploymentInCluster } from "../../shared/pulumi/app";
import type {
  ScaleReplicasRequestOutput,
  ScaleReplicasResponseOutput,
} from "./definition";

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

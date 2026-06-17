import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ScaleComponentType } from "@/app/api/[locale]/infra/enum";
import { ScaleComponent } from "@/app/api/[locale]/infra/enum";
import type { ClientT } from "@/app/api/[locale]/ssh/client";
import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "@/app/api/[locale]/ssh/client";
import type { SshConnection } from "@/app/api/[locale]/ssh/db";

import { getReplicaCount, scaleDeployment } from "../k3s/scripts";

const NEXT_VIBE_NAMESPACE = "next-vibe";

const DEPLOYMENT_NAMES: Record<ScaleComponentType, string> = {
  [ScaleComponent.WEB]: "next-vibe-web",
  [ScaleComponent.TASKS]: "next-vibe-tasks",
  [ScaleComponent.STORAGE]: "minio-tenant",
};

/**
 * Scale a next-vibe deployment in the cluster.
 */
export async function scaleDeploymentInCluster(
  controlPlaneNode: SshConnection,
  component: ScaleComponentType,
  replicas: number,
  t: ClientT,
): Promise<
  ResponseType<{
    previousReplicas: number;
    newReplicas: number;
    message: string;
  }>
> {
  const deploymentName = DEPLOYMENT_NAMES[component];

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

    // Get current replica count
    const currentResult = await sshExecCommand(
      client,
      getReplicaCount(NEXT_VIBE_NAMESPACE, deploymentName),
      15000,
    );

    if (currentResult.stdout.includes("NOT_FOUND")) {
      client.end();
      return fail({
        message: t("errors.connectionNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const previousReplicas = Number(currentResult.stdout.trim()) || 0;

    // Scale
    const scaleResult = await sshExecCommand(
      client,
      scaleDeployment(NEXT_VIBE_NAMESPACE, deploymentName, replicas),
      60000,
    );

    client.end();

    if (scaleResult.exitCode !== 0) {
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      previousReplicas,
      newReplicas: replicas,
      message: `${deploymentName} scaled from ${previousReplicas} → ${replicas} replicas`,
    });
  } catch (error) {
    void parseError(error);
    return fail({
      message: t("errors.sshConnectionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

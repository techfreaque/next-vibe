import "server-only";

import { count } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { getEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { envClient } from "@/config/env-client";
import { configScopedTranslation } from "@/config/i18n";

import type { RemoteInstancesData } from "./prompt";

export async function loadRemoteInstancesData(
  params: SystemPromptServerParams,
): Promise<RemoteInstancesData> {
  const { user, isIncognito, isExposedFolder, logger, locale } = params;
  const userId = user.isPublic ? undefined : user.id;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const isLocalMode =
    envClient.NEXT_PUBLIC_LOCAL_MODE || envClient.NODE_ENV !== "production";
  const isDev = envClient.NODE_ENV !== "production";
  const appUrl = envClient.NEXT_PUBLIC_APP_URL;
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const totalModelCount = getAvailableModelCount(isAdmin, getEnvAvailability());

  const base = {
    isAdmin,
    appName,
    appUrl,
    isLocalMode,
    isDev,
    totalModelCount,
  };

  if (!userId || isIncognito || isExposedFolder) {
    return {
      remoteConnections: [],
      instanceId: null,
      knownInstanceIds: [],
      sshConnectionCount: 0,
      ...base,
    };
  }

  try {
    const { RemoteConnectionRepository } =
      await import("@/app/api/[locale]/remote-connection/repository");
    const { sshConnections } = await import("@/app/api/[locale]/ssh/db");

    const [connections, localId, sshCountResult] = await Promise.all([
      RemoteConnectionRepository.getAllActiveConnections(userId),
      RemoteConnectionRepository.getLocalInstanceId(userId),
      db
        .select({ value: count() })
        .from(sshConnections)
        .where(eq(sshConnections.userId, userId)),
    ]);

    const sshConnectionCount = sshCountResult[0]?.value ?? 0;

    if (connections.length === 0) {
      return {
        remoteConnections: [],
        instanceId: localId,
        knownInstanceIds: [],
        sshConnectionCount,
        ...base,
      };
    }

    const remoteConnections = connections.map((c) => ({
      instanceId: c.remoteInstanceId ?? c.instanceId,
    }));
    const knownInstanceIds = remoteConnections.map((c) => c.instanceId);

    return {
      remoteConnections,
      instanceId: localId,
      knownInstanceIds,
      sshConnectionCount,
      ...base,
    };
  } catch (error) {
    logger.debug("Failed to load remote instances for system prompt", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      remoteConnections: [],
      instanceId: null,
      knownInstanceIds: [],
      sshConnectionCount: 0,
      ...base,
    };
  }
}

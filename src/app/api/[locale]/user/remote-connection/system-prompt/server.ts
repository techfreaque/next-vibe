import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import { simpleT } from "@/i18n/core/shared";

import type { RemoteInstancesData } from "./prompt";

export async function loadRemoteInstancesData(
  params: SystemPromptServerParams,
): Promise<RemoteInstancesData> {
  const { user, isIncognito, isExposedFolder, logger, locale } = params;
  const userId = user.isPublic ? undefined : user.id;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;
  const isDev = envClient.NODE_ENV !== "production";
  const appUrl = envClient.NEXT_PUBLIC_APP_URL;
  const { t } = simpleT(locale);
  const appName = t("config.appName");

  const base = {
    isAdmin,
    appName,
    appUrl,
    isLocalMode,
    isDev,
  };

  if (!userId || isIncognito || isExposedFolder) {
    return {
      remoteConnections: [],
      instanceId: null,
      knownInstanceIds: [],
      ...base,
    };
  }

  try {
    const { RemoteConnectionRepository } =
      await import("@/app/api/[locale]/user/remote-connection/repository");
    const [connections, localId] = await Promise.all([
      RemoteConnectionRepository.getAllActiveConnections(userId),
      RemoteConnectionRepository.getLocalInstanceId(userId),
    ]);

    if (connections.length === 0) {
      return {
        remoteConnections: [],
        instanceId: localId,
        knownInstanceIds: [],
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
      ...base,
    };
  }
}

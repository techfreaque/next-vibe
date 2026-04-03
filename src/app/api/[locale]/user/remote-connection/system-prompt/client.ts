"use client";

import { useMemo } from "react";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import remoteConnectionEndpoints from "@/app/api/[locale]/user/remote-connection/list/definition";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import { configScopedTranslation } from "@/config/i18n";

import type { RemoteInstancesData } from "./prompt";

export function useRemoteInstancesData(
  params: SystemPromptClientParams,
): RemoteInstancesData {
  const { enabledPrivate, logger, user, locale } = params;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const envAvailability = useEnvAvailability();
  const totalModelCount = getAvailableModelCount(envAvailability, isAdmin);
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;
  const isDev = envClient.NODE_ENV !== "production";
  const appUrl = envClient.NEXT_PUBLIC_APP_URL;
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const connectionsEndpoint = useEndpoint(
    remoteConnectionEndpoints,
    {
      read: {
        queryOptions: {
          enabled: enabledPrivate && !user.isPublic,
          staleTime: 5 * 60 * 1000,
        },
      },
    },
    logger,
    user,
  );

  return useMemo(() => {
    const base = {
      isAdmin,
      appName,
      appUrl,
      isLocalMode,
      isDev,
      totalModelCount,
    };
    const response = connectionsEndpoint.read?.response;
    if (response?.success !== true) {
      return {
        remoteConnections: [],
        instanceId: null,
        knownInstanceIds: [],
        ...base,
      };
    }

    const data = response.data;
    const active = (data.connections ?? []).filter((c) => c.isActive);
    if (active.length === 0) {
      return {
        remoteConnections: [],
        instanceId: data.selfInstanceId ?? null,
        knownInstanceIds: [],
        ...base,
      };
    }

    const remoteConnections = active.map((c) => ({
      instanceId: c.instanceId,
    }));

    return {
      remoteConnections,
      instanceId: data.selfInstanceId ?? null,
      knownInstanceIds: remoteConnections.map((c) => c.instanceId),
      ...base,
    };
  }, [
    connectionsEndpoint.read?.response,
    isAdmin,
    appName,
    appUrl,
    isLocalMode,
    isDev,
    totalModelCount,
  ]);
}

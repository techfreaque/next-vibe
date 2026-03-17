"use client";

import { useMemo } from "react";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import { simpleT } from "@/i18n/core/shared";
import remoteConnectionEndpoints from "@/app/api/[locale]/user/remote-connection/list/definition";

import type { RemoteInstancesData } from "./prompt";

export function useRemoteInstancesData(
  params: SystemPromptClientParams,
): RemoteInstancesData {
  const { enabledPrivate, logger, user, locale } = params;
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;
  const isDev = envClient.NODE_ENV !== "production";
  const appUrl = envClient.NEXT_PUBLIC_APP_URL;
  const { t } = simpleT(locale);
  const appName = t("config.appName");

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
    const base = { isAdmin, appName, appUrl, isLocalMode, isDev };
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
      friendlyName: c.friendlyName,
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
  ]);
}

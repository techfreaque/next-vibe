"use client";

import { useMemo } from "react";

import remoteConnectionEndpoints from "@/app/api/[locale]/remote-connection/list/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  type AgentEnvAvailability,
  agentEnvAvailability,
  buildAvailabilityFromConnections,
} from "./env-availability";

/**
 * Returns provider availability for the current user.
 * For authenticated users, merges env-based availability with DB-derived
 * inference provider state (from the connection list endpoint).
 * Falls back to the static env singleton for public/unauthenticated users.
 */
export function useProviderAvailability(
  user: JwtPayloadType,
  logger: EndpointLogger,
): AgentEnvAvailability {
  const isPrivate = !user.isPublic;

  const connectionsEndpoint = useEndpoint(
    remoteConnectionEndpoints,
    {
      read: {
        queryOptions: {
          enabled: isPrivate,
          staleTime: 5 * 60 * 1000,
        },
      },
    },
    logger,
    user,
  );

  return useMemo(() => {
    if (!isPrivate) {
      return agentEnvAvailability;
    }
    const response = connectionsEndpoint.read?.response;
    if (response?.success !== true) {
      return agentEnvAvailability;
    }
    return buildAvailabilityFromConnections(response.data.hasInferenceProvider);
  }, [isPrivate, connectionsEndpoint.read?.response]);
}

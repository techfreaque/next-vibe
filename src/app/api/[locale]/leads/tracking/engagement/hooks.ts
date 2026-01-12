"use client";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

export const useEngagementTracking = (
  logger: EndpointLogger,
): ReturnType<typeof useEndpoint> => useEndpoint(definitions, {}, logger);

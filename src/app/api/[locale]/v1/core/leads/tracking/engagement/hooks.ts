"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import definitions from "./definition";

export const useEngagementTracking = (
  logger: EndpointLogger,
): ReturnType<typeof useEndpoint> => useEndpoint(definitions, {}, logger);

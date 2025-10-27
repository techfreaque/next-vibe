"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import definitions from "./definition";

export const useEngagementTracking = (logger: EndpointLogger) =>
  useEndpoint(definitions, {}, logger);

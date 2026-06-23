"use client";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";

import type { JwtPayloadType } from "../../../user/auth/types";
import definitions from "./definition";

export const useEngagementTracking = (
  logger: EndpointLogger,
  user: JwtPayloadType,
): ReturnType<typeof useEndpoint> =>
  useEndpoint(definitions, undefined, logger, user);

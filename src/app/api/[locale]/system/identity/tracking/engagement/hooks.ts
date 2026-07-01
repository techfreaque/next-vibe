"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

export const useEngagementTracking = (
  logger: EndpointLogger,
  user: JwtPayloadType,
): ReturnType<typeof useEndpoint> =>
  useEndpoint(definitions, undefined, logger, user);

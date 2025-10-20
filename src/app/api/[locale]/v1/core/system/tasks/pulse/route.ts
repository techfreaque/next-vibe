/**
 * Pulse Route
 * API routes for pulse health monitoring system
 */

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { PulseExecuteRequestOutput } from "./execute/definition";
import { pulseExecuteRepository } from "./execute/repository";

export async function POST(
  data: PulseExecuteRequestOutput,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ReturnType<typeof pulseExecuteRepository.executePulse>> {
  return await pulseExecuteRepository.executePulse(data, user, locale, logger);
}

export const tools = {};

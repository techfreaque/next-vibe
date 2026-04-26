/**
 * Desktop ListMonitors Repository
 * Enumerates connected monitors via kscreen-doctor or xrandr.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { DesktopT } from "../i18n";
import { checkLinux, listMonitors } from "../shared/repository";
import type { DesktopListMonitorsResponseOutput } from "./definition";

export class DesktopListMonitorsRepository {
  static async listMonitors(
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<DesktopListMonitorsResponseOutput>> {
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<DesktopListMonitorsResponseOutput>;
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const monitors = await listMonitors(logger);

    return success({
      success: true,
      monitors,
      executionId,
    });
  }
}

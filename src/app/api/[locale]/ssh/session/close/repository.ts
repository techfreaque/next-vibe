import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { sessionPool } from "../pool";
import type {
  SessionCloseRequestOutput,
  SessionCloseResponseOutput,
} from "./definition";

export class SessionCloseRepository {
  static async close(
    data: SessionCloseRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SessionCloseResponseOutput>> {
    const entry = sessionPool.get(data.sessionId);
    if (entry) {
      clearTimeout(entry.idleTimer);
      entry.proc.kill();
      sessionPool.delete(data.sessionId);
      logger.info(`Closed session ${data.sessionId}`);
    }
    return success({ ok: true });
  }
}

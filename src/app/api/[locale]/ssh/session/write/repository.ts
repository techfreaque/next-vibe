import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { sessionPool } from "../pool";
import type {
  SessionWriteRequestOutput,
  SessionWriteResponseOutput,
} from "./definition";

export class SessionWriteRepository {
  static async write(
    data: SessionWriteRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SessionWriteResponseOutput>> {
    const entry = sessionPool.get(data.sessionId);
    if (!entry) {
      return fail({
        message: "Session not found",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    try {
      const input = data.raw ? data.input : `${data.input}\n`;
      entry.proc.stdin?.write(input);
      logger.debug(`Wrote ${input.length} bytes to session ${data.sessionId}`);
      return success({ ok: true });
    } catch (error) {
      return fail({
        message: String(error),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

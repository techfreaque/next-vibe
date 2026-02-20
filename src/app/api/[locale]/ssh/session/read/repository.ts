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
  SessionReadRequestOutput,
  SessionReadResponseOutput,
} from "./definition";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class SessionReadRepository {
  static async read(
    data: SessionReadRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SessionReadResponseOutput>> {
    const entry = sessionPool.get(data.sessionId);
    if (!entry) {
      return fail({
        message: "Session not found",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const waitMs = Math.min(data.waitMs ?? 500, 5000);
    const maxBytes = Math.min(data.maxBytes ?? 16384, 65536);

    // Wait for output
    if (waitMs > 0 && entry.outputBuffer().length === 0) {
      await sleep(waitMs);
    }

    const raw = entry.drainOutput();
    const output =
      raw.length > maxBytes ? raw.slice(raw.length - maxBytes) : raw;
    const eof = entry.proc.exitCode !== null;

    if (eof) {
      sessionPool.delete(data.sessionId);
      clearTimeout(entry.idleTimer);
      logger.debug(`Session ${data.sessionId} ended`);
    }

    return success({ output, eof, status: entry.status });
  }
}

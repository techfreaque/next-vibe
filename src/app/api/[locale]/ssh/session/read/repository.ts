import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { SshT } from "../../i18n";
import { sessionPool } from "../pool";
import type {
  SessionReadRequestOutput,
  SessionReadResponseOutput,
} from "./definition";

export class SessionReadRepository {
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  static async read(
    data: SessionReadRequestOutput,
    logger: EndpointLogger,
    t: SshT,
  ): Promise<ResponseType<SessionReadResponseOutput>> {
    const entry = sessionPool.get(data.sessionId);
    if (!entry) {
      return fail({
        message: t("errors.sessionNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const waitMs = Math.min(data.waitMs ?? 500, 5000);
    const maxBytes = Math.min(data.maxBytes ?? 16384, 65536);

    // Wait for output
    if (waitMs > 0 && entry.outputBuffer().length === 0) {
      await SessionReadRepository.sleep(waitMs);
    }

    const raw = entry.drainOutput();
    const output =
      raw.length > maxBytes ? raw.slice(raw.length - maxBytes) : raw;

    // Detect EOF: local → proc.exitCode; SSH → session deleted on channel close
    const eof =
      entry.kind === "local"
        ? entry.proc.exitCode !== null
        : !sessionPool.has(data.sessionId);

    if (eof) {
      sessionPool.delete(data.sessionId);
      clearTimeout(entry.idleTimer);
      logger.debug(`Session ${data.sessionId} ended`);
    }

    return success({ output, eof, status: entry.status });
  }
}

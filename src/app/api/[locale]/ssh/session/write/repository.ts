import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { scopedTranslation } from "../../i18n";
import { sessionPool } from "../pool";
import type {
  SessionWriteRequestOutput,
  SessionWriteResponseOutput,
} from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class SessionWriteRepository {
  static async write(
    data: SessionWriteRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<SessionWriteResponseOutput>> {
    const entry = sessionPool.get(data.sessionId);
    if (!entry) {
      return fail({
        message: t("errors.sessionNotFound"),
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
        message: t("errors.notImplemented.session"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

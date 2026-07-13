import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ControlSignals } from "../../repository/control-signals";
import type {
  ResumeWhenDoneRequestOutput,
  ResumeWhenDoneResponseOutput,
} from "./definition";

export class ResumeWhenDoneRepository {
  /**
   * Upgrade a single in-flight tool call to WAKE_UP mid-flight. Delivers a
   * `wakeUp` control signal to the running call; the call keeps running in the
   * background, the turn ends, and the thread revives with the result when the
   * work completes. `delivered=false` = the call already settled or is not
   * running here (a no-op, not an error).
   */
  static async resumeWhenDone(
    data: ResumeWhenDoneRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ResumeWhenDoneResponseOutput>> {
    ControlSignals.deliver(data.callId, "wakeUp", user, logger);
    logger.debug("[resume-when-done] wakeUp signal emitted", {
      callId: data.callId,
    });
    return success({ delivered: true });
  }
}

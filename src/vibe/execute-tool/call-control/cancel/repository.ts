import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ControlSignals } from "../../repository/control-signals";
import type {
  CancelToolRequestOutput,
  CancelToolResponseOutput,
} from "./definition";

export class CancelToolRepository {
  /**
   * Interrupt a single in-flight tool call. Emits a `cancel` control event to the
   * running call (which subscribed to its control channel in parallel with its own
   * execution); the call aborts and returns an error as its tool result — the turn
   * and sibling parallel calls keep running. Fire-and-forget over the WS-hub +
   * bridge primitive: reaches the reactor in whatever process/instance runs it.
   */
  static async cancel(
    data: CancelToolRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CancelToolResponseOutput>> {
    ControlSignals.deliver(data.callId, "cancel", user, logger);
    logger.debug("[cancel-tool] cancel signal emitted", {
      callId: data.callId,
    });
    return success({ delivered: true });
  }
}

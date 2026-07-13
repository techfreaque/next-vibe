/**
 * Remote Connection Self Instance ID Repository
 * GET - read the instanceId of the current instance's own identity on this machine.
 *       Falls back to the derived default when no identity row exists yet.
 */

import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { RemoteConnectionRepository } from "../../repository";
import type { RemoteConnectionSelfInstanceIdGetResponseOutput } from "./definition";

export class RemoteConnectionSelfInstanceIdRepository {
  static async getSelfInstanceId(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<RemoteConnectionSelfInstanceIdGetResponseOutput>> {
    const instanceId = await RemoteConnectionRepository.getLocalInstanceId(
      user.id,
    );

    logger.debug("Resolved self instanceId", { userId: user.id, instanceId });

    return success({ instanceId });
  }
}

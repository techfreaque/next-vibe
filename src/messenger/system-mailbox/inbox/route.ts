/**
 * Platform Mailbox - Inbox route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SystemMailboxRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      SystemMailboxRepository.listInbox(
        { limit: data.limit, unreadOnly: data.unreadOnly },
        logger,
        t,
      ),
  },
});

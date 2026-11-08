/**
 * Platform Mailbox - Send route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SystemMailboxRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      SystemMailboxRepository.send(
        {
          to: data.to,
          subject: data.subject,
          text: data.body,
          html: data.html,
        },
        user.id,
        logger,
        t,
      ),
  },
});

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { MessagesRemoteRepository, MessagesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, t, logger, locale }) =>
      MessagesRepository.listMessages(urlPathParams, user, t, logger, locale),
    resolveChannel: (ctx) => MessagesRepository.resolveSubscriptionChannel(ctx),
    onRemoteEvent: {
      "message-created": (props) =>
        MessagesRemoteRepository.applyRemoteMessageCreated(props),
      error: (props) => MessagesRemoteRepository.applyRemoteError(props),
      "content-done": (props) =>
        MessagesRemoteRepository.applyRemoteContentDone(props),
      "content-delta": (props) =>
        MessagesRemoteRepository.applyRemoteContentDelta(props),
      "reasoning-delta": (props) =>
        MessagesRemoteRepository.applyRemoteReasoningDelta(props),
      "reasoning-done": (props) =>
        MessagesRemoteRepository.applyRemoteReasoningDone(props),
      "tool-result": (props) =>
        MessagesRemoteRepository.applyRemoteToolResult(props),
      "tool-result-updated": (props) =>
        MessagesRemoteRepository.applyRemoteToolResultUpdated(props),
      "tokens-updated": (props) =>
        MessagesRemoteRepository.applyRemoteTokensUpdated(props),
      "stream-finished": (props) =>
        MessagesRemoteRepository.applyRemoteStreamFinished(props),
      "streaming-state-changed": (props) =>
        MessagesRemoteRepository.applyRemoteStreamingStateChanged(props),
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, t, logger, locale }) =>
      MessagesRepository.createMessage(
        { ...data, threadId: urlPathParams.threadId },
        user,
        t,
        logger,
        locale,
      ),
  },
});

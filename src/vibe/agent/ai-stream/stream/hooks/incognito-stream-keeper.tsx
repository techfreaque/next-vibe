"use client";

/**
 * IncognitoStreamKeeper
 *
 * Incognito threads live ONLY in localStorage and their streamed content
 * arrives ONLY via WS events on the messages channel — there is no server
 * copy to refetch. The messages widget subscribes only to the ACTIVE thread,
 * so navigating to a different thread/folder mid-stream would silently drop
 * the rest of the response.
 *
 * This keeper holds a headless useEndpoint subscription for every incognito
 * thread with a running stream (tracked in useAIStreamStore.incognitoStreams,
 * registered by useAIStream.startStream, released by the stream-finished
 * onEvent). The read primes the messages query cache from localStorage via
 * the client route, so the framework merge + incognito persistence handlers
 * operate on the real cache even while the thread is not being viewed.
 *
 * The keeper subscribes for the ACTIVE thread too — deliberately overlapping
 * the messages widget's own subscription. A handoff (unsubscribe on navigate,
 * resubscribe here) would drop every chunk emitted in the gap; an overlap
 * drops none. Double-application is impossible: channel subscriptions are
 * ref-counted client-side (one wire subscription, N handlers) and
 * useEndpointSubscription applies each event exactly once per cache key
 * (owner registry) no matter how many instances share it.
 */

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import type { JSX } from "react";
import { useMemo } from "react";

import { DefaultFolderId } from "../../../../core/execution-context";
import messagesDefinition from "../../../chat/threads/[threadId]/messages/definition";
import { useAIStreamStore } from "./store";

interface KeeperProps {
  user: JwtPayloadType;
  logger: EndpointLogger;
}

function KeeperSubscription({
  threadId,
  user,
  logger,
}: KeeperProps & { threadId: string }): null {
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { threadId },
        initialState: { rootFolderId: DefaultFolderId.INCOGNITO },
        queryOptions: { enabled: true, staleTime: Infinity },
      },
      subscribeToEvents: true,
    }),
    [threadId],
  );
  useEndpoint(messagesDefinition, options, logger, user);
  return null;
}

export function IncognitoStreamKeeper({
  user,
  logger,
}: KeeperProps): JSX.Element | null {
  const incognitoStreams = useAIStreamStore((s) => s.incognitoStreams);

  const threadIds = useMemo(() => [...incognitoStreams], [incognitoStreams]);

  if (threadIds.length === 0) {
    return null;
  }
  return (
    <>
      {threadIds.map((threadId) => (
        <KeeperSubscription
          key={threadId}
          threadId={threadId}
          user={user}
          logger={logger}
        />
      ))}
    </>
  );
}

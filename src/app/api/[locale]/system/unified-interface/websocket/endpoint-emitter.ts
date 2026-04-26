/**
 * Typed Cross-Endpoint Event Emitter
 *
 * Creates a typed emit function for a specific GET endpoint's channel.
 * Used by mutation repositories to push typed WS events to GET endpoint caches.
 *
 * Usage:
 * ```ts
 * import definitions from "./definition";
 * const emit = createEndpointEmitter(definitions.GET, logger, user);
 * emit("memory-created", { memories: [{ id, content, tags }] });
 * ```
 */

import "server-only";

import type { EndpointLogger } from "../shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { buildWsChannel } from "./channel";
import { publishWsEvent } from "./emitter";
import type {
  ComputeEventPayloads,
  EmitEventNamed,
  EndpointEventEnvelope,
  EndpointEventsMap,
} from "./structured-events";

interface EndpointWithEventPayloads<
  TEventPayloads extends ComputeEventPayloads<
    TResponseOutput,
    EndpointEventsMap<TResponseOutput>
  >,
  TResponseOutput = TEventPayloads extends ComputeEventPayloads<
    infer R,
    EndpointEventsMap<infer R>
  >
    ? R
    : never,
> {
  readonly path: readonly string[];
  readonly method: string;
  readonly types: {
    readonly EventPayloads: TEventPayloads;
  };
}

export function createEndpointEmitter<
  TEventPayloads extends ComputeEventPayloads<
    TResponseOutput,
    EndpointEventsMap<TResponseOutput>
  >,
  TResponseOutput = TEventPayloads extends ComputeEventPayloads<
    infer R,
    EndpointEventsMap<infer R>
  >
    ? R
    : never,
>(
  endpoint: EndpointWithEventPayloads<TEventPayloads, TResponseOutput>,
  logger: EndpointLogger,
  user: JwtPayloadType,
  urlPathParams: { readonly [K in string]: string } = {},
): EmitEventNamed<TEventPayloads> {
  const channel = buildWsChannel(endpoint.path, urlPathParams);

  return function emit(eventName, payload) {
    const envelope: EndpointEventEnvelope<TEventPayloads[typeof eventName]> = {
      endpointPath: endpoint.path,
      endpointMethod: endpoint.method,
      urlPathParams,
      eventName: eventName as string,
      payload,
    };
    publishWsEvent(
      { channel, event: "__event__", data: envelope },
      logger,
      user,
    );
  } as EmitEventNamed<TEventPayloads>;
}

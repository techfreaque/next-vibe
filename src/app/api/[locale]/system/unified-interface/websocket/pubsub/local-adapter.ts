/**
 * Local Pub/Sub Adapter
 *
 * In-process broadcasting - the default for single-instance deployments.
 * publish() calls broadcastLocal() directly. subscribe()/unsubscribe() are no-ops
 * because in-process delivery is handled by the channel registry in server.ts.
 */

import { broadcastLocalToAll } from "../server";
import type { AnyEndpointEventEnvelope } from "../structured-events";
import type { PubSubAdapter, PubSubMessageHandler } from "./types";

export class LocalPubSubAdapter implements PubSubAdapter {
  publish<T>(channel: string, event: string, data: T): void {
    broadcastLocalToAll(channel, event, data);
  }

  subscribe<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    channel: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handler: PubSubMessageHandler<T>,
  ): void {
    // No-op: local broadcasting is handled directly by the channel registry
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unsubscribe(channel: string): void {
    // No-op: local broadcasting is handled directly by the channel registry
  }
}

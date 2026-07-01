/**
 * Local Pub/Sub Adapter
 *
 * In-process broadcasting - the default for single-instance deployments.
 * publish() calls broadcastLocalToAll() directly. subscribe()/unsubscribe() are no-ops
 * because in-process delivery is handled by the channel registry in server.ts.
 */

import type { PubSubAdapter, PubSubMessageHandler } from "./types";

import { broadcastLocalToAll } from "../server";
import type { AnyEndpointEventEnvelope } from "../structured-events";

export class LocalPubSubAdapter implements PubSubAdapter {
  publish(
    channel: string,
    event: string,
    data: AnyEndpointEventEnvelope,
  ): void {
    broadcastLocalToAll(channel, event, data);
  }

  subscribe<T extends AnyEndpointEventEnvelope>(
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

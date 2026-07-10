/**
 * Local Pub/Sub Adapter
 *
 * In-process broadcasting - the default for single-instance deployments.
 * publish() calls broadcastLocalToAll() for WS client delivery AND fires
 * any server-side handlers registered via subscribe() (used by StreamControl,
 * ControlSignals, and other server-to-server signal mechanisms).
 *
 * subscribe()/unsubscribe() maintain a server-side handler map keyed by
 * channel. A channel may have at most ONE handler at a time (all current
 * callers — StreamControl, ControlSignals — subscribe, race, then cancel).
 */

import { broadcastLocalToAll } from "../server";
import type { AnyEndpointEventEnvelope } from "../structured-events";
import type { PubSubAdapter, PubSubMessageHandler } from "./types";

export class LocalPubSubAdapter implements PubSubAdapter {
  private readonly serverHandlers = new Map<
    string,
    PubSubMessageHandler<AnyEndpointEventEnvelope>
  >();

  publish(
    channel: string,
    event: string,
    data: AnyEndpointEventEnvelope,
  ): void {
    // Deliver to WS clients subscribed to this channel.
    broadcastLocalToAll(channel, event, data);
    // Deliver to server-side subscribers (StreamControl, ControlSignals, etc.).
    const handler = this.serverHandlers.get(channel);
    if (handler) {
      handler(event, data);
    }
  }

  subscribe<T extends AnyEndpointEventEnvelope>(
    channel: string,
    handler: PubSubMessageHandler<T>,
  ): void {
    this.serverHandlers.set(
      channel,
      handler as PubSubMessageHandler<AnyEndpointEventEnvelope>,
    );
  }

  unsubscribe(channel: string): void {
    this.serverHandlers.delete(channel);
  }
}

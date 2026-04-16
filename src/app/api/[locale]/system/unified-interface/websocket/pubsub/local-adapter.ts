/**
 * Local Pub/Sub Adapter
 *
 * In-process broadcasting - the default for single-instance deployments.
 * publish() calls broadcastLocal() directly. subscribe()/unsubscribe() are no-ops
 * because in-process delivery is handled by the channel registry in server.ts.
 */

import { broadcastLocalToAll } from "../server";
import type {
  PubSubAdapter,
  PubSubMessageData,
  PubSubMessageHandler,
} from "./types";

export class LocalPubSubAdapter implements PubSubAdapter {
  publish(channel: string, event: string, data: PubSubMessageData): void {
    broadcastLocalToAll(channel, event, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribe(channel: string, handler: PubSubMessageHandler): void {
    // No-op: local broadcasting is handled directly by the channel registry
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unsubscribe(channel: string): void {
    // No-op: local broadcasting is handled directly by the channel registry
  }
}

/**
 * Local Pub/Sub Adapter
 *
 * In-process broadcasting - the default for single-instance deployments.
 * publish() assigns the replay seq (in-memory replay buffer), calls
 * broadcastLocalToAll() for WS client delivery AND fires any server-side
 * handlers registered via subscribe() (used by StreamControl, ControlSignals,
 * and other server-to-server signal mechanisms).
 *
 * subscribe()/unsubscribe() maintain a server-side handler map keyed by
 * channel. A channel may have at most ONE handler at a time (all current
 * callers — StreamControl, ControlSignals — subscribe, race, then cancel).
 */

import type { AnyEndpointEventEnvelope } from "../../core/structured-events";
import { MemoryReplayBuffer, type ReplayPrepareResult } from "../replay-buffer";
import { broadcastLocalToAll } from "../server";
import type { PubSubAdapter, PubSubMessageHandler } from "./types";

export class LocalPubSubAdapter implements PubSubAdapter {
  // publish() below calls broadcastLocalToAll() itself — the WS server must
  // not add its per-channel relay handler on top (see PubSubAdapter docs).
  readonly deliversToLocalSockets = true;

  private readonly serverHandlers = new Map<
    string,
    PubSubMessageHandler<AnyEndpointEventEnvelope>
  >();

  constructor(
    private readonly replay: MemoryReplayBuffer = new MemoryReplayBuffer(),
  ) {}

  publish(
    channel: string,
    event: string,
    data: AnyEndpointEventEnvelope,
  ): void {
    const seq = this.replay.append(channel, event, data);
    // Deliver to WS clients subscribed to this channel.
    broadcastLocalToAll(channel, event, data, seq);
    // Deliver to server-side subscribers (StreamControl, ControlSignals, etc.).
    const handler = this.serverHandlers.get(channel);
    if (handler) {
      handler(event, data, seq);
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

  whenSubscribed(): Promise<void> {
    return Promise.resolve();
  }

  unsubscribe(channel: string): void {
    this.serverHandlers.delete(channel);
  }

  prepareReplay(
    channel: string,
    since: number | undefined,
  ): Promise<ReplayPrepareResult> {
    return Promise.resolve(this.replay.prepare(channel, since));
  }

  touchReplay(channels: readonly string[]): void {
    this.replay.touch(channels);
  }

  mustPublish(channel: string): boolean {
    return this.replay.hasState(channel);
  }
}

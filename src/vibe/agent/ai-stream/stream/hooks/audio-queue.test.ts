import { expect, it } from "bun:test";
import { createEndpointLogger } from "next-vibe/logger/server";

import { SILENT_WAV_DATA_URI } from "../../../text-to-speech/audio-diagnostics";
import { AudioQueueManager } from "./audio-queue";

it("uses the player unlocked during the gesture for every streamed chunk", async () => {
  const played: string[] = [];
  const players: GestureAudio[] = [];
  let gesture = true;
  class GestureAudio extends EventTarget {
    readyState = 4;
    paused = true;
    currentTime = 0;
    unlocked = false;
    constructor(public src = "") {
      super();
      players.push(this);
    }
    async play(): Promise<void> {
      if (gesture) {
        this.unlocked = true;
      }
      if (!this.unlocked) {
        return Promise.reject(
          new DOMException("Gesture required", "NotAllowedError"),
        );
      }
      this.paused = false;
      played.push(this.src);
    }
    pause(): void {
      this.paused = true;
    }
    removeAttribute(): void {
      this.src = "";
    }
    load(): void {}
  }
  const audio = Object.getOwnPropertyDescriptor(globalThis, "Audio");
  const media = Object.getOwnPropertyDescriptor(globalThis, "HTMLMediaElement");
  Object.defineProperty(globalThis, "Audio", {
    configurable: true,
    value: GestureAudio,
  });
  Object.defineProperty(globalThis, "HTMLMediaElement", {
    configurable: true,
    value: { HAVE_ENOUGH_DATA: 4, HAVE_NOTHING: 0 },
  });
  const logger = createEndpointLogger(false, "en-US");
  const queue = new AudioQueueManager(logger);
  try {
    queue.primeForGesture();
    queue.stop();
    gesture = false;
    queue.enqueue("data:audio/mpeg;base64,YQ==", 0, logger);
    queue.enqueue("data:audio/mpeg;base64,Yg==", 1, logger);
    players[0]?.dispatchEvent(new Event("ended"));
    await Promise.resolve();
    expect(players).toHaveLength(1);
    expect(played).toEqual([
      SILENT_WAV_DATA_URI,
      "data:audio/mpeg;base64,YQ==",
      "data:audio/mpeg;base64,Yg==",
    ]);
    players[0]?.dispatchEvent(new Event("ended"));
  } finally {
    queue.stop();
    if (audio) Object.defineProperty(globalThis, "Audio", audio);
    else Reflect.deleteProperty(globalThis, "Audio");
    if (media) Object.defineProperty(globalThis, "HTMLMediaElement", media);
    else Reflect.deleteProperty(globalThis, "HTMLMediaElement");
  }
});

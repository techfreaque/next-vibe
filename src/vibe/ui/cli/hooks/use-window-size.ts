import { useStdout } from "ink";
import { useEffect, useState } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 24;

/**
 * The slice of `process.stdout` this hook needs.
 *
 * Structural rather than `NodeJS.WriteStream` so the hook stays testable with
 * a plain EventEmitter stub.
 */
interface ResizableStream {
  columns?: number;
  rows?: number;
  on: (event: "resize", listener: () => void) => void;
  off: (event: "resize", listener: () => void) => void;
}

interface StreamSubscription {
  listeners: Set<() => void>;
  handler: () => void;
}

/**
 * One "resize" listener per stream, fanned out to every hook instance.
 *
 * A table renders a separator per row, so subscribing straight from each
 * component would attach dozens of listeners to `process.stdout` and trip
 * Node's MaxListenersExceededWarning right into the user's terminal.
 */
const subscriptions = new WeakMap<ResizableStream, StreamSubscription>();

function subscribe(stream: ResizableStream, listener: () => void): () => void {
  let subscription = subscriptions.get(stream);
  if (!subscription) {
    const listeners = new Set<() => void>();
    const handler = (): void => {
      // Iterating a Set is safe even if a listener unsubscribes mid-loop.
      for (const current of listeners) {
        current();
      }
    };
    subscription = { listeners, handler };
    subscriptions.set(stream, subscription);
    stream.on("resize", handler);
  }

  const active = subscription;
  active.listeners.add(listener);

  return (): void => {
    active.listeners.delete(listener);
    if (active.listeners.size === 0) {
      stream.off("resize", active.handler);
      subscriptions.delete(stream);
    }
  };
}

function readSize(stream: ResizableStream): WindowSize {
  return {
    width: stream.columns ?? DEFAULT_WIDTH,
    height: stream.rows ?? DEFAULT_HEIGHT,
  };
}

/**
 * CLI: returns terminal columns/rows, re-rendering on SIGWINCH.
 *
 * `useStdout()` is just `useContext(StdoutContext)` — a stable object with no
 * resize subscription — so reading `stdout.columns` during render froze the
 * width at mount. State plus a "resize" listener makes it actually reactive.
 */
export function useWindowSize(): WindowSize {
  const { stdout } = useStdout();
  const stream: ResizableStream = stdout;
  const [size, setSize] = useState<WindowSize>(() => readSize(stream));

  useEffect(() => {
    const sync = (): void => {
      setSize((previous) => {
        const next = readSize(stream);
        // Keep the previous object when nothing changed so consumers that
        // depend on identity do not re-render on every resize event.
        return previous.width === next.width && previous.height === next.height
          ? previous
          : next;
      });
    };

    // The terminal may have resized between render and effect.
    sync();

    return subscribe(stream, sync);
  }, [stream]);

  return size;
}

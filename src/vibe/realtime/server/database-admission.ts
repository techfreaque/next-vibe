import http from "node:http";
import { setTimeout } from "node:timers/promises";

let ready = new AbortController();
let started: Promise<void> | undefined;
let probeHealthy = false;

async function sample(): Promise<void> {
  // The companion shares this container's credentials and network namespace.
  // One local HTTP check per process, regardless of the number of open reads.
  const result = await new Promise<"ready" | "db-unavailable" | "unknown">(
    (resolve) => {
      const req = http.get("http://127.0.0.1:3099/_ha/ready", (res) => {
        res.resume();
        const state = res.headers["x-ha-readiness"];
        if (res.statusCode === 503 && state === "v1-db-unavailable") {
          resolve("db-unavailable");
        } else {
          resolve(
            res.statusCode === 200 && state === "v1-ready"
              ? "ready"
              : "unknown",
          );
        }
      });
      const deadline = globalThis.setTimeout(() => {
        resolve("unknown");
        req.destroy();
      }, 400);
      req.once("close", () => {
        clearTimeout(deadline);
        resolve("unknown");
      });
      req.once("error", () => resolve("unknown"));
    },
  );
  probeHealthy = result === "ready";
  if (result === "db-unavailable") {
    ready.abort();
  } else if (ready.signal.aborted) {
    ready = new AbortController();
  }
  void setTimeout(500, undefined, { ref: false }).then(sample);
}

export async function databaseAdmission(
  requireReady = false,
): Promise<AbortSignal> {
  started ??= sample();
  await started;
  return requireReady && !probeHealthy ? AbortSignal.abort() : ready.signal;
}

export function databaseUnavailable(): Response {
  return new Response("Database unavailable", {
    status: 503,
    headers: { "cache-control": "no-store", "retry-after": "1" },
  });
}

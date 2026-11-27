// Runs inside the existing app container with its own DATABASE_URL and network
// namespace. One bounded sample for all readers, including both nameservers.
const { writeFileSync } = require("node:fs");
const { readFile } = require("node:fs/promises");
const { createServer, get } = require("node:http");
const { Pool } = require("pg");

if (!URL.canParse(process.env.DATABASE_URL)) {
  // eslint-disable-next-line no-console -- standalone edge service, stdout/stderr is its log
  console.error("HA readiness requires a valid application database URL");
  process.exit(1);
}
const dbPath =
  new URL(process.env.DATABASE_URL).hostname === "10.88.0.1"
    ? "remote"
    : "local";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  application_name: "ha-app-readiness",
  max: 1,
  connectionTimeoutMillis: 700,
  query_timeout: 750,
  statement_timeout: 650,
});
pool.on("error", () => {
  // Idle-client errors resurface on the next sampled query; keep the process alive.
});
let sampledAt = -Infinity;
let result;
let lastStatus;
async function readHostCpu() {
  try {
    const stat = await readFile("/proc/stat", "utf8");
    const aggregate = /^cpu[ \t]+([^\n]+)/m.exec(stat)?.[1];
    const ticks = aggregate?.trim().split(/\s+/).slice(0, 8).map(Number);
    if (
      ticks?.length === 8 &&
      ticks.every((n) => Number.isSafeInteger(n) && n >= 0)
    ) {
      return {
        total: ticks.reduce((total, n) => total + n, 0),
        steal: ticks[7],
      };
    }
  } catch {
    // The readiness check still works when procfs is unavailable.
  }
  return undefined;
}

function localAppAnswers() {
  return new Promise((resolve) => {
    const req = get("http://127.0.0.1:3000/robots.txt", (res) => {
      res.resume();
      resolve({
        state: res.statusCode === 200 ? "ready" : "unavailable",
        reason: `http-${res.statusCode}`,
      });
    });
    const timer = setTimeout(() => {
      resolve({ state: "unavailable", reason: "deadline" });
      req.destroy();
    }, 850);
    req.once("close", () => {
      clearTimeout(timer);
      resolve({ state: "unavailable", reason: "closed-before-response" });
    });
    req.once("error", (error) => {
      resolve({
        state: error.code === "ECONNREFUSED" ? "not-listening" : "unavailable",
        reason:
          error.code === "ECONNREFUSED" ? "connection-refused" : "socket-error",
      });
    });
  });
}
// A one-way large-packet failure can stall guest INSERTs while a short SQL
// request and a large reply still succeed. Exercise both directions.
const dbProbePayload = "x".repeat(16384);
async function databaseAnswers() {
  // Destroy a failed connection. A client-side query timeout by itself leaves
  // the socket and its outstanding command in the pool.
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "select $1::text as payload where not pg_is_in_recovery() and current_setting('transaction_read_only') = 'off'",
      [dbProbePayload],
    );
    const ok = rows[0]?.payload === dbProbePayload;
    client.release(!ok);
    return ok;
  } catch {
    client?.release(true);
    return false;
  }
}
async function sample() {
  const database = databaseAnswers();
  const before = await readHostCpu();
  const probeStartedAt = performance.now();
  const app = await localAppAnswers();
  const probeMs = Math.round(performance.now() - probeStartedAt);
  const after =
    app.state === "unavailable" && before ? await readHostCpu() : undefined;
  let cpuStealPct;
  if (before && after) {
    const total = after.total - before.total;
    const steal = after.steal - before.steal;
    if (total > 0 && steal >= 0 && steal <= total) {
      cpuStealPct = Math.round((100 * steal) / total);
    }
  }
  const db = await database;
  const cpuStealDuringProbe = probeMs >= 250 && cpuStealPct >= 30;
  // Reject fresh requests during a measured host-wide stall without changing
  // the admission behavior for an isolated renderer probe failure.
  result = !db
    ? "v1-db-unavailable"
    : app.state === "ready"
      ? "v1-ready"
      : app.state === "not-listening"
        ? "v1-renderer-not-listening"
        : cpuStealDuringProbe
          ? "v1-renderer-cpu-steal"
          : "v1-renderer-unavailable";
  sampledAt = performance.now();
  const status = `db=${db} app=${app.state} readiness=${result} rendererProbe=${app.reason}`;
  if (status !== lastStatus) {
    // eslint-disable-next-line no-console -- standalone edge service, stdout/stderr is its log
    console.log(
      new Date().toISOString(),
      status,
      `rendererProbeMs=${probeMs}`,
      `hostCpuStealPct=${cpuStealPct ?? "unmeasured"}`,
      ...(cpuStealDuringProbe
        ? ["evidence=hypervisor-cpu-steal-during-renderer-probe"]
        : []),
    );
  }
  lastStatus = status;
  setTimeout(sample, 700);
}
createServer((req, res) => {
  if (req.url !== "/_ha/ready" || !["GET", "HEAD"].includes(req.method)) {
    res.writeHead(404).end();
    return;
  }
  const readiness =
    performance.now() - sampledAt < 2300 ? result : "v1-unknown";
  const ok = readiness === "v1-ready";
  res
    .writeHead(ok ? 200 : 503, {
      "Cache-Control": "no-store",
      "X-HA-DB-Path": dbPath,
      "X-HA-Readiness": readiness,
      "Content-Type": "text/plain",
      ...(ok ? {} : { "Retry-After": "1" }),
    })
    .end(ok ? "ready\n" : "unavailable\n");
}).listen(3099, "0.0.0.0", () => {
  writeFileSync("/tmp/unbottled-ha-readiness.pid", `${String(process.pid)}\n`, {
    mode: 0o600,
  });
});
void sample();

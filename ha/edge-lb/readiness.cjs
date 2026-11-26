// Runs inside the existing app container with its own DATABASE_URL and network
// namespace. One bounded sample for all readers, including both nameservers.
const { writeFileSync } = require("node:fs");
const { createServer, get } = require("node:http");
const { Pool } = require("pg");

if (!URL.canParse(process.env.DATABASE_URL)) {
  process.stderr.write(
    "HA readiness requires a valid application database URL\n",
  );
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
pool.on("error", () => undefined);
let sampledAt = -Infinity;
let result;
let lastStatus;
function localAppAnswers() {
  return new Promise((resolve) => {
    const req = get("http://127.0.0.1:3000/robots.txt", (res) => {
      res.resume();
      resolve(res.statusCode === 200 ? "ready" : "unavailable");
    });
    const timer = setTimeout(() => {
      resolve("unavailable");
      req.destroy();
    }, 850);
    req.once("close", () => {
      clearTimeout(timer);
      resolve("unavailable");
    });
    req.once("error", (error) => {
      resolve(error.code === "ECONNREFUSED" ? "not-listening" : "unavailable");
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
  const [db, app] = await Promise.all([databaseAnswers(), localAppAnswers()]);
  sampledAt = performance.now();
  result = !db
    ? "v1-db-unavailable"
    : app === "ready"
      ? "v1-ready"
      : app === "not-listening"
        ? "v1-renderer-not-listening"
        : "v1-renderer-unavailable";
  const status = `db=${db} app=${app}`;
  if (status !== lastStatus) {
    process.stdout.write(`${new Date().toISOString()} ${status}\n`);
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

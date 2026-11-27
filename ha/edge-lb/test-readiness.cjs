// bun ha/edge-lb/test-readiness.cjs. All sockets use loopback and ephemeral ports.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const vm = require("node:vm");

async function until(check) {
  const end = Date.now() + 5000;
  while (Date.now() < end) {
    if (await check()) {
      return;
    }
    await Bun.sleep(30);
  }
  assert.fail("readiness did not transition within five seconds");
}

async function run() {
  let rendererReady = false;
  let writable = true;
  let dropLargeRequests = false;
  let cpuSteal = false;
  let totalTicks = 1000;
  let stealTicks = 0;
  const diagnostics = [];
  const renderer = http.createServer((...[, res]) => {
    if (rendererReady) {
      res.end("robots");
    }
    // A cold renderer accepts a connection and misses the 850 ms deadline.
  });
  await new Promise((resolve) => {
    renderer.listen(0, "127.0.0.1", resolve);
  });
  const rendererPort = renderer.address().port;
  await new Promise((resolve) => {
    renderer.close(resolve);
  });
  let companion;
  const get = http.get;
  const modules = {
    "node:fs": {
      writeFileSync() {
        // The readiness file is not asserted here.
      },
    },
    "node:fs/promises": {
      async readFile(path) {
        assert.equal(path, "/proc/stat");
        totalTicks += 100;
        stealTicks += cpuSteal ? 63 : 0;
        return `cpu  ${totalTicks - stealTicks} 0 0 0 0 0 0 ${stealTicks} 0 0\n`;
      },
    },
    "node:http": {
      get: (...[, cb]) =>
        get(`http://127.0.0.1:${rendererPort}/robots.txt`, cb),
      createServer(handler) {
        companion = http.createServer(handler);
        return { listen: () => companion.listen(0, "127.0.0.1") };
      },
    },
    pg: {
      Pool: class {
        on() {
          // Pool error events are not exercised by this fixture.
        }
        async connect() {
          return {
            query: async (sql, params) => {
              if (dropLargeRequests && params?.[0]?.length >= 1400) {
                return Promise.reject(
                  new Error("outgoing full-size packets lost"),
                );
              }
              const payload = sql.includes("$1::text")
                ? params[0]
                : "x".repeat(16384);
              return { rows: writable ? [{ payload }] : [] };
            },
            release() {
              // Nothing to release in the fixture client.
            },
          };
        }
      },
    },
  };
  vm.runInNewContext(
    fs.readFileSync(require.resolve("./readiness.cjs"), "utf8"),
    {
      require: (name) => modules[name],
      URL,
      performance,
      console: {
        log: (...fields) => diagnostics.push(fields.join(" ")),
        // eslint-disable-next-line no-console -- forwards the script under test to real stderr
        error: console.error,
      },
      setTimeout,
      clearTimeout,
      process: { env: { DATABASE_URL: "postgres://fixture.invalid/db" } },
    },
  );
  const url = `http://127.0.0.1:${companion.address().port}/_ha/ready`;
  const state = async (status, reason) => {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API: the HA readiness companion, not a vibe endpoint
    const r = await fetch(url);
    return r.status === status && r.headers.get("x-ha-readiness") === reason;
  };
  await until(() => state(503, "v1-renderer-not-listening"));
  await new Promise((resolve) => {
    renderer.listen(rendererPort, "127.0.0.1", resolve);
  });
  await until(() => state(503, "v1-renderer-unavailable"));
  cpuSteal = true;
  await until(() => state(503, "v1-renderer-cpu-steal"));
  assert.ok(
    diagnostics.some(
      (line) =>
        line.includes("rendererProbe=deadline") &&
        line.includes("hostCpuStealPct=63") &&
        line.includes("evidence=hypervisor-cpu-steal-during-renderer-probe"),
    ),
  );
  rendererReady = true;
  await until(() => state(200, "v1-ready"));
  cpuSteal = false;
  dropLargeRequests = true;
  await until(() => state(503, "v1-db-unavailable"));
  dropLargeRequests = false;
  await until(() => state(200, "v1-ready"));
  writable = false;
  await until(() => state(503, "v1-db-unavailable"));

  // Exercise the actual Bun application poller with the same response contract.
  let probeMode = "companion";
  const fixture = http.createServer((...[, res]) => {
    if (probeMode === "missing") {
      res.writeHead(404).end();
    }
    if (probeMode === "legacy") {
      res.writeHead(503).end("unavailable");
    }
    // The timeout case deliberately sends no headers.
  });
  await new Promise((resolve) => {
    fixture.listen(0, "127.0.0.1", resolve);
  });
  http.get = (...[, cb]) =>
    get(
      probeMode === "companion"
        ? url
        : `http://127.0.0.1:${fixture.address().port}/_ha/ready`,
      cb,
    );
  const { databaseAdmission } =
    await import("../../src/vibe/realtime/server/database-admission.ts");
  assert.equal((await databaseAdmission()).aborted, true);
  for (const mode of ["missing", "legacy", "timeout"]) {
    probeMode = mode;
    await until(
      async () =>
        !(await databaseAdmission()).aborted &&
        (await databaseAdmission(true)).aborted,
    );
    probeMode = "companion";
    await until(async () => (await databaseAdmission()).aborted);
  }
  writable = true;
  await until(async () => !(await databaseAdmission(true)).aborted);
  // eslint-disable-next-line no-console -- standalone test script output
  console.log(
    "PASS renderer timeout with and without CPU steal, warm recovery, DB rejection, missing/legacy/timed-out companion, strict readiness and recovery",
  );
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console -- standalone test script output
    console.error(error);
    process.exit(1);
  });

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
  const renderer = http.createServer((...[, res]) => {
    if (rendererReady) {
      res.end("robots");
    }
    // A cold renderer accepts a connection and misses the 850 ms deadline.
  });
  await new Promise((resolve) => {
    renderer.listen(0, "127.0.0.1", resolve);
  });
  let companion;
  const get = http.get;
  const modules = {
    "node:fs": { writeFileSync: () => undefined },
    "node:http": {
      get: (path, cb) => {
        assert.equal(path, "http://127.0.0.1:3000/robots.txt");
        return get(
          `http://127.0.0.1:${renderer.address().port}/robots.txt`,
          cb,
        );
      },
      createServer(handler) {
        companion = http.createServer(handler);
        return { listen: () => companion.listen(0, "127.0.0.1") };
      },
    },
    pg: {
      Pool: class {
        on() {
          return undefined;
        }
        async connect() {
          return {
            query: async () => ({
              rows: writable ? [{ payload: "x".repeat(16384) }] : [],
            }),
            release: () => undefined,
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
      setTimeout,
      clearTimeout,
      process: {
        env: { DATABASE_URL: "postgres://fixture.invalid/db" },
        stdout: process.stdout,
        stderr: process.stderr,
      },
    },
  );
  const url = `http://127.0.0.1:${companion.address().port}/_ha/ready`;
  const state = (status, reason) =>
    new Promise((resolve, reject) => {
      get(url, (response) => {
        response.resume();
        resolve(
          response.statusCode === status &&
            response.headers["x-ha-readiness"] === reason,
        );
      }).once("error", reject);
    });
  await until(() => state(503, "v1-renderer-unavailable"));
  rendererReady = true;
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
  http.get = (path, cb) => {
    assert.equal(path, "http://127.0.0.1:3099/_ha/ready");
    return get(
      probeMode === "companion"
        ? url
        : `http://127.0.0.1:${fixture.address().port}/_ha/ready`,
      cb,
    );
  };
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
  process.stdout.write(
    "PASS cold renderer timeout, warm recovery, DB rejection, missing/legacy/timed-out companion, strict readiness and recovery\n",
  );
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    process.stderr.write(`${error.stack ?? String(error)}\n`);
    process.exit(1);
  });

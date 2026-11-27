import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { JsonRpcClient, type RpcTransport } from "../providers/codex/rpc";

describe("JSON-RPC failures", () => {
  it("times out unanswered requests and closes pending requests", async () => {
    const transport: RpcTransport = {
      write: () => undefined,
      close: () => undefined,
      onLine: () => undefined,
      onClose: () => undefined,
    };
    const rpc = new JsonRpcClient(
      transport,
      { onNotification: () => undefined, onRequest: () => Promise.resolve({}) },
      10,
    );
    await assert.rejects(rpc.request("initialize"), /did not answer/);
    const pending = rpc.request("thread/start");
    await rpc.close();
    await assert.rejects(pending, /closed by the runner/);
    await assert.rejects(rpc.request("turn/start"), /not running/);
  });

  it("reports a synchronous write failure", async () => {
    const transport: RpcTransport = {
      write: () => {
        // oxlint-disable-next-line restricted-syntax -- intentional mock write failure
        throw new Error("broken stdin");
      },
      close: () => undefined,
      onLine: () => undefined,
      onClose: () => undefined,
    };
    const rpc = new JsonRpcClient(transport, {
      onNotification: () => undefined,
      onRequest: () => Promise.resolve({}),
    });
    await assert.rejects(rpc.request("initialize"), /broken stdin/);
    await rpc.close();
  });
});

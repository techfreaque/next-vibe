// A stand-in for `codex app-server` (JSON-RPC over stdio) for coding-agent tests.
// The prompt steers it: WRITE creates touch.txt in the working directory, HOLD waits for a steering
// message, FAIL fails the turn; anything else answers at once.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";

const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);
let threadId = "";
let cwd = "";
let resumed = false;

const finish = (text) => {
  send({
    method: "item/completed",
    params: {
      threadId,
      item: { type: "agentMessage", text, phase: "final_answer" },
    },
  });
  send({
    method: "turn/completed",
    params: { threadId, turn: { id: "turn-1", status: "completed" } },
  });
};

createInterface({ input: process.stdin }).on("line", (raw) => {
  const message = JSON.parse(raw);
  if (message.id === undefined) {
    return;
  }
  const reply = (result) => send({ id: message.id, result });
  switch (message.method) {
    case "thread/start":
      threadId = `thread-${Date.now()}`;
      cwd = message.params.cwd;
      reply({ thread: { id: threadId } });
      break;
    case "thread/resume":
      threadId = message.params.threadId;
      cwd = message.params.cwd;
      resumed = true;
      reply({ thread: { id: threadId } });
      break;
    case "turn/start": {
      const text = message.params.input[0].text;
      reply({ turn: { id: "turn-1" } });
      send({
        method: "turn/started",
        params: { threadId, turn: { id: "turn-1" } },
      });
      if (text.includes("WRITE")) {
        writeFileSync(join(cwd, "touch.txt"), "x");
      }
      if (text.includes("HOLD")) {
        break;
      }
      if (text.includes("FAIL")) {
        send({
          method: "turn/completed",
          params: {
            threadId,
            turn: {
              id: "turn-1",
              status: "failed",
              error: { message: "usage limit reached" },
            },
          },
        });
        break;
      }
      finish(`${resumed ? "resumed" : "new"}:${threadId}:${text}`);
      break;
    }
    case "turn/steer":
      reply({});
      finish(`steered:${message.params.input[0].text}`);
      break;
    case "turn/interrupt":
      reply({});
      send({
        method: "turn/completed",
        params: { threadId, turn: { id: "turn-1", status: "interrupted" } },
      });
      break;
    default:
      reply({});
  }
});

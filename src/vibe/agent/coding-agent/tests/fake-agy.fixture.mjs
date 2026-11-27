// A stand-in for `agy acp` (ACP JSON-RPC 2.0 over stdio) for coding-agent runner and verb tests.
// Directives in the prompt text control behavior:
//   HOLD         waits for a mid-turn `session/prompt` steer or `session/cancel`
//   HOLD_DOUBLE  waits for two mid-turn steers (first steer holds too, second finishes)
//   TOOL_THEN    emits a tool_call/tool_call_update before final answer
//   PERM         sends a `session/request_permission` server request before replying
//   FAIL         returns a JSON-RPC error from `session/prompt`
//   AUTH_FAIL    returns an OAuth error from `session/prompt`
//   CRASH        exits with code 2 before responding to `session/prompt`
//   anything else streams chunks and finishes with `stopReason: "end_turn"`.
import { appendFileSync } from "node:fs";
import { createInterface } from "node:readline";

const send = (message) =>
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);

const probeFile = process.env.AGY_PROBE_FILE;
const record = (entry) => {
  if (probeFile) {
    appendFileSync(probeFile, `${JSON.stringify(entry)}\n`);
  }
};

record({
  kind: "boot",
  cwd: process.cwd(),
  argv: process.argv.slice(2),
  envProbe: process.env.AGY_FIXTURE_ENV ?? null,
});

let sessionId = "";
let resumed = false;
let activePromptId = null;
let holdAfterFirstSteer = false;
let steerCount = 0;
let pendingPermissionResolve = null;

function emitChunk(text) {
  send({
    method: "session/update",
    params: {
      sessionId,
      update: {
        sessionUpdate: "agent_message_chunk",
        content: { type: "text", text },
      },
    },
  });
}

function finishPrompt(
  id,
  text,
  usage = { inputTokens: 10, outputTokens: 15, totalTokens: 25 },
) {
  if (text) {
    const mid = Math.max(1, Math.floor(text.length / 2));
    emitChunk(text.slice(0, mid));
    if (mid < text.length) {
      emitChunk(text.slice(mid));
    }
  }
  send({
    id,
    result: {
      stopReason: "end_turn",
      usage,
    },
  });
  if (activePromptId === id) {
    activePromptId = null;
  }
}

createInterface({ input: process.stdin }).on("line", (raw) => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return;
  }
  const message = JSON.parse(trimmed);
  record({ kind: "in", message });

  if (message.method === undefined && message.id !== undefined) {
    if (pendingPermissionResolve) {
      const done = pendingPermissionResolve;
      pendingPermissionResolve = null;
      done(message.result);
    }
    return;
  }

  if (message.method === "session/cancel") {
    if (activePromptId !== null) {
      const cancelledId = activePromptId;
      activePromptId = null;
      send({
        id: cancelledId,
        result: { stopReason: "cancelled" },
      });
    }
    return;
  }

  if (message.id === undefined) {
    return;
  }

  const reply = (result) => send({ id: message.id, result });
  const fail = (code, msg) =>
    send({ id: message.id, error: { code, message: msg } });

  switch (message.method) {
    case "initialize":
      reply({
        protocolVersion: 1,
        agentCapabilities: {
          loadSession: true,
          sessionCapabilities: { resume: {} },
        },
      });
      break;
    case "session/new":
      sessionId = `agy-session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      resumed = false;
      reply({ sessionId });
      break;
    case "session/resume":
      sessionId = message.params.sessionId;
      resumed = true;
      reply({ sessionId });
      break;
    case "session/set_model":
      reply({});
      break;
    case "session/set_config_option":
      reply({ configOptions: [] });
      break;
    case "session/prompt": {
      const text = message.params?.prompt?.[0]?.text ?? "";
      if (activePromptId !== null) {
        const previousId = activePromptId;
        activePromptId = message.id;
        steerCount += 1;
        send({
          id: previousId,
          result: { stopReason: "end_turn" },
        });
        if (holdAfterFirstSteer && steerCount === 1) {
          emitChunk("first-step-narration");
          send({
            method: "session/update",
            params: {
              sessionId,
              update: {
                sessionUpdate: "tool_call",
                title: "echo step-1",
                status: "in_progress",
              },
            },
          });
          return;
        }
        finishPrompt(message.id, `steered:${text}`);
        return;
      }

      activePromptId = message.id;
      if (text.includes("CRASH")) {
        process.stderr.write("fatal acp crash\n");
        process.exit(2);
      }
      if (text.includes("AUTH_FAIL")) {
        activePromptId = null;
        fail(-32001, "OAuth access_token expired");
        return;
      }
      if (text.includes("FAIL")) {
        activePromptId = null;
        fail(-32603, "model execution failed");
        return;
      }
      if (text.includes("PERM")) {
        pendingPermissionResolve = (permResult) => {
          const chosen = permResult?.outcome?.optionId ?? "none";
          finishPrompt(message.id, `perm:${chosen}`);
        };
        send({
          id: "perm-1",
          method: "session/request_permission",
          params: {
            sessionId,
            options: [
              { optionId: "deny", kind: "reject_once" },
              { optionId: "allow-all", kind: "allow_always" },
            ],
          },
        });
        return;
      }
      if (text.includes("TOOL_THEN")) {
        emitChunk("working...");
        send({
          method: "session/update",
          params: {
            sessionId,
            update: {
              sessionUpdate: "tool_call",
              title: "echo 1 >> count.txt",
              status: "in_progress",
            },
          },
        });
        send({
          method: "session/update",
          params: {
            sessionId,
            update: {
              sessionUpdate: "tool_call_update",
              title: "echo 1 >> count.txt",
              status: "completed",
            },
          },
        });
        finishPrompt(message.id, "Final after tool");
        return;
      }
      if (text.includes("HOLD_DOUBLE")) {
        holdAfterFirstSteer = true;
        return;
      }
      if (text.includes("HOLD")) {
        return;
      }
      finishPrompt(
        message.id,
        `${resumed ? "resumed" : "new"}:${sessionId}:${text}`,
      );
      break;
    }
    default:
      reply({});
  }
});

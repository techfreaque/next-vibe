import { expect, it, mock, type Mock } from "bun:test";
import { streamText } from "ai";
import { createEndpointLogger } from "next-vibe/logger/server";

import { createUncensoredAI } from "./uncensored-ai";

function rejected(code: string, type: string, message: string): Response {
  return Response.json(
    {
      error: {
        type: "invalid_request_error",
        message: `upstream API error: 429 - ${JSON.stringify({ error: { code, type, message } })}`,
      },
    },
    { status: 400, headers: { "retry-after-ms": "1" } },
  );
}

function modelWith(firstResponse: Response): {
  model: ReturnType<ReturnType<typeof createUncensoredAI>["chat"]>;
  send: Mock<() => Promise<Response>>;
  warn: Mock<() => undefined>;
} {
  let attempts = 0;
  const send = mock(() =>
    Promise.resolve(
      ++attempts === 1
        ? firstResponse
        : Response.json({
            id: "fixture",
            model: "uncensored-lm",
            choices: [
              {
                index: 0,
                message: { role: "assistant", content: "Recovered" },
                finish_reason: "stop",
              },
            ],
          }),
    ),
  );
  const logger = createEndpointLogger(false, "en-US");
  const warn = mock(() => undefined);
  const provider = createUncensoredAI(
    { ...logger, warn },
    Object.assign(send, { preconnect: fetch.preconnect }),
  );
  return { model: provider.chat("uncensored-lm"), send, warn };
}

it("retries a rejected pre-stream concurrency limit through the SDK", async () => {
  const { model, send, warn } = modelWith(
    rejected(
      "429",
      "rate_limit_exceeded",
      "Concurrent request limit reached. The limit applies per account.",
    ),
  );
  const result = streamText({ model, prompt: "offline fixture" });
  expect(await result.text).toBe("Recovered");
  expect(send).toHaveBeenCalledTimes(2);
  expect(warn).toHaveBeenCalledWith(
    "[UncensoredAI] Upstream concurrency limit rejected request",
    { proxyStatus: 400, upstreamStatus: 429, hasRetryAfter: true },
  );
});

it("preserves a validation rejection even when its body mentions concurrency", async () => {
  const { model, send, warn } = modelWith(
    rejected("400", "invalid_parameter", "Concurrent request limit reached"),
  );
  const result = streamText({
    model,
    prompt: "offline fixture",
    onError: () => undefined,
  });
  const errors = [];
  for await (const part of result.fullStream) {
    if (part.type === "error") errors.push(part.type);
  }
  expect(errors).toEqual(["error"]);
  expect(send).toHaveBeenCalledTimes(1);
  expect(warn).not.toHaveBeenCalled();
});

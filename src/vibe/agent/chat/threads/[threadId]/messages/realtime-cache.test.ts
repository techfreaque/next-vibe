import { describe, expect, it } from "bun:test";
import type { WidgetData } from "next-vibe/core/utils/json";
import { buildEventFieldSchema } from "next-vibe/realtime/core/event-field-schema";
import { applyPartialToCache } from "next-vibe/unified-ui/hooks/cache-merger";

import { ChatMessageRole } from "../../../enum";
import definitions from "./definition";

const messageId = "11111111-1111-4111-8111-111111111111";
const threadId = "22222222-2222-4222-8222-222222222222";
const createdAt = "2026-11-19T10:00:00.000Z";
const updatedAt = "2026-11-19T10:00:01.000Z";

const wireMessage = {
  id: messageId,
  threadId,
  role: ChatMessageRole.USER,
  authorName: "Guest",
  content: "Hello",
  createdAt,
  updatedAt,
};

const hydratedMessage = {
  ...wireMessage,
  createdAt: new Date(createdAt),
  updatedAt: new Date(updatedAt),
};

function parsePatch(
  eventName: "message-created" | "error",
  messages: { id: string; updatedAt: string }[],
): WidgetData {
  const { GET } = definitions;
  const fields = GET.events?.[eventName].responseFields;
  expect(fields).toBeDefined();
  return buildEventFieldSchema(GET.responseSchema, fields).parse({ messages });
}

describe("chat message realtime cache", () => {
  it("hydrates dates when a public message is upserted for a viewer", () => {
    const patch = parsePatch("message-created", [wireMessage]);
    const result = applyPartialToCache({ messages: [] }, patch, true);

    expect(result).toEqual({ messages: [hydratedMessage] });
  });

  it("replaces an optimistic timestamp with the confirmed timestamp", () => {
    const optimistic = {
      ...wireMessage,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
    const patch = parsePatch("message-created", [wireMessage]);
    const result = applyPartialToCache({ messages: [optimistic] }, patch, true);

    expect(result).toEqual({ messages: [hydratedMessage] });
  });

  it("hydrates a partial merge and keeps omitted fields", () => {
    const message = { ...hydratedMessage, updatedAt: new Date(createdAt) };
    const patch = parsePatch("error", [{ id: messageId, updatedAt }]);
    const result = applyPartialToCache({ messages: [message] }, patch);

    expect(result).toEqual({ messages: [hydratedMessage] });
    expect(applyPartialToCache(result, patch)).toBe(result);
  });
});

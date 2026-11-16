import { describe, expect, it } from "bun:test";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import type { ChatMessage, ToolCall } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { toAiSdkMessages } from "./convert";

const threadId = "00000000-0000-4000-8000-000000000001";
let seq = 0;

function toolMessage(toolCall: ToolCall): ChatMessage {
  seq++;
  return {
    id: `00000000-0000-4000-8000-${String(seq).padStart(12, "0")}`,
    threadId,
    role: ChatMessageRole.TOOL,
    content: null,
    parentId: null,
    sequenceId: null,
    authorId: null,
    authorName: null,
    isAI: true,
    model: null,
    skill: null,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    metadata: { toolCall },
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(1_700_000_000_000 + seq * 1000),
    updatedAt: new Date(1_700_000_000_000 + seq * 1000),
  };
}

function call(
  id: string,
  args: ToolCall["args"],
  result: ToolCall["result"] = { ok: true },
): ToolCall {
  return {
    toolCallId: id,
    toolName: "execute-tool",
    args,
    result,
    isPartial: false,
  };
}

function toolCallIds(
  messages: Awaited<ReturnType<typeof toAiSdkMessages>>,
): string[] {
  const ids: string[] = [];
  for (const m of messages) {
    if (m.role === "assistant" && Array.isArray(m.content)) {
      for (const part of m.content) {
        if (part.type === "tool-call") {
          ids.push(part.toolCallId);
        }
      }
    }
  }
  return ids;
}

describe("toAiSdkMessages tool-call id uniqueness", () => {
  const logger = createEndpointLogger(false, defaultLocale);

  it("keeps calls whose provider-numbered ids repeat across steps", async () => {
    const result = await toAiSdkMessages(
      [
        toolMessage(call("execute-tool_0", { toolName: "a" })),
        toolMessage(call("execute-tool_0", { toolName: "b" })),
      ],
      logger,
      "UTC",
      DefaultFolderId.PRIVATE,
      undefined,
      false,
      rootlessToolExecutionContext(),
    );
    expect(toolCallIds(result)).toEqual(["execute-tool_0", "execute-tool_0_dup2"]);
  });

  it("drops a true duplicate (same id, same args)", async () => {
    const result = await toAiSdkMessages(
      [
        toolMessage(call("execute-tool_1", { toolName: "a" })),
        toolMessage(call("execute-tool_1", { toolName: "a" })),
      ],
      logger,
      "UTC",
      DefaultFolderId.PRIVATE,
      undefined,
      false,
      rootlessToolExecutionContext(),
    );
    expect(toolCallIds(result)).toEqual(["execute-tool_1"]);
  });

  it("keeps a same-args retry whose outcome differs", async () => {
    const result = await toAiSdkMessages(
      [
        toolMessage(call("execute-tool_2", { toolName: "a" }, { ok: false })),
        toolMessage(call("execute-tool_2", { toolName: "a" }, { ok: true })),
      ],
      logger,
      "UTC",
      DefaultFolderId.PRIVATE,
      undefined,
      false,
      rootlessToolExecutionContext(),
    );
    expect(toolCallIds(result)).toEqual(["execute-tool_2", "execute-tool_2_dup2"]);
  });
});

describe("toAiSdkMessages resolved wakeUp dispatch", () => {
  const logger = createEndpointLogger(false, defaultLocale);

  it("keeps the dispatch taskId once its deferred result exists", async () => {
    const dispatch: ToolCall = {
      ...call(
        "call-wu",
        { toolName: "cortex-write", callbackMode: "wakeUp" },
        { taskId: "local-wu-call-wu", hint: "Dispatched" },
      ),
      callbackMode: "wakeUp",
    };
    const deferred: ToolCall = {
      ...call(
        "call-wu",
        { toolName: "cortex-write", callbackMode: "wakeUp" },
        { responsePath: "/memories/x" },
      ),
      callbackMode: "wakeUp",
      isDeferred: true,
      originalToolCallId: "call-wu",
    };
    for (const isRevival of [true, false]) {
      const result = await toAiSdkMessages(
        [toolMessage(dispatch), toolMessage(deferred)],
        logger,
        "UTC",
        DefaultFolderId.PRIVATE,
        undefined,
        isRevival,
        rootlessToolExecutionContext(),
      );
      const serialized = JSON.stringify(result);
      expect(serialized).toContain("/memories/x");
      // Every mode marks the deferred row as the dispatch's outcome.
      expect(serialized).toContain(
        "The cortex-write result above was delivered automatically after its wakeUp dispatch (task local-wu-call-wu)",
      );
      if (isRevival) {
        // The dispatch row stays visible with the taskId it returned.
        expect(serialized).toContain("local-wu-call-wu");
        expect(serialized).toContain("deferred-call-wu");
      }
    }
  });
});

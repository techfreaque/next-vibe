/**
 * Chain-tip rules for the StreamLoop. Regression: a step that opened with a
 * bare tool call right after a mid-stream compacting hung its placeholder
 * assistant AND its tool row off the summary, branching the thread
 * (route.compacting C2: summary with an assistant and an execute-tool child).
 */

import { describe, expect, it } from "bun:test";

import {
  advanceChainTip,
  type ChainTip,
  chainPlaceholderAssistant,
  resolveToolParentId,
} from "./chain-tip";

/** Tip right after prepareStep compacted (or injected a queued message):
 *  everything points at the inserted message. */
function tipAfterInsert(insertedId: string): ChainTip {
  return {
    currentParentId: insertedId,
    lastParentId: insertedId,
    pendingQueueParentId: insertedId,
  };
}

/** Replays the onToolCall sequence for a bare tool call: placeholder written
 *  under the tip, tool parent resolved, tip advanced to the tool row. */
function bareToolCall(
  tip: ChainTip,
  placeholderId: string,
  toolId: string,
): { placeholderParent: string | null; toolParent: string | null } {
  const placeholderParent = tip.currentParentId;
  chainPlaceholderAssistant(tip, placeholderId, placeholderParent);
  const toolParent = resolveToolParentId(tip, placeholderId);
  advanceChainTip(tip, toolId, { clearPendingQueueParent: false });
  return { placeholderParent, toolParent };
}

describe("chain tip", () => {
  it("bare tool call after compacting chains summary -> placeholder -> tool", () => {
    const tip = tipAfterInsert("summary");
    const { placeholderParent, toolParent } = bareToolCall(
      tip,
      "placeholder",
      "tool",
    );
    expect(placeholderParent).toBe("summary");
    expect(toolParent).toBe("placeholder");
    expect(tip.pendingQueueParentId).toBeNull();
    expect(tip.currentParentId).toBe("tool");
  });

  it("bare tool call after an injected queued message chains under it once", () => {
    const tip = tipAfterInsert("queued-user");
    const { placeholderParent, toolParent } = bareToolCall(
      tip,
      "placeholder",
      "tool",
    );
    expect(placeholderParent).toBe("queued-user");
    expect(toolParent).toBe("placeholder");
    expect(tip.pendingQueueParentId).toBeNull();
  });

  it("text first, then a tool call: tool hangs off the assistant", () => {
    const tip = tipAfterInsert("summary");
    advanceChainTip(tip, "assistant", { clearPendingQueueParent: true });
    expect(tip.pendingQueueParentId).toBeNull();
    expect(resolveToolParentId(tip, "assistant")).toBe("assistant");
  });

  it("compacting race: summary written during the assistant flush takes the tool row", () => {
    // Step already had its assistant; the consumer awaits its flush while
    // prepareStep compacts and moves the tip to the summary.
    const tip: ChainTip = {
      currentParentId: "assistant",
      lastParentId: "assistant",
      pendingQueueParentId: null,
    };
    Object.assign(tip, tipAfterInsert("summary"));
    expect(resolveToolParentId(tip, "assistant")).toBe("summary");
    expect(tip.pendingQueueParentId).toBeNull();
  });

  it("placeholder does not override a tip moved while it was written", () => {
    const tip: ChainTip = {
      currentParentId: "prev-tool",
      lastParentId: "prev-tool",
      pendingQueueParentId: null,
    };
    // compacting lands during the placeholder write
    Object.assign(tip, tipAfterInsert("summary"));
    chainPlaceholderAssistant(tip, "placeholder", "prev-tool");
    expect(tip.currentParentId).toBe("summary");
    expect(tip.pendingQueueParentId).toBe("summary");
  });

  it("without any override a bare tool call chains placeholder -> tool", () => {
    const tip: ChainTip = {
      currentParentId: "prev-tool",
      lastParentId: "prev-tool",
      pendingQueueParentId: null,
    };
    const { toolParent } = bareToolCall(tip, "placeholder", "tool");
    expect(toolParent).toBe("placeholder");
    expect(tip.currentParentId).toBe("tool");
  });
});

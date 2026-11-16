/**
 * Empty-answer guards (prod 11-14..16: turns that ended on the silent
 * rename-thread + endLoop before any answer text showed a blank bubble but
 * were billed in full).
 */

import { describe, expect, it } from "bun:test";

import { creditsWithoutPlatformMarkup } from "../../../models/models";
import { endLoopNeedsAnswerStep, isThreadRenameCall } from "./helpers";

describe("isThreadRenameCall", () => {
  it("matches the rename direct, via execute-tool and relayed", () => {
    expect(isThreadRenameCall("rename-thread", undefined)).toBe(true);
    expect(isThreadRenameCall("execute-tool", "rename-thread")).toBe(true);
    expect(isThreadRenameCall("execute-tool", "thea__rename-thread")).toBe(
      true,
    );
  });

  it("leaves every other endLoop tool alone", () => {
    expect(isThreadRenameCall("execute-tool", "generate_image")).toBe(false);
    expect(isThreadRenameCall("execute-tool", undefined)).toBe(false);
    expect(isThreadRenameCall("self-instance-id", undefined)).toBe(false);
  });
});

describe("endLoopNeedsAnswerStep", () => {
  it("applies to interactive turns, not background tasks", () => {
    expect(endLoopNeedsAnswerStep({})).toBe(true);
    expect(endLoopNeedsAnswerStep({ cronTaskId: "task-1" })).toBe(false);
  });
});

describe("creditsWithoutPlatformMarkup", () => {
  it("bills the provider's share only, rounded up to 0.01", () => {
    // 0.26 credits incl. 30% markup -> 0.20 provider cost
    expect(creditsWithoutPlatformMarkup(0.26)).toBe(0.2);
    // 6.5 fixed-price turn -> 5.0
    expect(creditsWithoutPlatformMarkup(6.5)).toBe(5);
    expect(creditsWithoutPlatformMarkup(0.01)).toBe(0.01);
    expect(creditsWithoutPlatformMarkup(0)).toBe(0);
  });
});

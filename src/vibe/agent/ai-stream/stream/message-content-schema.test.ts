/**
 * MCS-1..4: ai-stream `content` accepts a string or a list of text parts.
 */

import { describe, expect, it } from "bun:test";

import { AGENT_MESSAGE_LENGTH } from "../../chat/constants";
import { messageContentSchema } from "./message-content-schema";

describe("messageContentSchema", () => {
  it("MCS-1: a string passes unchanged", () => {
    expect(messageContentSchema.parse("Hello")).toBe("Hello");
  });

  it("MCS-2: text parts are joined", () => {
    expect(
      messageContentSchema.parse([
        { type: "text", text: "one" },
        { type: "text", text: "two" },
        { type: "text", text: "three" },
      ]),
    ).toBe("one\ntwo\nthree");
  });

  it("MCS-3: non-text parts still fail", () => {
    expect(
      messageContentSchema.safeParse([
        { type: "text", text: "look" },
        { type: "image", image: "https://example.com/a.png" },
      ]).success,
    ).toBe(false);
  });

  it("MCS-4: the length limit applies to the joined text", () => {
    const half = "x".repeat(Math.ceil(AGENT_MESSAGE_LENGTH / 2) + 1);
    expect(
      messageContentSchema.safeParse([
        { type: "text", text: half },
        { type: "text", text: half },
      ]).success,
    ).toBe(false);
  });
});

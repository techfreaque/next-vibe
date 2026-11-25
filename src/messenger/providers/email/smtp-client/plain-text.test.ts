import { expect, test } from "bun:test";

import { resolvePlainText } from "./plain-text";

const html =
  '<html><body><div data-skip-in-text="true">Preview line</div>' +
  '<img src="cid:logo@unbottled.ai" alt="unbottled.ai">' +
  '<p>Your code is 482913.</p><a href="https://unbottled.ai/en-US">Open unbottled.ai</a></body></html>';

test("an explicit text part wins", () => {
  expect(resolvePlainText(html, "Hand written")).toBe("Hand written");
});

test("HTML-only mail gets a derived text part without preview or images", () => {
  const text = resolvePlainText(html, undefined);
  expect(text).toContain("Your code is 482913.");
  expect(text).toContain("https://unbottled.ai/en-US");
  expect(text).not.toContain("Preview line");
  expect(text).not.toContain("cid:");
  expect(text).not.toContain("<");
});

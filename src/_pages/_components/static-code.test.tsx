/**
 * StaticCode renders highlighted markup without hooks (server components)
 * and with class-based tokens, so the HTML/RSC payload carries no per-token
 * style objects.
 */

import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { StaticCode, StaticCodeFile } from "./static-code";

describe("StaticCode", () => {
  test("highlights registered languages with token classes", () => {
    const html = renderToStaticMarkup(
      <StaticCode code={'curl -H "Authorization: x"'} language="bash" />,
    );
    expect(html).toContain("vibe-static-code");
    expect(html).toContain('class="token string"');
    expect(html).not.toContain("<span style=");
  });

  test("renders identical module tokens before and after Markdown loads Prism", async () => {
    const snippet = (
      <StaticCode code={'import Client from "sdk";'} language="javascript" />
    );
    const before = renderToStaticMarkup(snippet);
    await import("react-syntax-highlighter");
    expect(renderToStaticMarkup(snippet)).toBe(before);
    expect(before).toContain('class="token keyword module"');
  });

  test("falls back to plain text for unknown languages", () => {
    const html = renderToStaticMarkup(
      <StaticCode code="plain words" language="text" />,
    );
    expect(html).toContain("plain words");
    expect(html).not.toContain("token");
  });

  test("file card shows the filename", () => {
    const html = renderToStaticMarkup(
      <StaticCodeFile
        code={'print("hi")'}
        language="python"
        filename="hi.py"
      />,
    );
    expect(html).toContain("hi.py");
    expect(html).toContain("token");
  });
});

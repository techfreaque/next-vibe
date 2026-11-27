import { expect, it } from "bun:test";

import { htmlToMarkdown } from "./html-to-markdown";

it("resolves scraper page images against the final fetched URL", () => {
  const markup = [
    '<img src="/static/menu.svg" alt="Menu">',
    '<img src="../tile.png" alt="Tile" title="A map">',
    '<img src="//cdn.example.test/logo.png" alt="Logo">',
    '<img src="https://cdn.example.test/photo.png" alt="Photo">',
    '<img src="" alt="Empty">',
  ].join("\n");
  const markdown = htmlToMarkdown(
    markup,
    "https://example.test/redirected/page",
  );
  expect(markdown).toContain("![Menu](https://example.test/static/menu.svg)");
  expect(markdown).toContain('![Tile](https://example.test/tile.png "A map")');
  expect(markdown).toContain("![Logo](https://cdn.example.test/logo.png)");
  expect(markdown).toContain("![Photo](https://cdn.example.test/photo.png)");
  expect(markdown).not.toContain("Empty");
});

it("never passes inline image payloads into the tool result", () => {
  const markup = [
    '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==" alt="Chart">',
    '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">',
    '<a href="data:image/svg+xml,%3Csvg%3E%3C/svg%3E">icon</a>',
    '<img src="https://cdn.example.test/photo.png" alt="Photo">',
  ].join("\n");
  const markdown = htmlToMarkdown(markup, "https://example.test/page");
  expect(markdown).not.toContain("data:image/");
  expect(markdown).toContain("[image: Chart]");
  expect(markdown).toContain("![Photo](https://cdn.example.test/photo.png)");
});

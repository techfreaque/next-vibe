import TurndownService from "turndown";

import { stripInlineImageData } from "./inline-image-data";

/** Convert documents against the final fetched URL, including redirects. */
export function htmlToMarkdown(html: string, sourceUrl: string): string {
  const converter = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
    strongDelimiter: "**",
  });
  converter.addRule("strikethrough", {
    filter: ["del", "s"],
    replacement: (content) => `~~${content}~~`,
  });
  converter.remove(["script", "style", "noscript"]);

  converter.addRule("resolvedImage", {
    filter: "img",
    replacement: (content, node) => {
      const src = node.getAttribute("src")?.trim();
      if (!src) {
        return content;
      }
      const alt = converter.escape(node.getAttribute("alt") ?? "");
      if (/^data:/i.test(src)) {
        // Inline payload: keep only the description.
        return alt ? `[image: ${alt}]` : "";
      }
      const title = node.getAttribute("title")?.replaceAll('"', '\\"');
      let resolved = src;
      try {
        resolved = new URL(src, sourceUrl).href;
      } catch {
        // Keep malformed URLs visible in the Markdown for diagnosis.
      }
      const escaped = resolved.replace(/[<>()]/g, "\\$&");
      const destination = escaped.includes(" ") ? `<${escaped}>` : escaped;
      return `![${alt}](${destination}${title ? ` "${title}"` : ""})`;
    },
  });
  return stripInlineImageData(converter.turndown(html));
}

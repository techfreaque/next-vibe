import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Markdown } from "./markdown";

describe("Markdown media", () => {
  it("renders a video link written as an image as playable video", () => {
    const html = renderToStaticMarkup(
      <Markdown content="![Recorded clip](/api/chat/files/example/clip.mp4?download=0)" />,
    );
    expect(html).toContain("<video");
    expect(html).toContain('controls=""');
    expect(html).toContain('src="/api/chat/files/example/clip.mp4?download=0"');
    expect(html).not.toContain("<img");
  });

  it("keeps image URLs with a video extension in their query as images", () => {
    const html = renderToStaticMarkup(
      <Markdown content="![Thumbnail](/images/thumbnail.png?for=clip.mp4)" />,
    );
    expect(html).toContain("<img");
    expect(html).not.toContain("<video");
  });
});

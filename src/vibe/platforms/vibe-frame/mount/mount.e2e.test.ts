/**
 * E2E: vibe-frame mount — the embed script on a third-party page asks the
 * server for ready-to-load iframe URLs. Driven for real (a foreign-origin host
 * page loading /vibe-frame/vibe-frame.js) and through the /tools form.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import mountEndpoints from "./definition";

const endpoint = mountEndpoints.POST;
/**
 * The third-party host page, served (intercepted) on the server's own origin:
 * Chrome blocks a foreign origin from loading a loopback server (Private
 * Network Access), so a real cross-origin host can't reach a local dev server.
 * Cross-origin CORS for this endpoint is covered by the middleware/preflight.
 */
const HOST_PATH = "/__e2e-embed-host";

function hostPage(serverUrl: string): string {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Embed host</title></head>
  <body>
    <h1>Third-party site</h1>
    <div id="vibe-contact"></div>
    <script>
      globalThis.vibeFrameConfig = {
        serverUrl: ${JSON.stringify(serverUrl)},
        locale: "en-GLOBAL",
        integrations: [{ endpoint: "contact_POST", target: "#vibe-contact" }],
      };
    </script>
    <script src="${serverUrl}/vibe-frame/vibe-frame.js"></script>
  </body>
</html>`;
}

describe("E2E: vibe-frame mount", () => {
  const e2e = useE2E("vibe/platforms/vibe-frame/mount");

  e2e.it("the embed script on a host page mounts a frame", async ({ page, baseUrl, capture }) => {
    await page.route(`${baseUrl}${HOST_PATH}/**`, (route) =>
      route.fulfill({ contentType: "text/html", body: hostPage(baseUrl) }),
    );

    const call = await capture(
      endpoint,
      async () => {
        await page.goto(`${baseUrl}${HOST_PATH}/landing`);
      },
      60_000,
    );
    expect(call.requestBody).toMatchObject({
      integrations: [{ endpoint: "contact_POST" }],
    });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    const [widget] = call.response.data.widgets;
    expect(widget?.widgetUrl).toContain("/frame/");

    // The iframe is pointed at the minted URL inside the host's target element
    await page.waitForFunction(
      (src) =>
        document.querySelector("#vibe-contact iframe")?.getAttribute("src") ===
        src,
      widget?.widgetUrl,
    );
  });

  e2e.it("mints frame URLs from the form", async ({ open }) => {
    const form = await open(endpoint);
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
  });
});

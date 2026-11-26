import { spawnSync } from "node:child_process";

import { describe, expect, it } from "vitest";

describe("Route registration", () => {
  it("registers tools and exposes remote defaults before loading the execution graph", () => {
    // Read the actual Bun module cache in an isolated process. The test runner
    // itself loads authentication as part of its setup.
    const probe = spawnSync(
      process.execPath,
      [
        "-e",
        `
      const implementation = require.resolve("./src/vibe/core/route/handler");
      const { endpointHandler } = await import("./src/vibe/core/route/single");
      const { default: endpoint } = await import("./src/users/summary/definition");
      const defaults = async () => ({});
      const fields = {};
      const result = endpointHandler({
        endpoint: endpoint.GET, requestDefaults: defaults, fieldDefaults: fields,
        handler: async ({ t }) => ({ success: false, message: t("errors.forbidden.title") })
      });
      console.log(JSON.stringify({
        eager: Boolean(require.cache[implementation]),
        next: typeof result.GET,
        generic: typeof result.tools.GET,
        definitions: result.definitions === endpoint.GET,
        sameDefaults: result.tools.GET.requestDefaults === defaults,
        sameFields: result.tools.GET.fieldDefaults === fields
      }));
    `,
      ],
      { encoding: "utf8", timeout: 10000 },
    );
    expect(probe.status).toBe(0);
    expect(JSON.parse(probe.stdout.trim())).toEqual({
      eager: false,
      next: "function",
      generic: "function",
      definitions: true,
      sameDefaults: true,
      sameFields: true,
    });
  });
});

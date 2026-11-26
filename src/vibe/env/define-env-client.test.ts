import { afterEach, describe, expect, it } from "bun:test";
import { z } from "zod";

import { runtimeEnvPlaceholder } from "../platforms/cli/runtime/runtime-env-placeholders";
import { defineEnvClient } from "./define-env-client";

const APP_URL = "NEXT_PUBLIC_APP_URL";
const MODE = "NEXT_PUBLIC_VIBE_MODE";
const FLAG = "NEXT_PUBLIC_FLAG";

function fields(appUrl: string, mode: string, flag: string): {
  [APP_URL]: { schema: z.ZodDefault<z.ZodString>; value: string; example: string };
  [MODE]: {
    schema: z.ZodDefault<z.ZodEnum<{ dev: "dev"; cloud: "cloud" }>>;
    value: string;
    example: string;
  };
  [FLAG]: { schema: z.ZodOptional<z.ZodString>; value: string; example: string };
} {
  return {
    [APP_URL]: {
      schema: z.string().url().default("http://localhost:3000"),
      value: appUrl,
      example: "http://localhost:3000",
    },
    [MODE]: {
      schema: z.enum(["dev", "cloud"]).default("dev"),
      value: mode,
      example: "dev",
    },
    [FLAG]: { schema: z.string().optional(), value: flag, example: "x" },
  };
}

describe("defineEnvClient runtime env sentinels", () => {
  const hadWindow = "window" in globalThis;
  afterEach(() => {
    globalThis.__vibeEnvPlaceholderLeaks = undefined;
    if (!hadWindow) {
      Reflect.deleteProperty(globalThis, "window");
    }
  });

  it("falls back to defaults and records the keys instead of throwing at load", () => {
    Reflect.set(globalThis, "window", globalThis);
    const { envClient } = defineEnvClient(
      fields(
        runtimeEnvPlaceholder(APP_URL),
        runtimeEnvPlaceholder(MODE),
        runtimeEnvPlaceholder(FLAG),
      ),
      { name: "core" },
    );
    expect(envClient[APP_URL]).toBe("http://localhost:3000");
    expect(envClient[MODE]).toBe("dev");
    // A sentinel its schema accepts keeps the previous behaviour.
    expect(envClient[FLAG]).toBe(runtimeEnvPlaceholder(FLAG));
    expect(globalThis.__vibeEnvPlaceholderLeaks).toEqual([
      `core:${APP_URL}`,
      `core:${MODE}`,
    ]);
  });

  it("leaves patched values untouched and records nothing", () => {
    Reflect.set(globalThis, "window", globalThis);
    const { envClient } = defineEnvClient(
      fields("https://unbottled.ai", "cloud", "on"),
      { name: "core" },
    );
    expect(envClient[APP_URL]).toBe("https://unbottled.ai");
    expect(envClient[MODE]).toBe("cloud");
    expect(globalThis.__vibeEnvPlaceholderLeaks).toBeUndefined();
  });
});

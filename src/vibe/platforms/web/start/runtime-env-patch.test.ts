import { describe, expect, it } from "bun:test";

import { runtimeEnvPlaceholder } from "../../cli/runtime/runtime-env-placeholders";
import { replaceRuntimeEnvSentinels } from "./runtime-env-patch";

function sentinel(
  key: string,
  value: string,
): { sentinel: Buffer; value: Buffer } {
  return {
    sentinel: Buffer.from(runtimeEnvPlaceholder(key), "utf8"),
    value: Buffer.from(value, "utf8"),
  };
}

describe("replaceRuntimeEnvSentinels", () => {
  const sentinels = [
    sentinel("NEXT_PUBLIC_APP_URL_EXTRA", "longer"),
    sentinel("NEXT_PUBLIC_APP_URL", "https://unbottled.ai"),
    sentinel("NEXT_PUBLIC_EMPTY", ""),
  ];

  it("returns undefined for a file without sentinels", () => {
    expect(
      replaceRuntimeEnvSentinels(Buffer.from("const a = 1;"), sentinels),
    ).toBeUndefined();
  });

  it("replaces every occurrence and keeps multibyte text intact", () => {
    const source = `const u="${runtimeEnvPlaceholder("NEXT_PUBLIC_APP_URL")}";const t="Grüße 日本";const e="${runtimeEnvPlaceholder("NEXT_PUBLIC_EMPTY")}";const v="${runtimeEnvPlaceholder("NEXT_PUBLIC_APP_URL")}"`;
    const result = replaceRuntimeEnvSentinels(Buffer.from(source), sentinels);
    expect(result?.count).toBe(3);
    expect(result?.content.toString("utf8")).toBe(
      'const u="https://unbottled.ai";const t="Grüße 日本";const e="";const v="https://unbottled.ai"',
    );
  });

  it("prefers the longest sentinel and leaves unknown keys untouched", () => {
    const unknown = runtimeEnvPlaceholder("NEXT_PUBLIC_NOT_SET");
    const source = `${runtimeEnvPlaceholder("NEXT_PUBLIC_APP_URL_EXTRA")}|${unknown}`;
    const result = replaceRuntimeEnvSentinels(Buffer.from(source), sentinels);
    expect(result?.count).toBe(1);
    expect(result?.content.toString("utf8")).toBe(`longer|${unknown}`);
  });

  it("returns undefined when only unknown sentinels are present", () => {
    const source = runtimeEnvPlaceholder("NEXT_PUBLIC_NOT_SET");
    expect(
      replaceRuntimeEnvSentinels(Buffer.from(source), sentinels),
    ).toBeUndefined();
  });
});

import { describe, expect, it } from "bun:test";
import { z } from "zod";

import { createFormErrorMap } from "./form-error-map";

function firstMessage(
  schema: z.ZodType,
  value: string | number | undefined,
): string | undefined {
  const result = schema.safeParse(value, {
    error: createFormErrorMap("en-US"),
  });
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe("createFormErrorMap", () => {
  it("says what to do instead of schema text", () => {
    expect(firstMessage(z.string().min(1), "")).toBe("Enter a value");
    expect(firstMessage(z.string().min(3), "a")).toBe(
      "Use at least 3 characters",
    );
    expect(firstMessage(z.string(), undefined)).toBe("Enter a value");
    expect(firstMessage(z.email(), "nope")).toBe("Enter a valid email address");
    expect(firstMessage(z.number().max(100), 120)).toBe("Enter 100 or less");
  });

  it("keeps messages declared on the schema", () => {
    expect(firstMessage(z.string().min(1, "custom.key"), "")).toBe(
      "custom.key",
    );
  });
});

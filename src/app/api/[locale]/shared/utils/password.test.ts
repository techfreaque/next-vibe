import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";

describe("Password utilities", () => {
  it("should hash a password", async () => {
    const password = "test-password";
    const hash = await hashPassword(password);

    // Argon2 hashes start with $argon2
    expect(hash).toMatch(/^\$argon2/);
  });

  it("should verify a correct password", async () => {
    const password = "test-password";
    const hash = await hashPassword(password);

    const result = await verifyPassword(password, hash);
    expect(result).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "test-password";
    const wrongPassword = "wrong-password";
    const hash = await hashPassword(password);

    const result = await verifyPassword(wrongPassword, hash);
    expect(result).toBe(false);
  });

  it("should handle invalid hash formats gracefully", async () => {
    const password = "test-password";
    const invalidHash = "invalid-hash-format";

    const result = await verifyPassword(password, invalidHash);
    expect(result).toBe(false);
  });
});

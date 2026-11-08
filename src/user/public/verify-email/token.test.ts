import { describe, expect, it } from "vitest";

import {
  createVerificationToken,
  isValidVerificationToken,
  peekTokenUserId,
  VERIFY_TOKEN_TTL_DAYS,
} from "./token";

const USER = "11111111-2222-4333-8444-555555555555";
const EMAIL = "someone@example.com";

describe("email verification token", () => {
  it("validates for the same user + email", () => {
    const token = createVerificationToken(USER, EMAIL);
    expect(token).not.toBeNull();
    if (!token) {
      return;
    }
    expect(peekTokenUserId(token)).toBe(USER);
    expect(isValidVerificationToken(token, USER, EMAIL)).toBe(true);
    // case-insensitive email, stable across repeated checks (idempotent)
    expect(isValidVerificationToken(token, USER, EMAIL.toUpperCase())).toBe(
      true,
    );
    expect(isValidVerificationToken(token, USER, EMAIL)).toBe(true);
  });

  it("rejects wrong user, changed email, tamper and garbage", () => {
    const token = createVerificationToken(USER, EMAIL) ?? "";
    expect(isValidVerificationToken(token, "other-user", EMAIL)).toBe(false);
    expect(isValidVerificationToken(token, USER, "new@example.com")).toBe(
      false,
    );
    const [head, sig] = token.split(".");
    expect(isValidVerificationToken(`${head}.${sig}x`, USER, EMAIL)).toBe(
      false,
    );
    expect(isValidVerificationToken(`${head}.`, USER, EMAIL)).toBe(false);
    expect(isValidVerificationToken("garbage", USER, EMAIL)).toBe(false);
    expect(peekTokenUserId("garbage")).toBeNull();
  });

  it("expires", () => {
    const now = Date.now();
    const token = createVerificationToken(USER, EMAIL, now) ?? "";
    const day = 24 * 60 * 60 * 1000;
    expect(
      isValidVerificationToken(
        token,
        USER,
        EMAIL,
        now + (VERIFY_TOKEN_TTL_DAYS - 1) * day,
      ),
    ).toBe(true);
    expect(
      isValidVerificationToken(
        token,
        USER,
        EMAIL,
        now + (VERIFY_TOKEN_TTL_DAYS + 1) * day,
      ),
    ).toBe(false);
  });
});

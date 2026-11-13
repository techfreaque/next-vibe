/**
 * Signup email identity (pure): alias normalization + disposable domains.
 */

import { describe, expect, it } from "vitest";

import {
  emailDomain,
  isDisposableEmail,
  isDisposableEmailDomain,
  normalizeEmailForUniqueness,
} from "./email-identity";

describe("normalizeEmailForUniqueness", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmailForUniqueness("  John.Doe@Example.ORG ")).toBe(
      "john.doe@example.org",
    );
  });

  it("removes gmail dots and +tags", () => {
    expect(normalizeEmailForUniqueness("a.b.c+x@gmail.com")).toBe(
      "abc@gmail.com",
    );
    expect(normalizeEmailForUniqueness("A.B.C@GMail.com")).toBe(
      "abc@gmail.com",
    );
  });

  it("maps googlemail.com to gmail.com", () => {
    expect(normalizeEmailForUniqueness("a.bc+promo@googlemail.com")).toBe(
      "abc@gmail.com",
    );
  });

  it("strips +tags for other providers but keeps their dots", () => {
    expect(normalizeEmailForUniqueness("user+promo@example.org")).toBe(
      "user@example.org",
    );
    expect(normalizeEmailForUniqueness("first.last+a+b@proton.me")).toBe(
      "first.last@proton.me",
    );
  });

  it("leaves input without @ alone apart from case", () => {
    expect(normalizeEmailForUniqueness(" NoAt ")).toBe("noat");
  });
});

describe("emailDomain", () => {
  it("returns the lowercased domain or null", () => {
    expect(emailDomain("x@Sub.Example.COM")).toBe("sub.example.com");
    expect(emailDomain("nope")).toBeNull();
    expect(emailDomain("x@")).toBeNull();
  });
});

describe("disposable domains", () => {
  it("blocks listed domains and their subdomains", () => {
    expect(isDisposableEmailDomain("mailinator.com")).toBe(true);
    expect(isDisposableEmail("x@MAILINATOR.com")).toBe(true);
    expect(isDisposableEmail("x@inbox.mailinator.com")).toBe(true);
    expect(isDisposableEmail("x@a.b.yopmail.com")).toBe(true);
  });

  it("allows normal providers", () => {
    expect(isDisposableEmail("x@gmail.com")).toBe(false);
    expect(isDisposableEmail("x@example.org")).toBe(false);
    expect(isDisposableEmail("x@notmailinator.com.example.org")).toBe(false);
    expect(isDisposableEmailDomain("com")).toBe(false);
  });
});

/**
 * TOTP primitives: RFC 4226/6238 vectors, window, at-rest encryption, recovery codes.
 */

import { describe, expect, it } from "vitest";

import {
  base32Decode,
  base32Encode,
  buildOtpauthUri,
  consumeRecoveryCode,
  decryptSecret,
  encryptSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  hotp,
  totpAt,
  verifyTotp,
} from "./totp";

// RFC 6238 appendix B: ASCII secret "12345678901234567890"
const RFC_SECRET = base32Encode(Buffer.from("12345678901234567890"));

describe("TOTP", () => {
  it("matches RFC 4226 HOTP vectors", () => {
    const secret = Buffer.from("12345678901234567890");
    const expected = ["755224", "287082", "359152", "969429", "338314"];
    expected.forEach((code, counter) => {
      expect(hotp(secret, counter)).toBe(code);
    });
  });

  it("matches RFC 6238 TOTP vectors (SHA1, last 6 digits)", () => {
    expect(totpAt(RFC_SECRET, 59_000)).toBe("287082");
    expect(totpAt(RFC_SECRET, 1_111_111_109_000)).toBe("081804");
    expect(totpAt(RFC_SECRET, 2_000_000_000_000)).toBe("279037");
  });

  it("round-trips base32", () => {
    const secret = generateTotpSecret();
    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
    expect(base32Encode(base32Decode(secret))).toBe(secret);
  });

  it("accepts +-1 step and rejects further skew or wrong codes", () => {
    const now = 1_700_000_000_000;
    const code = totpAt(RFC_SECRET, now);
    expect(verifyTotp(RFC_SECRET, code, now)).toBe(true);
    expect(verifyTotp(RFC_SECRET, code, now + 30_000)).toBe(true);
    expect(verifyTotp(RFC_SECRET, code, now - 30_000)).toBe(true);
    expect(verifyTotp(RFC_SECRET, code, now + 120_000)).toBe(false);
    expect(verifyTotp(RFC_SECRET, "000000", now)).toBe(false);
    expect(verifyTotp(RFC_SECRET, "12345", now)).toBe(false);
    expect(verifyTotp(RFC_SECRET, "abcdef", now)).toBe(false);
  });

  it("builds an otpauth URI authenticator apps accept", () => {
    const uri = buildOtpauthUri("JBSWY3DPEHPK3PXP", "a@b.co", "unbottled.ai");
    expect(uri).toContain("otpauth://totp/unbottled.ai%3Aa%40b.co?");
    expect(uri).toContain("secret=JBSWY3DPEHPK3PXP");
    expect(uri).toContain("issuer=unbottled.ai");
  });
});

describe("secret at rest", () => {
  it("encrypts (not plaintext) and decrypts back; tamper fails", () => {
    const secret = generateTotpSecret();
    const enc = encryptSecret(secret);
    expect(enc).not.toBeNull();
    if (!enc) {
      return;
    }
    expect(enc).not.toContain(secret);
    expect(enc.split(":")).toHaveLength(3);
    expect(decryptSecret(enc)).toBe(secret);
    const tampered = `${enc.slice(0, -2)}${enc.endsWith("00") ? "11" : "00"}`;
    expect(decryptSecret(tampered)).toBeNull();
    expect(decryptSecret("garbage")).toBeNull();
  });
});

describe("recovery codes", () => {
  it("generates unique, formatted codes and consumes each once", () => {
    const codes = generateRecoveryCodes();
    expect(codes).toHaveLength(10);
    expect(new Set(codes).size).toBe(10);
    codes.forEach((c) => expect(c).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}$/));
    const hashes = codes.map(hashRecoveryCode);
    expect(hashes.join("")).not.toContain(codes[0]);

    const after = consumeRecoveryCode(hashes, codes[0]!.toLowerCase());
    expect(after).not.toBeNull();
    expect(after).toHaveLength(9);
    // spent: not in the remaining set any more
    expect(consumeRecoveryCode(after ?? [], codes[0]!)).toBeNull();
    // others still valid
    expect(consumeRecoveryCode(after ?? [], codes[1]!)).toHaveLength(8);
    expect(consumeRecoveryCode(hashes, "NOPE-NOPE2")).toBeNull();
    expect(consumeRecoveryCode(hashes, "123456")).toBeNull();
  });
});

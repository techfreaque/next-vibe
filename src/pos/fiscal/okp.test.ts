import { describe, expect, it } from "bun:test";

import { okpFromPkp, qrDataFromOkp, qrDataFromUid } from "./okp";

// Base64 of bytes 0..63; SHA-1 of those bytes is c6138d51...69917ec7.
const PKP =
  "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+Pw==";

describe("okpFromPkp", () => {
  it("hashes the decoded PKP bytes and groups 5 x 8 hex chars", () => {
    expect(okpFromPkp(PKP)).toBe(
      "c6138d51-4ffa2135-bfce0ed0-b8fac656-69917ec7",
    );
  });

  it("is 44 characters long and ignores surrounding whitespace", () => {
    const okp = okpFromPkp(` ${PKP}\n`);
    expect(okp).toHaveLength(44);
    expect(okp).toMatch(/^([0-9a-f]{8}-){4}[0-9a-f]{8}$/);
  });
});

describe("QR data", () => {
  it("uses the UID for online receipts", () => {
    expect(qrDataFromUid(" O-0123456789abcdef0123456789abcdef ")).toBe(
      "O-0123456789abcdef0123456789abcdef",
    );
  });

  it("builds OKP:code:YYMMDDHHMISS:number:total in Slovak time", () => {
    expect(
      qrDataFromOkp({
        okp: "c6138d51-4ffa2135-bfce0ed0-b8fac656-69917ec7",
        cashRegisterCode: "88812345678900001",
        // 09:05:07 UTC in November = 10:05:07 CET
        issuedAt: "2026-11-26T09:05:07.000Z",
        receiptNumber: 42,
        total: 12.5,
      }),
    ).toBe(
      "c6138d51-4ffa2135-bfce0ed0-b8fac656-69917ec7:88812345678900001:261126100507:42:12.50",
    );
  });
});

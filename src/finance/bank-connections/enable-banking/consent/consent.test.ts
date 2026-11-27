import { expect, test } from "bun:test";

import { authorizeConsent, consentLimit, exchangeConsent } from "./client";
import {
  createConsentState,
  decryptConsentValue,
  encryptConsentValue,
  verifyConsentState,
} from "./crypto";

test("verifies a signed state and authenticates stored credential scope", () => {
  const secret = Buffer.alloc(32, 14);
  const token = createConsentState(secret);
  expect(verifyConsentState(token.state, secret)).toBe(token.digest);
  expect(verifyConsentState(token.state + ".", secret)).toBeUndefined();
  expect(verifyConsentState(token.state, Buffer.alloc(32, 15))).toBeUndefined();
  const corrupted = `${token.state.startsWith("A") ? "Z" : "A"}${token.state.slice(1)}`;
  expect(verifyConsentState(corrupted, secret)).toBeUndefined();

  const binding = [
    "account",
    "company-fixture",
    "consent-fixture",
    "account-fixture",
  ];
  const plaintext = "synthetic-bank-account-ref";
  const encrypted = encryptConsentValue(plaintext, binding, secret);
  expect(encrypted.includes(plaintext)).toBe(false);
  expect(encryptConsentValue(plaintext, binding, secret)).not.toBe(encrypted);
  expect(decryptConsentValue(encrypted, binding, secret)).toBe(plaintext);
  expect(
    decryptConsentValue(encrypted, [...binding, "different"], secret),
  ).toBeUndefined();
});

test("uses only expected authorization paths and returns the reported consent cap", async () => {
  const bank = { country: "DE", name: "Fixture Bank" };
  const state = "fixture-state";
  const callbackUrl =
    "http://localhost:3000/api/en-GLOBAL/finance/bank-connections/enable-banking/callback";
  const requestedUntil = new Date("2027-03-01T00:00:00.000Z");
  const calls: string[] = [];
  const request = async (
    path: string,
    init: RequestInit,
  ): Promise<Response> => {
    calls.push(path);
    if (path.startsWith("/aspsps?")) {
      expect(init.method).toBe("GET");
      return Response.json({
        aspsps: [
          {
            ...bank,
            maximum_consent_validity: 7_776_000,
            psu_types: ["personal"],
          },
        ],
      });
    }
    expect(init.method).toBe("POST");
    if (path === "/auth") {
      expect(
        typeof init.body === "string" ? JSON.parse(init.body) : undefined,
      ).toEqual({
        access: { valid_until: requestedUntil.toISOString() },
        aspsp: bank,
        psu_type: "personal",
        state,
        redirect_url: callbackUrl,
      });
      return Response.json({
        url: "https://auth.enablebanking.com/ais/start?sessionid=synthetic",
      });
    }
    expect(
      typeof init.body === "string" ? JSON.parse(init.body) : undefined,
    ).toEqual({
      code: "fixture-code",
    });
    return Response.json({
      session_id: "11111111-1111-4111-8111-111111111111",
      accounts: [
        { uid: "22222222-2222-4222-8222-222222222222", currency: "EUR" },
      ],
      aspsp: bank,
      access: { valid_until: requestedUntil.toISOString() },
      psu_type: "personal",
    });
  };
  expect(await consentLimit(request, bank, "personal")).toBe(7_776_000);
  expect(
    await authorizeConsent(request, {
      bank,
      psu: "personal",
      state,
      requestedUntil,
      callbackUrl,
    }),
  ).toContain("https://auth.enablebanking.com/");
  expect(
    (await exchangeConsent(request, "fixture-code"))?.accounts,
  ).toHaveLength(1);
  expect(calls).toEqual([
    "/aspsps?country=DE&psu_type=personal",
    "/auth",
    "/sessions",
  ]);
  for (const url of [
    "http://auth.enablebanking.com/ais/start",
    "https://auth.enablebanking.com.example.com/ais/start",
    "https://fake@auth.enablebanking.com/ais/start",
  ]) {
    const untrusted = async (): Promise<Response> => Response.json({ url });
    expect(
      await authorizeConsent(untrusted, {
        bank,
        psu: "personal",
        state,
        requestedUntil,
        callbackUrl,
      }),
    ).toBeUndefined();
  }
});

test("German directory entries beyond the first thousand retain their consent limit", async () => {
  const rows = Array.from({ length: 1075 }, (_, i) => ({
    name: `Test Bank ${i}`,
    country: "DE",
    maximum_consent_validity: 86400,
    psu_types: ["personal"],
  }));
  const request = async (): Promise<Response> =>
    Response.json({
      aspsps: [
        ...rows,
        { ...rows[0], name: "Revolut" },
        { ...rows[0], name: "C24" },
      ],
    });
  expect(
    await consentLimit(request, { country: "DE", name: "Revolut" }, "personal"),
  ).toBe(86400);
  expect(
    await consentLimit(request, { country: "DE", name: "C24" }, "personal"),
  ).toBe(86400);
  expect(
    await consentLimit(request, { country: "DE", name: "C24" }, "business"),
  ).toBeUndefined();
});

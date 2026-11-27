import "server-only";

import { z } from "zod";

const providers = z.object({
  aspsps: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        country: z.string().regex(/^[A-Z]{2}$/u),
        maximum_consent_validity: z.number().int().positive(),
        psu_types: z.array(z.enum(["personal", "business"])).optional(),
      }),
    )
    .max(20_000),
});
const bank = z.object({
  name: z.string().min(1).max(200),
  country: z.string().regex(/^[A-Z]{2}$/u),
});
const startResponse = z.object({
  url: z.url({ protocol: /^https$/u, hostname: /^auth\.enablebanking\.com$/u }),
});
export const accountIdentifiers = z.object({
  uid: z.uuid(),
  account_id: z.json().optional(),
  all_account_ids: z.array(z.json()).max(20).nullish(),
  identification_hash: z.string().max(1_000).nullish(),
  identification_hashes: z.array(z.string().max(1_000)).max(20).nullish(),
});
const sessionResponse = z.object({
  session_id: z.uuid(),
  accounts: z
    .array(
      accountIdentifiers.extend({
        currency: z
          .string()
          .regex(/^[A-Z]{3}$/u)
          .nullish(),
      }),
    )
    .min(1)
    .max(50),
  aspsp: bank,
  psu_type: z.enum(["personal", "business"]),
  access: z.object({ valid_until: z.iso.datetime({ offset: true }) }),
});

export type ConsentTransport = (
  path: string,
  init: RequestInit,
) => Promise<Response>;
export type ConsentBank = z.infer<typeof bank>;
export type BankSession = z.infer<typeof sessionResponse>;
export type PsuType = "personal" | "business";

export async function consentLimit(
  request: ConsentTransport,
  selected: ConsentBank,
  psu: PsuType,
): Promise<number | undefined> {
  const query = new URLSearchParams({
    country: selected.country,
    psu_type: psu,
  });
  const response = await request(`/aspsps?${query}`, { method: "GET" });
  if (!response.ok) {
    return undefined;
  }
  const parsed = providers.safeParse(await response.json());
  if (!parsed.success) {
    return undefined;
  }
  return parsed.data.aspsps.find(
    (row) =>
      row.name === selected.name &&
      row.country === selected.country &&
      (!row.psu_types || row.psu_types.includes(psu)),
  )?.maximum_consent_validity;
}

function jsonPost(
  body: Record<string, z.infer<ReturnType<typeof z.json>>>,
): RequestInit {
  return {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export async function authorizeConsent(
  request: ConsentTransport,
  details: {
    bank: ConsentBank;
    psu: PsuType;
    state: string;
    callbackUrl: string;
    requestedUntil: Date;
  },
): Promise<string | undefined> {
  const response = await request(
    "/auth",
    jsonPost({
      access: { valid_until: details.requestedUntil.toISOString() },
      aspsp: details.bank,
      state: details.state,
      redirect_url: details.callbackUrl,
      psu_type: details.psu,
    }),
  );
  if (!response.ok) {
    return undefined;
  }
  const parsed = startResponse.safeParse(await response.json());
  if (!parsed.success) {
    return undefined;
  }
  const url = new URL(parsed.data.url);
  if (
    url.origin !== "https://auth.enablebanking.com" ||
    url.username ||
    url.password
  ) {
    return undefined;
  }
  return url.href;
}

export async function exchangeConsent(
  request: ConsentTransport,
  code: string,
): Promise<BankSession | undefined> {
  const response = await request("/sessions", jsonPost({ code }));
  if (!response.ok) {
    return undefined;
  }
  const parsed = sessionResponse.safeParse(await response.json());
  return parsed.success ? parsed.data : undefined;
}

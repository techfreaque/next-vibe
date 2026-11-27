import "server-only";

import { z } from "zod";

import type { ConsentTransport } from "./consent/client";

const application = z.object({
  active: z.boolean(),
  services: z.array(z.string()),
});

/** The application endpoint reports AIS availability. It cannot enumerate account links. */
export async function applicationAccess(
  request: ConsentTransport,
): Promise<"active" | "inactive" | "unavailable"> {
  try {
    const response = await request("/application", { method: "GET" });
    if (!response.ok) {
      return "unavailable";
    }
    const result = application.safeParse(await response.json());
    if (!result.success) {
      return "unavailable";
    }
    return result.data.active && result.data.services.includes("AIS")
      ? "active"
      : "inactive";
  } catch {
    return "unavailable";
  }
}

export async function listBankCountries(
  request: ConsentTransport,
): Promise<string[] | undefined> {
  const response = await request("/application", { method: "GET" });
  if (!response.ok) {
    return undefined;
  }
  const data = application
    .extend({ countries: z.array(z.string().regex(/^[A-Z]{2}$/u)) })
    .safeParse(await response.json());
  return data.success && data.data.active && data.data.services.includes("AIS")
    ? data.data.countries
    : undefined;
}

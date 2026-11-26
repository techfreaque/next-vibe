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

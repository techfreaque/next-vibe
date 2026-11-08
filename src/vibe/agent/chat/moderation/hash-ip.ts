import { createHash } from "node:crypto";

/** One-way IP hash for report rate limiting. IPs are never stored raw. */
export function hashReporterIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

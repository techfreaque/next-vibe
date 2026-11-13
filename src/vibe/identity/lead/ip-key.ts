/**
 * IP normalisation for anti-farming keys.
 * - pool key: who counts as "the same guest" (IPv4 /32, IPv6 /64)
 * - subnet key: which network a budget applies to (IPv4 /24, IPv6 /64)
 * IPv4-mapped IPv6 (::ffff:1.2.3.4) is treated as IPv4. Unparseable input -> null.
 * Framework-level (lead linking); credits/anti-farming re-exports it.
 */

/** Prefix lengths: pool identity (one person) vs subnet (one network) */
export const IP_POOL_PREFIX = { v4: 32, v6: 64 } as const;
export const IP_SUBNET_PREFIX = { v4: 24, v6: 64 } as const;

/** Guests seen from one IP pool key within this window share ONE guest pool */
export const GUEST_IP_POOL_WINDOW_HOURS = 24;

function parseIpv4(ip: string): number[] | null {
  const parts = ip.split(".");
  if (parts.length !== 4) {
    return null;
  }
  const octets = parts.map((p) => (/^\d{1,3}$/.test(p) ? Number(p) : NaN));
  return octets.every((o) => o >= 0 && o <= 255) ? octets : null;
}

/** Parse a ':'-separated run of hextets ("" -> []) */
function toHextets(part: string): number[] | null {
  if (part === "") {
    return [];
  }
  const groups = part.split(":");
  const out: number[] = [];
  for (const g of groups) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) {
      return null;
    }
    out.push(parseInt(g, 16));
  }
  return out;
}

/** Expand an IPv6 address to 8 hextets, or null */
function parseIpv6(ip: string): number[] | null {
  const zoneFree = ip.split("%")[0] ?? ip;
  const halves = zoneFree.split("::");
  if (halves.length > 2) {
    return null;
  }
  const head = toHextets(halves[0] ?? "");
  const tail = halves.length === 2 ? toHextets(halves[1] ?? "") : [];
  if (!head || !tail) {
    return null;
  }
  if (halves.length === 1) {
    return head.length === 8 ? head : null;
  }
  const fill = 8 - head.length - tail.length;
  if (fill < 1) {
    return null;
  }
  return [...head, ...Array.from({ length: fill }, () => 0), ...tail];
}

type ParsedIp = { v: 4; octets: number[] } | { v: 6; hextets: number[] };

function parseIp(raw: string | null | undefined): ParsedIp | null {
  if (!raw) {
    return null;
  }
  const ip = raw.trim();
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(ip);
  const v4 = parseIpv4(mapped?.[1] ?? ip);
  if (v4) {
    return { v: 4, octets: v4 };
  }
  const v6 = parseIpv6(ip);
  return v6 ? { v: 6, hextets: v6 } : null;
}

function prefixKey(ip: ParsedIp, prefix: { v4: number; v6: number }): string {
  if (ip.v === 4) {
    const keep = Math.floor(prefix.v4 / 8);
    const octets = ip.octets.map((o, i) => (i < keep ? o : 0));
    return `${octets.join(".")}/${String(prefix.v4)}`;
  }
  const keep = Math.floor(prefix.v6 / 16);
  const hextets = ip.hextets.map((h, i) => (i < keep ? h : 0));
  return `${hextets.map((h) => h.toString(16)).join(":")}/${String(prefix.v6)}`;
}

/** Same guest: IPv4 /32, IPv6 /64 */
export function ipPoolKey(ip: string | null | undefined): string | null {
  const parsed = parseIp(ip);
  return parsed ? prefixKey(parsed, IP_POOL_PREFIX) : null;
}

/** Same network: IPv4 /24, IPv6 /64 */
export function ipSubnetKey(ip: string | null | undefined): string | null {
  const parsed = parseIp(ip);
  return parsed ? prefixKey(parsed, IP_SUBNET_PREFIX) : null;
}

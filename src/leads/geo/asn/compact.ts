/**
 * Compact offline IP -> hosting ASN table (pure, no I/O).
 *
 * Source: DB-IP "IP to ASN Lite" CSV (start_ip,end_ip,asn,as_organization),
 * CC BY 4.0, https://db-ip.com. Only ranges whose ASN is classified as a
 * hosting / VPN network (./hosting-asns.ts) are kept; every other range is a
 * gap (ASN 0). Adjacent ranges of one ASN merge, so the table stays small.
 * IPv6 keeps the top 64 bits of every boundary, like the country table.
 *
 * Binary layout (little endian), stored gzip + base64 in geo_ip_databases:
 *   "ASN1" | u32 v4Count | u32 v6Count
 *   v4Count x u32 start | v4Count x u32 asn
 *   v6Count x (u32 hi, u32 lo) start | v6Count x u32 asn
 */

import { parseIp } from "next-vibe/identity/lead/ip-key";

import { isHostingAsn } from "./hosting-asns";

const MAGIC = "ASN1";

export interface AsnTable {
  v4Starts: Uint32Array;
  v4Asns: Uint32Array;
  v6Hi: Uint32Array;
  v6Lo: Uint32Array;
  v6Asns: Uint32Array;
}

interface V6Key {
  hi: number;
  lo: number;
}

function v4Number(octets: number[]): number {
  return (
    ((octets[0] ?? 0) * 16_777_216 +
      (octets[1] ?? 0) * 65_536 +
      (octets[2] ?? 0) * 256 +
      (octets[3] ?? 0)) >>>
    0
  );
}

function v6Key(hextets: number[]): V6Key {
  return {
    hi: ((hextets[0] ?? 0) * 65_536 + (hextets[1] ?? 0)) >>> 0,
    lo: ((hextets[2] ?? 0) * 65_536 + (hextets[3] ?? 0)) >>> 0,
  };
}

function compareV6(a: V6Key, b: V6Key): number {
  return a.hi !== b.hi ? a.hi - b.hi : a.lo - b.lo;
}

function nextV6(a: V6Key): V6Key | null {
  if (a.lo < 0xffff_ffff) {
    return { hi: a.hi, lo: a.lo + 1 };
  }
  return a.hi < 0xffff_ffff ? { hi: a.hi + 1, lo: 0 } : null;
}

/** Split one CSV line, honouring double-quoted fields (org names have commas). */
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Build the table from the DB-IP ASN CSV text.
 * `classify` decides which ASNs are kept (default: the hosting/VPN list).
 */
export function buildAsnTable(
  csv: string,
  classify: (asn: number, org: string) => boolean = isHostingAsn,
): AsnTable {
  const v4Starts: number[] = [];
  const v4Asns: number[] = [];
  let v4NextFree = 0;
  const v6Hi: number[] = [];
  const v6Lo: number[] = [];
  const v6Asns: number[] = [];
  let v6NextFree: V6Key | null = { hi: 0, lo: 0 };

  const pushV4 = (start: number, asn: number): void => {
    const last = v4Asns.length - 1;
    if (last >= 0 && v4Starts[last] === start) {
      v4Asns[last] = asn;
      return;
    }
    if (last >= 0 && v4Asns[last] === asn) {
      return;
    }
    v4Starts.push(start);
    v4Asns.push(asn);
  };
  const pushV6 = (start: V6Key, asn: number): void => {
    const last = v6Asns.length - 1;
    if (last >= 0 && v6Hi[last] === start.hi && v6Lo[last] === start.lo) {
      return;
    }
    if (last >= 0 && v6Asns[last] === asn) {
      return;
    }
    v6Hi.push(start.hi);
    v6Lo.push(start.lo);
    v6Asns.push(asn);
  };

  const verdicts = new Map<number, boolean>();
  for (const line of csv.split("\n")) {
    const [rawStart, rawEnd, rawAsn, rawOrg] = splitCsvLine(line.trim());
    if (!rawStart || !rawEnd || !rawAsn) {
      continue;
    }
    const start = parseIp(rawStart);
    const end = parseIp(rawEnd);
    const asnNumber = Number(rawAsn);
    if (!start || !end || start.v !== end.v || !Number.isInteger(asnNumber)) {
      continue;
    }
    let keep = verdicts.get(asnNumber);
    if (keep === undefined) {
      keep = asnNumber > 0 && classify(asnNumber, rawOrg ?? "");
      verdicts.set(asnNumber, keep);
    }
    const asn = keep ? asnNumber >>> 0 : 0;
    if (start.v === 4 && end.v === 4) {
      const from = v4Number(start.octets);
      const to = v4Number(end.octets);
      if (to < from || from < v4NextFree) {
        continue;
      }
      if (from > v4NextFree) {
        pushV4(v4NextFree, 0);
      }
      pushV4(from, asn);
      v4NextFree = to + 1;
      continue;
    }
    if (start.v === 6 && end.v === 6 && v6NextFree) {
      const from = v6Key(start.hextets);
      const to = v6Key(end.hextets);
      if (compareV6(to, from) < 0 || compareV6(to, v6NextFree) < 0) {
        continue;
      }
      if (compareV6(from, v6NextFree) > 0) {
        pushV6(v6NextFree, 0);
      }
      pushV6(compareV6(from, v6NextFree) < 0 ? v6NextFree : from, asn);
      v6NextFree = nextV6(to);
    }
  }
  if (v4NextFree <= 0xffff_ffff && v4Starts.length > 0) {
    pushV4(v4NextFree, 0);
  }
  if (v6NextFree && v6Asns.length > 0) {
    pushV6(v6NextFree, 0);
  }
  return {
    v4Starts: Uint32Array.from(v4Starts),
    v4Asns: Uint32Array.from(v4Asns),
    v6Hi: Uint32Array.from(v6Hi),
    v6Lo: Uint32Array.from(v6Lo),
    v6Asns: Uint32Array.from(v6Asns),
  };
}

export function encodeAsnTable(table: AsnTable): Uint8Array {
  const v4 = table.v4Starts.length;
  const v6 = table.v6Hi.length;
  const bytes = new Uint8Array(4 + 8 + v4 * 8 + v6 * 12);
  const view = new DataView(bytes.buffer);
  let offset = 0;
  for (const char of MAGIC) {
    bytes[offset++] = char.charCodeAt(0);
  }
  view.setUint32(offset, v4, true);
  view.setUint32(offset + 4, v6, true);
  offset += 8;
  const write = (values: Uint32Array): void => {
    for (const value of values) {
      view.setUint32(offset, value, true);
      offset += 4;
    }
  };
  write(table.v4Starts);
  write(table.v4Asns);
  for (let i = 0; i < v6; i++) {
    view.setUint32(offset, table.v6Hi[i] ?? 0, true);
    view.setUint32(offset + 4, table.v6Lo[i] ?? 0, true);
    offset += 8;
  }
  write(table.v6Asns);
  return bytes;
}

/** Null when the bytes are not an ASN1 table. */
export function decodeAsnTable(bytes: Uint8Array): AsnTable | null {
  if (
    bytes.length < 12 ||
    String.fromCharCode(...bytes.slice(0, 4)) !== MAGIC
  ) {
    return null;
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const v4 = view.getUint32(4, true);
  const v6 = view.getUint32(8, true);
  let offset = 12;
  if (bytes.length !== offset + v4 * 8 + v6 * 12) {
    return null;
  }
  const read = (count: number): Uint32Array => {
    const values = new Uint32Array(count);
    for (let i = 0; i < count; i++) {
      values[i] = view.getUint32(offset + i * 4, true);
    }
    offset += count * 4;
    return values;
  };
  const v4Starts = read(v4);
  const v4Asns = read(v4);
  const v6Hi = new Uint32Array(v6);
  const v6Lo = new Uint32Array(v6);
  for (let i = 0; i < v6; i++) {
    v6Hi[i] = view.getUint32(offset, true);
    v6Lo[i] = view.getUint32(offset + 4, true);
    offset += 8;
  }
  const v6Asns = read(v6);
  return { v4Starts, v4Asns, v6Hi, v6Lo, v6Asns };
}

function floorIndex(
  count: number,
  isAfter: (index: number) => boolean,
): number {
  let low = 0;
  let high = count - 1;
  let found = -1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    if (isAfter(mid)) {
      high = mid - 1;
    } else {
      found = mid;
      low = mid + 1;
    }
  }
  return found;
}

/** Hosting/VPN ASN of `ip`, or null for any other network and bad input. */
export function lookupHostingAsn(table: AsnTable, ip: string): number | null {
  const parsed = parseIp(ip);
  if (!parsed) {
    return null;
  }
  if (parsed.v === 4) {
    const key = v4Number(parsed.octets);
    const index = floorIndex(
      table.v4Starts.length,
      (i) => (table.v4Starts[i] ?? 0) > key,
    );
    const asn = index < 0 ? 0 : (table.v4Asns[index] ?? 0);
    return asn > 0 ? asn : null;
  }
  const key = v6Key(parsed.hextets);
  const index = floorIndex(
    table.v6Hi.length,
    (i) =>
      compareV6({ hi: table.v6Hi[i] ?? 0, lo: table.v6Lo[i] ?? 0 }, key) > 0,
  );
  const asn = index < 0 ? 0 : (table.v6Asns[index] ?? 0);
  return asn > 0 ? asn : null;
}

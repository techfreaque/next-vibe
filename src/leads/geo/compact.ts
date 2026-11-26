/**
 * Compact offline IP -> country table (pure, no I/O).
 *
 * Source: DB-IP "IP to Country Lite" CSV (start_ip,end_ip,country), CC BY 4.0,
 * https://db-ip.com. The CSV (~730k ranges) is folded into sorted range-start
 * arrays: adjacent ranges of the same country merge, gaps become "ZZ".
 * IPv6 keeps the top 64 bits of every boundary (a /64 is one site), so a v6
 * start is two uint32 words.
 *
 * Binary layout (little endian), stored gzip + base64 in geo_ip_databases:
 *   "GEO1" | u16 codeCount | codeCount x 2 ASCII bytes
 *   u32 v4Count | u32 v6Count
 *   v4Count x u32 start | v4Count x u8 code index
 *   v6Count x (u32 hi, u32 lo) start | v6Count x u8 code index
 */

import { parseIp } from "next-vibe/identity/lead/ip-key";

import { UNKNOWN_COUNTRY } from "./constants";

export { UNKNOWN_COUNTRY };

const MAGIC = "GEO1";
const COUNTRY_CODE = /^[A-Z]{2}$/;

export interface GeoTable {
  codes: string[];
  v4Starts: Uint32Array;
  v4Codes: Uint8Array;
  v6Hi: Uint32Array;
  v6Lo: Uint32Array;
  v6Codes: Uint8Array;
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

/** a + 1 on the 64-bit key; null on overflow. */
function nextV6(a: V6Key): V6Key | null {
  if (a.lo < 0xffff_ffff) {
    return { hi: a.hi, lo: a.lo + 1 };
  }
  return a.hi < 0xffff_ffff ? { hi: a.hi + 1, lo: 0 } : null;
}

class CodeIndex {
  readonly codes: string[] = [UNKNOWN_COUNTRY];
  private readonly index = new Map<string, number>([[UNKNOWN_COUNTRY, 0]]);

  of(code: string): number {
    const normalized = COUNTRY_CODE.test(code) ? code : UNKNOWN_COUNTRY;
    const known = this.index.get(normalized);
    if (known !== undefined) {
      return known;
    }
    const next = this.codes.length;
    this.codes.push(normalized);
    this.index.set(normalized, next);
    return next;
  }
}

/** Build the table from the DB-IP country CSV text. */
export function buildGeoTable(csv: string): GeoTable {
  const codes = new CodeIndex();
  const v4Starts: number[] = [];
  const v4Codes: number[] = [];
  let v4NextFree = 0;
  const v6Hi: number[] = [];
  const v6Lo: number[] = [];
  const v6Codes: number[] = [];
  let v6NextFree: V6Key | null = { hi: 0, lo: 0 };

  const pushV4 = (start: number, code: number): void => {
    const last = v4Codes.length - 1;
    if (last >= 0 && v4Starts[last] === start) {
      v4Codes[last] = code;
      return;
    }
    if (last >= 0 && v4Codes[last] === code) {
      return;
    }
    v4Starts.push(start);
    v4Codes.push(code);
  };
  const pushV6 = (start: V6Key, code: number): void => {
    const last = v6Codes.length - 1;
    if (last >= 0 && v6Hi[last] === start.hi && v6Lo[last] === start.lo) {
      return;
    }
    if (last >= 0 && v6Codes[last] === code) {
      return;
    }
    v6Hi.push(start.hi);
    v6Lo.push(start.lo);
    v6Codes.push(code);
  };

  for (const line of csv.split("\n")) {
    const [rawStart, rawEnd, rawCode] = line.trim().split(",");
    if (!rawStart || !rawEnd || !rawCode) {
      continue;
    }
    const start = parseIp(rawStart.replaceAll('"', ""));
    const end = parseIp(rawEnd.replaceAll('"', ""));
    const code = codes.of(rawCode.replaceAll('"', "").trim().toUpperCase());
    if (!start || !end || start.v !== end.v) {
      continue;
    }
    if (start.v === 4 && end.v === 4) {
      const from = v4Number(start.octets);
      const to = v4Number(end.octets);
      if (to < from || from < v4NextFree) {
        continue;
      }
      if (from > v4NextFree) {
        pushV4(v4NextFree, 0);
      }
      pushV4(from, code);
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
      pushV6(compareV6(from, v6NextFree) < 0 ? v6NextFree : from, code);
      v6NextFree = nextV6(to);
    }
  }
  if (v4NextFree <= 0xffff_ffff && v4Starts.length > 0) {
    pushV4(v4NextFree, 0);
  }
  if (v6NextFree && v6Codes.length > 0) {
    pushV6(v6NextFree, 0);
  }

  return {
    codes: codes.codes,
    v4Starts: Uint32Array.from(v4Starts),
    v4Codes: Uint8Array.from(v4Codes),
    v6Hi: Uint32Array.from(v6Hi),
    v6Lo: Uint32Array.from(v6Lo),
    v6Codes: Uint8Array.from(v6Codes),
  };
}

export function encodeGeoTable(table: GeoTable): Uint8Array {
  const v4 = table.v4Starts.length;
  const v6 = table.v6Hi.length;
  const size = 4 + 2 + table.codes.length * 2 + 8 + v4 * 5 + v6 * 9;
  const bytes = new Uint8Array(size);
  const view = new DataView(bytes.buffer);
  let offset = 0;
  for (const char of MAGIC) {
    bytes[offset++] = char.charCodeAt(0);
  }
  view.setUint16(offset, table.codes.length, true);
  offset += 2;
  for (const code of table.codes) {
    bytes[offset++] = code.charCodeAt(0);
    bytes[offset++] = code.charCodeAt(1);
  }
  view.setUint32(offset, v4, true);
  view.setUint32(offset + 4, v6, true);
  offset += 8;
  for (const start of table.v4Starts) {
    view.setUint32(offset, start, true);
    offset += 4;
  }
  bytes.set(table.v4Codes, offset);
  offset += v4;
  for (let i = 0; i < v6; i++) {
    view.setUint32(offset, table.v6Hi[i] ?? 0, true);
    view.setUint32(offset + 4, table.v6Lo[i] ?? 0, true);
    offset += 8;
  }
  bytes.set(table.v6Codes, offset);
  return bytes;
}

const HOST_IS_LITTLE_ENDIAN =
  new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;

/** `count` little-endian uint32 values starting at `offset`. */
function readUint32s(
  view: DataView,
  bytes: Uint8Array,
  offset: number,
  count: number,
): Uint32Array {
  if (HOST_IS_LITTLE_ENDIAN) {
    // Copy into a fresh, exactly sized, 4-byte aligned buffer. Not slice():
    // on a Node Buffer (the inflated table) slice() is a view of the pool.
    return new Uint32Array(
      new Uint8Array(bytes.subarray(offset, offset + count * 4)).buffer,
    );
  }
  const values = new Uint32Array(count);
  for (let i = 0; i < count; i++) {
    values[i] = view.getUint32(offset + i * 4, true);
  }
  return values;
}

/** Null when the bytes are not a GEO1 table. */
export function decodeGeoTable(bytes: Uint8Array): GeoTable | null {
  if (
    bytes.length < 14 ||
    String.fromCharCode(...bytes.slice(0, 4)) !== MAGIC
  ) {
    return null;
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 4;
  const codeCount = view.getUint16(offset, true);
  offset += 2;
  const codes: string[] = [];
  for (let i = 0; i < codeCount; i++) {
    codes.push(String.fromCharCode(bytes[offset] ?? 0, bytes[offset + 1] ?? 0));
    offset += 2;
  }
  const v4 = view.getUint32(offset, true);
  const v6 = view.getUint32(offset + 4, true);
  offset += 8;
  if (bytes.length !== offset + v4 * 5 + v6 * 9) {
    return null;
  }
  // Bulk copies instead of one DataView read per value: the per-range loops
  // held the event loop ~110 ms on a cold load (prod 2026-11-26 13:00,
  // decodeGeoTable compact.ts:235/244 hot during the hourly geo cron).
  const v4Starts = readUint32s(view, bytes, offset, v4);
  offset += v4 * 4;
  const v4Codes = bytes.slice(offset, offset + v4);
  offset += v4;
  const v6Pairs = readUint32s(view, bytes, offset, v6 * 2);
  offset += v6 * 8;
  const v6Hi = new Uint32Array(v6);
  const v6Lo = new Uint32Array(v6);
  for (let i = 0; i < v6; i++) {
    v6Hi[i] = v6Pairs[i * 2] ?? 0;
    v6Lo[i] = v6Pairs[i * 2 + 1] ?? 0;
  }
  const v6Codes = bytes.slice(offset, offset + v6);
  return { codes, v4Starts, v4Codes, v6Hi, v6Lo, v6Codes };
}

/** Index of the last start <= key (binary search), -1 when none. */
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

/**
 * ISO 3166-1 alpha-2 country of `ip`. "ZZ" for reserved/unknown ranges and
 * unparseable input.
 */
export function lookupCountry(table: GeoTable, ip: string): string {
  const parsed = parseIp(ip);
  if (!parsed) {
    return UNKNOWN_COUNTRY;
  }
  if (parsed.v === 4) {
    const key = v4Number(parsed.octets);
    const index = floorIndex(
      table.v4Starts.length,
      (i) => (table.v4Starts[i] ?? 0) > key,
    );
    return index < 0
      ? UNKNOWN_COUNTRY
      : (table.codes[table.v4Codes[index] ?? 0] ?? UNKNOWN_COUNTRY);
  }
  const key = v6Key(parsed.hextets);
  const index = floorIndex(
    table.v6Hi.length,
    (i) =>
      compareV6({ hi: table.v6Hi[i] ?? 0, lo: table.v6Lo[i] ?? 0 }, key) > 0,
  );
  return index < 0
    ? UNKNOWN_COUNTRY
    : (table.codes[table.v6Codes[index] ?? 0] ?? UNKNOWN_COUNTRY);
}

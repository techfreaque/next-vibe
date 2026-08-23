/**
 * PGlite Unix-socket Postgres wire-protocol server.
 *
 * Wraps a PGlite instance so N processes can connect via a standard `pg.Pool`.
 *
 * Protocol:
 *   1. SSL request (8 bytes, magic 80877103) → reply "N"
 *   2. Startup message → synthetic AuthOk + params + ReadyForQuery
 *   3. Frontend messages are batched per-connection until a fence (Q or S/Sync)
 *      and the entire batch executes under runExclusive — concurrent connections
 *      never interleave messages inside PGlite's single-threaded WASM backend.
 *
 * INSERT…RETURNING fix (PGlite v0.5.x bug):
 *   Simple Query ('Q') with INSERT…RETURNING: strip RETURNING, INSERT, SELECT
 *   back via ctid DESC, synthesise DataRow/CommandComplete/ReadyForQuery.
 */

import "server-only";

import { unlinkSync } from "node:fs";
import { createServer, type Server, type Socket } from "node:net";

import type { PGlite } from "@electric-sql/pglite";

// ─── Wire-protocol constants ──────────────────────────────────────────────────

const SSL_REQUEST_CODE = 80877103;
const MSG_SIMPLE_QUERY = 0x51; // 'Q'
const MSG_PARSE = 0x50; // 'P'
const MSG_BIND = 0x42; // 'B'
const MSG_SYNC = 0x53; // 'S' (Extended Query fence)
const MSG_TERMINATE = 0x58; // 'X'

// ─── Response builders ────────────────────────────────────────────────────────

function buildAuthOk(): Buffer {
  const buf = Buffer.allocUnsafe(9);
  buf.writeUInt8(0x52, 0);
  buf.writeInt32BE(8, 1);
  buf.writeInt32BE(0, 5);
  return buf;
}

function buildParameterStatus(key: string, value: string): Buffer {
  const kb = Buffer.from(`${key}\0`, "utf8");
  const vb = Buffer.from(`${value}\0`, "utf8");
  const len = 4 + kb.length + vb.length;
  const buf = Buffer.allocUnsafe(1 + len);
  buf.writeUInt8(0x53, 0);
  buf.writeInt32BE(len, 1);
  kb.copy(buf, 5);
  vb.copy(buf, 5 + kb.length);
  return buf;
}

function buildBackendKeyData(pid: number, secret: number): Buffer {
  const buf = Buffer.allocUnsafe(13);
  buf.writeUInt8(0x4b, 0);
  buf.writeInt32BE(12, 1);
  buf.writeInt32BE(pid, 5);
  buf.writeInt32BE(secret, 9);
  return buf;
}

function buildReadyForQuery(status: "I" | "T" | "E" = "I"): Buffer {
  const buf = Buffer.allocUnsafe(6);
  buf.writeUInt8(0x5a, 0);
  buf.writeInt32BE(5, 1);
  buf.writeUInt8(status.charCodeAt(0), 5);
  return buf;
}

function buildErrorResponse(
  severity: string,
  code: string,
  msg: string,
): Buffer {
  const fields = Buffer.from(
    `S\0${severity}\0C\0${code}\0M\0${msg}\0\0`,
    "utf8",
  );
  const len = 4 + fields.length;
  const buf = Buffer.allocUnsafe(1 + len);
  buf.writeUInt8(0x45, 0);
  buf.writeInt32BE(len, 1);
  fields.copy(buf, 5);
  return buf;
}

function buildCommandComplete(tag: string): Buffer {
  const tb = Buffer.from(`${tag}\0`, "utf8");
  const len = 4 + tb.length;
  const buf = Buffer.allocUnsafe(1 + len);
  buf.writeUInt8(0x43, 0);
  buf.writeInt32BE(len, 1);
  tb.copy(buf, 5);
  return buf;
}

function buildDataRow(values: (string | null)[]): Buffer {
  const valBufs = values.map((v) =>
    v === null ? null : Buffer.from(v, "utf8"),
  );
  let size = 2;
  for (const b of valBufs) {
    size += 4 + (b === null ? 0 : b.length);
  }
  const buf = Buffer.allocUnsafe(1 + 4 + size);
  let off = 0;
  buf.writeUInt8(0x44, off++);
  buf.writeInt32BE(4 + size, off);
  off += 4;
  buf.writeInt16BE(values.length, off);
  off += 2;
  for (const b of valBufs) {
    if (b === null) {
      buf.writeInt32BE(-1, off);
      off += 4;
    } else {
      buf.writeInt32BE(b.length, off);
      off += 4;
      b.copy(buf, off);
      off += b.length;
    }
  }
  return buf;
}

function buildRowDescription(columns: string[]): Buffer {
  const colBufs = columns.map((c) => Buffer.from(`${c}\0`, "utf8"));
  let size = 2;
  for (const b of colBufs) {
    size += b.length + 18;
  }
  const buf = Buffer.allocUnsafe(1 + 4 + size);
  let off = 0;
  buf.writeUInt8(0x54, off++);
  buf.writeInt32BE(4 + size, off);
  off += 4;
  buf.writeInt16BE(columns.length, off);
  off += 2;
  for (const b of colBufs) {
    b.copy(buf, off);
    off += b.length;
    buf.writeInt32BE(0, off);
    off += 4;
    buf.writeInt16BE(0, off);
    off += 2;
    buf.writeInt32BE(25, off);
    off += 4;
    buf.writeInt16BE(-1, off);
    off += 2;
    buf.writeInt32BE(-1, off);
    off += 4;
    buf.writeInt16BE(0, off);
    off += 2;
  }
  return buf;
}

// ─── Extended Query message parsers ──────────────────────────────────────────

function readCString(buf: Buffer, off: number): { str: string; end: number } {
  const end = buf.indexOf(0, off);
  return { str: buf.slice(off, end).toString("utf8"), end: end + 1 };
}

function parseSqlFromParseMessage(msg: Buffer): string | null {
  // Parse message: 'P' + int32 len + cstring(stmt) + cstring(sql) + int16 + OIDs
  if (msg.readUInt8(0) !== MSG_PARSE) {
    return null;
  }
  const { end: sqlStart } = readCString(msg, 5); // skip stmt name
  const { str } = readCString(msg, sqlStart);
  return str;
}

function parseParamsFromBindMessage(msg: Buffer): (string | null)[] | null {
  // Bind: 'B' + int32 len + cstring(portal) + cstring(stmt) + int16 formatCount + formats
  //       + int16 paramCount + (int32 valueLen + bytes)*
  if (msg.readUInt8(0) !== MSG_BIND) {
    return null;
  }
  let off = 5;
  const { end: e1 } = readCString(msg, off);
  off = e1; // skip portal
  const { end: e2 } = readCString(msg, off);
  off = e2; // skip stmt name

  const fmtCount = msg.readInt16BE(off);
  off += 2;
  const fmts: number[] = [];
  for (let i = 0; i < fmtCount; i++) {
    fmts.push(msg.readInt16BE(off));
    off += 2;
  }

  const paramCount = msg.readInt16BE(off);
  off += 2;
  const params: (string | null)[] = [];
  for (let i = 0; i < paramCount; i++) {
    const len = msg.readInt32BE(off);
    off += 4;
    if (len === -1) {
      params.push(null);
    } else {
      const fmt = fmtCount === 0 ? 0 : (fmts[i] ?? fmts[0] ?? 0);
      if (fmt === 1) {
        // binary — convert to string best-effort
        params.push(msg.slice(off, off + len).toString("hex"));
      } else {
        params.push(msg.slice(off, off + len).toString("utf8"));
      }
      off += len;
    }
  }
  return params;
}

// ─── INSERT…RETURNING intercept ───────────────────────────────────────────────

function countInsertRows(sql: string): number {
  const idx = sql.search(/\bvalues\s*\(/i);
  if (idx === -1) {
    return 1;
  }
  const s = sql.slice(idx);
  let depth = 0;
  let count = 0;
  for (const ch of s) {
    if (ch === "(") {
      depth++;
      if (depth === 1) {
        count++;
      }
    } else if (ch === ")") {
      depth--;
    }
  }
  return Math.max(count, 1);
}

type PgliteRow = Record<string, string | number | boolean | null | undefined>;

async function execInsertReturning(
  pg: PGlite,
  sql: string,
  params: (string | null)[] = [],
): Promise<Buffer> {
  const tableMatch = /^\s*insert\s+into\s+"?([^"\s(]+)"?/i.exec(sql);
  const tableName = tableMatch?.[1];
  const sqlNoReturn = sql.replace(/\s+returning\s+[\s\S]+$/i, "");
  await pg.query(sqlNoReturn, params, { rowMode: "object" });
  if (!tableName) {
    return Buffer.concat([
      buildCommandComplete("INSERT 0 0"),
      buildReadyForQuery(),
    ]);
  }
  const rowCount = countInsertRows(sql);
  const result = await pg.query<PgliteRow>(
    `SELECT * FROM "${tableName}" ORDER BY ctid DESC LIMIT ${rowCount}`,
    [],
    { rowMode: "object" },
  );
  const rows = result.rows.toReversed();
  const cols = result.fields.map((f) => f.name);
  const parts: Buffer[] = [buildRowDescription(cols)];
  for (const row of rows) {
    parts.push(
      buildDataRow(
        cols.map((c) => {
          const v = row[c];
          return v === null || v === undefined ? null : String(v);
        }),
      ),
    );
  }
  parts.push(buildCommandComplete(`INSERT 0 ${String(rows.length)}`));
  parts.push(buildReadyForQuery());
  return Buffer.concat(parts);
}

// ─── Per-connection state machine ─────────────────────────────────────────────

let nextPid = 10000;

function handleConnection(pg: PGlite, socket: Socket): void {
  const pid = nextPid++;
  const secret = (pid * 1234567) & 0x7fffffff;
  let startupDone = false;
  let recvBuf = Buffer.alloc(0);
  let batchBuf = Buffer.alloc(0);
  let busy = false;

  socket.on("data", (chunk: Buffer) => {
    recvBuf = Buffer.concat([recvBuf, chunk]);
    if (!busy) {
      void pump();
    }
  });
  socket.on("error", () => undefined);
  socket.on("close", () => {
    recvBuf = Buffer.alloc(0);
    batchBuf = Buffer.alloc(0);
  });

  async function pump(): Promise<void> {
    busy = true;
    try {
      while (recvBuf.length > 0) {
        if (!startupDone) {
          if (!processStartup()) {
            break;
          }
        } else {
          if (!(await processFrontend())) {
            break;
          }
        }
      }
    } finally {
      busy = false;
    }
  }

  function processStartup(): boolean {
    if (recvBuf.length < 4) {
      return false;
    }
    const len = recvBuf.readInt32BE(0);
    if (recvBuf.length < len) {
      return false;
    }
    const msg = recvBuf.slice(0, len);
    recvBuf = recvBuf.slice(len);
    const code = msg.readInt32BE(4);
    if (code === SSL_REQUEST_CODE) {
      socket.write(Buffer.from("N"));
      return true;
    }
    // Startup message — send synthetic auth + params
    socket.write(
      Buffer.concat([
        buildAuthOk(),
        buildParameterStatus("server_version", "14.0"),
        buildParameterStatus("client_encoding", "UTF8"),
        buildParameterStatus("server_encoding", "UTF8"),
        buildParameterStatus("DateStyle", "ISO, MDY"),
        buildParameterStatus("integer_datetimes", "on"),
        buildBackendKeyData(pid, secret),
        buildReadyForQuery(),
      ]),
    );
    startupDone = true;
    return true;
  }

  async function processFrontend(): Promise<boolean> {
    if (recvBuf.length < 5) {
      return false;
    }
    const msgType = recvBuf.readUInt8(0);
    const bodyLen = recvBuf.readInt32BE(1);
    const totalLen = 1 + bodyLen;
    if (recvBuf.length < totalLen) {
      return false;
    }

    const msg = recvBuf.slice(0, totalLen);
    recvBuf = recvBuf.slice(totalLen);

    if (msgType === MSG_TERMINATE) {
      socket.end();
      return false;
    }

    batchBuf = Buffer.concat([batchBuf, msg]);

    // Flush on fence
    if (msgType === MSG_SIMPLE_QUERY || msgType === MSG_SYNC) {
      const toFlush = batchBuf;
      batchBuf = Buffer.alloc(0);
      await flushBatch(toFlush, msgType);
    }
    return true;
  }

  async function flushBatch(
    messages: Buffer,
    fenceType: number,
  ): Promise<void> {
    // Simple Query with INSERT…RETURNING — intercept and rewrite
    if (fenceType === MSG_SIMPLE_QUERY) {
      const sql = messages
        .slice(5, messages.length - 1)
        .toString("utf8")
        .trim();
      if (/^\s*insert\s+into\s/i.test(sql) && /\sreturning\s/i.test(sql)) {
        try {
          // execInsertReturning calls pg.query() which handles locking internally.
          socket.write(await execInsertReturning(pg, sql));
        } catch (e) {
          socket.write(
            Buffer.concat([
              buildErrorResponse(
                "ERROR",
                "XX000",
                e instanceof Error ? e.message : "PGlite error",
              ),
              buildReadyForQuery(),
            ]),
          );
        }
        return;
      }
    }

    // Extended Query with INSERT…RETURNING — extract SQL+params from P/B messages
    // and rewrite via pg.query() to avoid PGlite v0.5.x INSERT…RETURNING corruption.
    if (fenceType === MSG_SYNC) {
      let parseMsg: Buffer | null = null;
      let bindMsg: Buffer | null = null;
      let off2 = 0;
      while (off2 < messages.length) {
        const t = messages.readUInt8(off2);
        const bLen = messages.readInt32BE(off2 + 1);
        const end = off2 + 1 + bLen;
        const msg = messages.slice(off2, end);
        if (t === MSG_PARSE) {
          parseMsg = msg;
        } else if (t === MSG_BIND) {
          bindMsg = msg;
        }
        off2 = end;
      }
      if (parseMsg !== null) {
        const sql = parseSqlFromParseMessage(parseMsg)?.trim() ?? "";
        if (/^\s*insert\s+into\s/i.test(sql) && /\sreturning\s/i.test(sql)) {
          const params =
            bindMsg !== null ? (parseParamsFromBindMessage(bindMsg) ?? []) : [];
          const parseComplete = Buffer.from([0x31, 0x00, 0x00, 0x00, 0x04]);
          const bindComplete = Buffer.from([0x32, 0x00, 0x00, 0x00, 0x04]);
          try {
            // execInsertReturning calls pg.query() which acquires runExclusive internally.
            // Do NOT wrap in pg.runExclusive() here — that would deadlock.
            const dataResp = await execInsertReturning(pg, sql, params);
            socket.write(
              Buffer.concat([parseComplete, bindComplete, dataResp]),
            );
          } catch (e) {
            socket.write(
              Buffer.concat([
                parseComplete,
                buildErrorResponse(
                  "ERROR",
                  "XX000",
                  e instanceof Error ? e.message : "PGlite error",
                ),
                buildReadyForQuery("E"),
              ]),
            );
          }
          return;
        }
      }
    }

    // All other messages: relay the entire batch as one execProtocolRaw call.
    // Splitting P/B/E/S into separate calls causes PGlite to emit ReadyForQuery
    // after each message, which desynchronises the pg client and causes EPIPE.
    try {
      await pg.runExclusive(async () => {
        const bytes = new Uint8Array(
          messages.buffer,
          messages.byteOffset,
          messages.byteLength,
        );
        const resp = await pg.execProtocolRaw(bytes);
        socket.write(Buffer.from(resp));
      });
    } catch (e) {
      socket.write(
        Buffer.concat([
          buildErrorResponse(
            "ERROR",
            "XX000",
            e instanceof Error ? e.message : "PGlite error",
          ),
          buildReadyForQuery(),
        ]),
      );
    }
  }
}

// ─── Server lifecycle ─────────────────────────────────────────────────────────

// Store on globalThis so HMR module reloads don't lose the running server ref.
// Without this, a hot reload would create a NEW server module with activeServer=null,
// then startPgliteServer would unlink the socket and rebind — dropping all live
// pg.Pool connections with "Connection terminated unexpectedly".
const g = globalThis as typeof globalThis & {
  __pglite_server__?: Server | null;
  __pglite_cleanup_registered__?: boolean;
};

function getActiveServer(): Server | null {
  return g.__pglite_server__ ?? null;
}

function setActiveServer(s: Server | null): void {
  g.__pglite_server__ = s;
}

export interface PgliteServerOptions {
  socketPath: string;
}

export function startPgliteServer(
  pg: PGlite,
  opts: PgliteServerOptions,
): Server {
  const existing = getActiveServer();
  if (existing) {
    try {
      existing.close();
    } catch {
      /* ignore */
    }
    setActiveServer(null);
  }

  try {
    unlinkSync(opts.socketPath);
  } catch {
    /* not present */
  }

  const server = createServer((socket: Socket) => {
    handleConnection(pg, socket);
  });

  if (!g.__pglite_cleanup_registered__) {
    g.__pglite_cleanup_registered__ = true;
    const cleanup = (): void => {
      try {
        unlinkSync(opts.socketPath);
      } catch {
        /* ignore */
      }
    };
    process.once("exit", cleanup);
    process.once("SIGINT", () => {
      cleanup();
      process.exit(0);
    });
    process.once("SIGTERM", () => {
      cleanup();
      process.exit(0);
    });
  }

  server.listen(opts.socketPath);
  setActiveServer(server);
  return server;
}

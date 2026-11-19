/**
 * System Mailbox IMAP Operations
 * Thin promise wrappers over the `imap` client already used by the messenger
 * IMAP stack (same library, same parser): append-to-Sent, list INBOX, read one.
 */

import "server-only";

import Imap from "imap";

import type { SystemMailboxConfig } from "./config";

export const SNIPPET_LENGTH = 160;

export interface InboxMessageSummary {
  uid: number;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  unread: boolean;
}

export interface InboxMessageFull extends InboxMessageSummary {
  to: string;
  messageId: string;
  bodyText: string;
}

export function makeSnippet(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, SNIPPET_LENGTH);
}

function connect(
  config: SystemMailboxConfig["imap"],
  verifyTls: boolean,
): Promise<Imap> {
  return new Promise<Imap>((resolve, reject) => {
    const options = {
      user: config.username,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.secure,
      tlsOptions: { rejectUnauthorized: verifyTls, servername: config.host },
      connTimeout: 15000,
      authTimeout: 10000,
      socketTimeout: 15000,
    };
    const imap = new Imap(options);
    imap.once("ready", () => resolve(imap));
    imap.once("error", (err: Error) => reject(err));
    imap.connect();
  });
}

async function withImap<T>(
  config: SystemMailboxConfig["imap"],
  fn: (imap: Imap) => Promise<T>,
  verifyTls = false,
): Promise<T> {
  const imap = await connect(config, verifyTls);
  try {
    const disconnected = Promise.withResolvers<never>();
    imap.once("error", disconnected.reject);
    imap.once("close", () =>
      disconnected.reject(new Error("IMAP connection closed")),
    );
    return await Promise.race([disconnected.promise, fn(imap)]);
  } finally {
    imap.end();
  }
}

interface BoxLike {
  special_use_attrib?: string;
  delimiter?: string;
}

function isSentBox(box: BoxLike): boolean {
  return (box.special_use_attrib ?? "").toLowerCase() === "\\sent";
}

function getSentFolderName(imap: Imap): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    imap.getBoxes((err, boxes) => {
      if (err) {
        reject(err);
        return;
      }
      for (const [name, box] of Object.entries(boxes)) {
        if (isSentBox(box)) {
          resolve(name);
          return;
        }
      }
      resolve("Sent");
    });
  });
}

/** Append a raw RFC822 message to the Sent folder (flagged \Seen). */
export function appendToSent(
  config: SystemMailboxConfig["imap"],
  raw: Buffer,
): Promise<string> {
  return withImap(config, async (imap) => {
    const folder = await getSentFolderName(imap);
    await new Promise<void>((resolve, reject) => {
      imap.append(raw, { mailbox: folder, flags: ["\\Seen"] }, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    return folder;
  });
}

function openInbox(imap: Imap, readOnly = true): Promise<Imap.Box> {
  return new Promise<Imap.Box>((resolve, reject) => {
    imap.openBox("INBOX", readOnly, (err, box) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(box);
    });
  });
}

type SearchCriterion =
  | string
  | [string, ...(SearchCriterion | Date | number)[]];

function searchUids(
  imap: Imap,
  criteria: SearchCriterion[],
): Promise<number[]> {
  return new Promise<number[]>((resolve, reject) => {
    imap.search(criteria, (err, uids) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(uids);
    });
  });
}

interface FetchedRaw {
  uid: number;
  flags: string[];
  raw: Buffer;
  receivedAt: Date;
}

function fetchRaw(imap: Imap, uids: number[]): Promise<FetchedRaw[]> {
  return new Promise<FetchedRaw[]>((resolve, reject) => {
    if (uids.length === 0) {
      resolve([]);
      return;
    }
    const out: FetchedRaw[] = [];
    const fetch = imap.fetch(uids, { bodies: "", markSeen: false });
    fetch.on("message", (msg) => {
      const chunks: Buffer[] = [];
      let uid = 0;
      let flags: string[] = [];
      let receivedAt = new Date(0);
      msg.on("body", (stream) => {
        stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      });
      msg.once("attributes", (attrs: Imap.ImapMessageAttributes) => {
        uid = attrs.uid;
        flags = attrs.flags;
        receivedAt = attrs.date;
      });
      msg.once("end", () => {
        out.push({ uid, flags, raw: Buffer.concat(chunks), receivedAt });
      });
    });
    fetch.once("error", (err: Error) => reject(err));
    fetch.once("end", () => resolve(out));
  });
}

async function parseFull(item: FetchedRaw): Promise<InboxMessageFull> {
  // Lazy: mailparser's module graph (libmime charsets, encoding tables,
  // linkify TLD regex) costs ~80 ms of sync evaluation; loading it statically
  // put that on the event loop of every process importing this module.
  const { simpleParser } = await import("mailparser");
  const parsed = await simpleParser(item.raw);
  const text = parsed.text ?? "";
  return {
    uid: item.uid,
    from: parsed.from?.text ?? "",
    to: Array.isArray(parsed.to)
      ? parsed.to.map((a) => a.text).join(", ")
      : (parsed.to?.text ?? ""),
    subject: parsed.subject ?? "",
    date: (parsed.date ?? new Date(0)).toISOString(),
    messageId: parsed.messageId ?? "",
    snippet: makeSnippet(text),
    unread: !item.flags.includes("\\Seen"),
    bodyText: text,
  };
}

/** Newest-first INBOX summaries. Filtering happens server-side before the limit. */
export function listInbox(
  config: SystemMailboxConfig["imap"],
  options: { limit: number; unreadOnly: boolean },
): Promise<InboxMessageSummary[]> {
  return withImap(config, async (imap) => {
    await openInbox(imap);
    const uids = await searchUids(imap, [
      options.unreadOnly ? "UNSEEN" : "ALL",
    ]);
    const newest = uids.slice(-options.limit);
    const fetched = await fetchRaw(imap, newest);
    const parsed = await Promise.all(fetched.map(parseFull));
    return parsed
      .toSorted((a, b) => b.uid - a.uid)
      .map((m): InboxMessageSummary => ({
        uid: m.uid,
        from: m.from,
        subject: m.subject,
        date: m.date,
        snippet: m.snippet,
        unread: m.unread,
      }));
  });
}

/** One INBOX message by UID, or null when it does not exist. */
export function readInboxMessage(
  config: SystemMailboxConfig["imap"],
  uid: number,
): Promise<InboxMessageFull | null> {
  return withImap(config, async (imap) => {
    await openInbox(imap);
    const fetched = await fetchRaw(imap, [uid]);
    const first = fetched[0];
    return first ? await parseFull(first) : null;
  });
}

const DELIVERY_REPORT_CHECKED = "SignupDsnChecked";
const DELIVERY_REPORT_LIMIT = 50;
const DELIVERY_REPORT_MAX_BYTES = 512_000;

/** Reads by UID without changing flags until the caller has processed the report. */
export function visitDeliveryReports(
  config: SystemMailboxConfig["imap"],
  since: Date,
  visit: (message: FetchedRaw) => Promise<{ markSeen: boolean } | null>,
): Promise<void> {
  return withImap(
    config,
    async (imap) => {
      const box = await openInbox(imap, false);
      const supportsKeyword = box.newKeywords;
      const candidates = (
        await searchUids(imap, [
          ["SINCE", since],
          ["SMALLER", DELIVERY_REPORT_MAX_BYTES],
          supportsKeyword ? ["UNKEYWORD", DELIVERY_REPORT_CHECKED] : "UNSEEN",
          [
            "OR",
            ["HEADER", "Content-Type", "multipart/report"],
            [
              "OR",
              ["HEADER", "X-Failed-Recipients", ""],
              ["OR", ["FROM", "mailer-daemon"], ["FROM", "postmaster"]],
            ],
          ],
        ])
      ).toSorted((a, b) => b - a);
      for (
        let offset = 0;
        offset < Math.min(candidates.length, DELIVERY_REPORT_LIMIT);
        offset += 5
      ) {
        const messages = await fetchRaw(
          imap,
          candidates.slice(offset, offset + 5),
        );
        for (const message of messages) {
          const outcome = await visit(message);
          if (outcome?.markSeen && !message.flags.includes("\\Seen")) {
            await new Promise<void>((resolve, reject) => {
              imap.addFlags(message.uid, "\\Seen", (err) =>
                err ? reject(err) : resolve(),
              );
            });
          }
          if (outcome && supportsKeyword) {
            await new Promise<void>((resolve, reject) => {
              imap.addKeywords(message.uid, DELIVERY_REPORT_CHECKED, (err) =>
                err ? reject(err) : resolve(),
              );
            });
          }
        }
      }
    },
    true,
  );
}

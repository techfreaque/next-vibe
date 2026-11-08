/**
 * System Mailbox IMAP Operations
 * Thin promise wrappers over the `imap` client already used by the messenger
 * IMAP stack (same library, same parser): append-to-Sent, list INBOX, read one.
 */

import "server-only";

import Imap from "imap";
import { simpleParser } from "mailparser";

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

function connect(config: SystemMailboxConfig["imap"]): Promise<Imap> {
  return new Promise<Imap>((resolve, reject) => {
    const imap = new Imap({
      user: config.username,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.secure,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 15000,
      authTimeout: 10000,
    });
    imap.once("ready", () => resolve(imap));
    imap.once("error", (err: Error) => reject(err));
    imap.connect();
  });
}

async function withImap<T>(
  config: SystemMailboxConfig["imap"],
  fn: (imap: Imap) => Promise<T>,
): Promise<T> {
  const imap = await connect(config);
  try {
    return await fn(imap);
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

function openInbox(imap: Imap): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // readOnly = true: reading never changes \Seen flags
    imap.openBox("INBOX", true, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function searchUids(imap: Imap, criteria: string[]): Promise<number[]> {
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
}

function fetchRaw(imap: Imap, uids: number[]): Promise<FetchedRaw[]> {
  return new Promise<FetchedRaw[]>((resolve, reject) => {
    if (uids.length === 0) {
      resolve([]);
      return;
    }
    const out: FetchedRaw[] = [];
    const fetch = imap.fetch(uids, { bodies: "" });
    fetch.on("message", (msg) => {
      const chunks: Buffer[] = [];
      let uid = 0;
      let flags: string[] = [];
      msg.on("body", (stream) => {
        stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      });
      msg.once("attributes", (attrs) => {
        uid = attrs.uid;
        flags = attrs.flags;
      });
      msg.once("end", () => {
        out.push({ uid, flags, raw: Buffer.concat(chunks) });
      });
    });
    fetch.once("error", (err: Error) => reject(err));
    fetch.once("end", () => resolve(out));
  });
}

async function parseFull(item: FetchedRaw): Promise<InboxMessageFull> {
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

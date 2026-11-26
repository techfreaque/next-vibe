import "server-only";

import { createHash } from "node:crypto";

import type Imap from "imap";

import { createImap } from "@/messenger/providers/email/imap-client/safe-imap";

import type { SystemMailboxConfig } from "../config";
import { maxMessageBytes } from "./attachments";

const processedFlag = "$VibeBillProcessed";

export interface BillMailboxMessage {
  uid: number;
  raw: Buffer | null;
}

export interface BillMailbox {
  namespace: string;
  uidValidity: string;
  uids: readonly number[];
  read: (uid: number) => Promise<BillMailboxMessage | null>;
  markProcessed: (uid: number) => Promise<boolean>;
  close: () => void;
}

function connect(config: SystemMailboxConfig["imap"]): Promise<Imap | null> {
  return new Promise((resolve) => {
    const imap = createImap({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      tls: config.secure,
      tlsOptions: { rejectUnauthorized: true, servername: config.host },
      connTimeout: 12000,
      authTimeout: 12000,
    });
    const finish = (connection: Imap | null): void => {
      clearTimeout(deadline);
      imap.off("ready", ready);
      imap.off("error", failed);
      imap.off("close", failed);
      resolve(connection);
      if (!connection) {
        imap.destroy();
      }
    };
    const ready = (): void => finish(imap);
    const failed = (): void => finish(null);
    const deadline = setTimeout(failed, 25000);
    imap.once("ready", ready);
    imap.once("error", failed);
    imap.once("close", failed);
    imap.connect();
  });
}

function selectBox(
  imap: Imap,
  folder: string,
  readOnly: boolean,
): Promise<Imap.Box | null> {
  return new Promise((resolve) => {
    imap.openBox(folder, readOnly, (error, box) => resolve(error ? null : box));
  });
}

function search(
  imap: Imap,
  sender: string,
  skipProcessed: boolean,
): Promise<number[] | null> {
  const criteria = skipProcessed
    ? [
        ["FROM", sender],
        ["UNKEYWORD", processedFlag],
      ]
    : [["FROM", sender]];
  return new Promise((resolve) => {
    imap.search(criteria, (error, uids) => resolve(error ? null : uids));
  });
}

function readMail(imap: Imap, uid: number): Promise<BillMailboxMessage | null> {
  return new Promise((resolve) => {
    const fetch = imap.fetch(uid, { bodies: "", markSeen: false, size: true });
    let result: BillMailboxMessage | null = null;
    fetch.on("message", (message) => {
      let total = 0;
      const parts: Buffer[] = [];
      let selectedUid: number | undefined;
      message.once("attributes", (attributes) => {
        selectedUid = attributes.uid;
        if ((attributes.size ?? 0) > maxMessageBytes) {
          total = maxMessageBytes + 1;
        }
      });
      message.on("body", (stream) => {
        stream.on("data", (chunk: Buffer) => {
          total += chunk.length;
          if (total <= maxMessageBytes) {
            parts.push(chunk);
          }
        });
        stream.once("error", () => {
          total = maxMessageBytes + 1;
        });
      });
      message.once("end", () => {
        if (selectedUid === uid) {
          result = {
            uid,
            raw: total > maxMessageBytes ? null : Buffer.concat(parts),
          };
        }
      });
    });
    fetch.once("error", () => resolve(null));
    fetch.once("end", () => resolve(result));
  });
}

export async function openBillMailbox(
  config: SystemMailboxConfig["imap"],
  folder: string,
  senders: readonly string[],
  limit: number,
  dryRun: boolean,
  includeProcessed = false,
  excludeUids?: (
    namespace: string,
    uidValidity: string,
  ) => Promise<ReadonlySet<number>>,
): Promise<BillMailbox | null> {
  const imap = await connect(config);
  if (!imap) {
    return null;
  }
  const box = await selectBox(imap, folder, dryRun);
  if (
    !box ||
    !box.persistentUIDs ||
    !Number.isSafeInteger(box.uidvalidity) ||
    box.uidvalidity <= 0
  ) {
    imap.end();
    return null;
  }
  const supportsFlag = box.newKeywords || box.permFlags.includes(processedFlag);
  const matches = await Promise.all(
    [...new Set(senders)].map((sender) =>
      search(imap, sender, supportsFlag && !includeProcessed),
    ),
  );
  if (matches.some((set) => set === null)) {
    imap.end();
    return null;
  }
  const namespace = createHash("sha256")
    .update(
      JSON.stringify([
        config.host.toLowerCase(),
        config.port,
        config.username.toLowerCase(),
        box.name,
      ]),
    )
    .digest("hex");
  const uidValidity = String(box.uidvalidity);
  const excluded = await excludeUids?.(namespace, uidValidity).catch(
    () => null,
  );
  if (excluded === null) {
    imap.end();
    return null;
  }
  const uids = [...new Set(matches.flatMap((set) => set ?? []))]
    .filter(
      (uid) => Number.isSafeInteger(uid) && uid > 0 && !excluded?.has(uid),
    )
    .toSorted((left, right) => left - right)
    .slice(0, limit);
  return {
    namespace,
    uidValidity,
    uids,
    read: (uid) => readMail(imap, uid),
    markProcessed: (uid) => {
      if (dryRun || !supportsFlag || box.readOnly) {
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        imap.addFlags(uid, processedFlag, (error) => resolve(!error));
      });
    },
    close: () => imap.end(),
  };
}

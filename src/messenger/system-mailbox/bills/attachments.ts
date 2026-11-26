import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { identityEnv } from "next-vibe/identity/env";
import { z } from "zod";

export const maxMessageBytes = 7 * 1024 * 1024;
const maxEvidenceBytes = 4 * 1024 * 1024;
const maxTextLength = 95000;
const maxFiles = 4;

const proofSchema = z
  .array(
    z.object({
      kind: z.enum(["pdf", "html", "text"]),
      data: z.string().max(Math.ceil((maxEvidenceBytes * 4) / 3) + 4),
    }),
  )
  .max(maxFiles);
export type Evidence = z.infer<typeof proofSchema>;

function key(): Buffer {
  return createHash("sha256")
    .update("bill-mailbox-evidence/v1:")
    .update(identityEnv.VIBE_SECRET_KEY ?? identityEnv.JWT_SECRET_KEY)
    .digest();
}

export function encryptEvidence(evidence: Evidence, source: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from(source, "utf8"));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(evidence), "utf8"),
    cipher.final(),
  ]);
  return [
    "v1",
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

export function decryptEvidence(
  encrypted: string,
  source: string,
): Evidence | undefined {
  const [version, iv, tag, data] = encrypted.split(":");
  if (version !== "v1" || !iv || !tag || !data) {
    return undefined;
  }
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    decipher.setAAD(Buffer.from(source, "utf8"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(data, "base64url")),
      decipher.final(),
    ]);
    const parsed = proofSchema.safeParse(JSON.parse(plain.toString("utf8")));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

function textFromHtml(html: string): string {
  return html
    .replaceAll(
      /<(script|style|iframe|object|head)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      "",
    )
    .replaceAll(/<\/(?:tr|p|div|li|h[1-6])\s*>|<br\s*\/?>/gi, "\n")
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll(/&(?:nbsp|#160);/gi, " ")
    .replaceAll(/&(?:lt|#60);/gi, "<")
    .replaceAll(/&(?:gt|#62);/gi, ">")
    .replaceAll(/&amp;/gi, "&")
    .replaceAll(/&(?:euro|#8364);/gi, "€")
    .replaceAll(/&(?:pound|#163);/gi, "£")
    .replaceAll(/[\t ]+/g, " ");
}

interface SupplierMail {
  sender: string | undefined;
  recipients: string[];
  subject: string | undefined;
  forwarded: { sender: string; subject: string } | undefined;
  texts: string[];
  evidence: Evidence;
  incomplete: boolean;
}

function forwardedDocument(
  body: string,
): { sender: string; subject: string; content: string } | undefined {
  const sections = body.split(
    /^\s*(?:-{2,}\s*(?:Forwarded message|Original Message)\s*-{2,}|Begin forwarded message:)\s*$/im,
  );
  const [, forwarded] = sections;
  if (sections.length !== 2 || !forwarded) {
    return undefined;
  }
  const lines = forwarded.trimStart().split(/\r?\n/);
  let firstContentLine = 0;
  let from: string | undefined;
  let subject: string | undefined;
  for (const [index, line] of lines.entries()) {
    const header = /^(From|Date|Sent|To|Cc|Subject|Reply-To):[ \t]*(.*)$/i.exec(
      line.trim(),
    );
    if (!header && line.trim()) {
      break;
    }
    firstContentLine = index + 1;
    switch (header?.[1]?.toLowerCase()) {
      case "from":
        if (from !== undefined) {
          return undefined;
        }
        from = header[2]?.trim();
        break;
      case "subject":
        if (subject !== undefined) {
          return undefined;
        }
        subject = header[2]?.trim();
        break;
    }
  }
  const content = lines.slice(firstContentLine).join("\n");
  const sender = from && (/^.*<\s*([^<>\s]+)\s*>$/.exec(from)?.[1] ?? from);
  return sender && subject && z.email().safeParse(sender).success
    ? { sender: sender.toLowerCase(), subject, content }
    : undefined;
}

export async function readSupplierMail(
  raw: Buffer,
  allowForwarded = true,
): Promise<SupplierMail> {
  const { simpleParser } = await import("mailparser");
  const message = await simpleParser(raw, {
    skipHtmlToText: true,
    skipTextToHtml: true,
  });
  const sender =
    message.from?.value.length === 1
      ? message.from.value[0]?.address?.toLowerCase()
      : undefined;
  const recipients = (
    Array.isArray(message.to) ? message.to : message.to ? [message.to] : []
  ).flatMap((header) =>
    header.value.flatMap(({ address }) =>
      address ? [address.toLowerCase()] : [],
    ),
  );
  const evidence: Evidence = [];
  const texts: string[] = [];
  let incomplete = false;
  let bytes = 0;

  const forwardedMessages = message.attachments.filter(
    ({ contentType }) => contentType === "message/rfc822",
  );
  if (allowForwarded && forwardedMessages.length === 1) {
    const [forwardedMessage] = forwardedMessages;
    if (
      forwardedMessage &&
      forwardedMessage.content.length <= maxMessageBytes
    ) {
      const original = await readSupplierMail(forwardedMessage.content, false);
      return {
        sender,
        recipients,
        subject: message.subject,
        forwarded:
          original.sender && original.subject
            ? { sender: original.sender, subject: original.subject }
            : undefined,
        texts: original.texts,
        evidence: original.evidence,
        incomplete: original.incomplete || message.attachments.length !== 1,
      };
    }
  }
  incomplete ||= forwardedMessages.length > 0;

  for (const attachment of message.attachments) {
    const { content, contentType } = attachment;
    const kind =
      contentType === "application/pdf" &&
      content.subarray(0, 5).toString("ascii") === "%PDF-"
        ? "pdf"
        : contentType === "text/html"
          ? "html"
          : undefined;
    if (!kind) {
      if (/\.(?:pdf|html?)$/i.test(attachment.filename ?? "")) {
        incomplete = true;
      }
      continue;
    }
    if (
      evidence.length >= maxFiles ||
      bytes + content.length > maxEvidenceBytes
    ) {
      incomplete = true;
      continue;
    }
    bytes += content.length;
    evidence.push({ kind, data: content.toString("base64") });
    if (kind === "html") {
      const html = content.toString("utf8");
      incomplete ||= html.length > maxTextLength;
      texts.push(textFromHtml(html.slice(0, maxTextLength)));
      continue;
    }
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(content) });
    try {
      const parsed = await parser.getText({ first: 5 });
      incomplete ||= parsed.total > 5 || parsed.text.length > maxTextLength;
      texts.push(parsed.text.slice(0, maxTextLength));
    } catch {
      incomplete = true;
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }

  const body =
    message.text ??
    (message.html ? textFromHtml(message.html.slice(0, maxTextLength)) : "");
  incomplete ||=
    body.length > maxTextLength ||
    (!message.text &&
      typeof message.html === "string" &&
      message.html.length > maxTextLength);
  const forwarded = allowForwarded ? forwardedDocument(body) : undefined;
  const content = forwarded?.content ?? body;
  if (content.trim()) {
    texts.push(content.slice(0, maxTextLength));
    if (evidence.length === 0) {
      const original = Buffer.from(
        forwarded?.content ?? (message.html || message.text || body),
        "utf8",
      );
      if (original.length > maxEvidenceBytes) {
        incomplete = true;
      }
      evidence.push({
        kind: !forwarded && message.html ? "html" : "text",
        data: original.subarray(0, maxEvidenceBytes).toString("base64"),
      });
    }
  }
  return {
    sender,
    recipients,
    subject: message.subject,
    forwarded: forwarded
      ? { sender: forwarded.sender, subject: forwarded.subject }
      : undefined,
    evidence,
    texts,
    incomplete,
  };
}

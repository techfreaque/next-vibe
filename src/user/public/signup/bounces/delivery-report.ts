import "server-only";

import {
  SignupBounceReason,
  type SignupBounceReasonValue,
} from "../bounce-reason";

interface FailedRecipient {
  recipient: string;
  reason: typeof SignupBounceReasonValue;
}

export interface DeliveryReport {
  failures: FailedRecipient[];
  messageId?: string;
  sentAt?: Date;
  sender?: string;
  subject?: string;
}

function readHeaders(block: string): Map<string, string> {
  const headers = new Map<string, string>();
  const unfolded = block.replace(/\r?\n[ \t]+/g, " ");
  for (const line of unfolded.split(/\r?\n/)) {
    const match = /^([\w-]+):[ \t]*(.*)$/.exec(line);
    if (match) {
      headers.set(match[1].toLowerCase(), match[2].trim());
    }
  }
  return headers;
}

function recipientAddress(value: string): string | undefined {
  return /^(?:rfc822;\s*|utf-8;\s*)?<?([^\s<>,;@]+@[^\s<>,;@]+)>?$/iu
    .exec(value.trim())?.[1]
    ?.toLowerCase();
}

function classify(diagnostic: string): typeof SignupBounceReasonValue {
  if (
    /\b5\.7\.(?:1|12|124|133|134)\b|mail flow rule|not permitted to receive email from outside|external senders? (?:are |is )?not (?:allowed|permitted)/i.test(
      diagnostic,
    )
  ) {
    return SignupBounceReason.POLICY;
  }
  if (
    /\b5\.1\.(?:1|10)\b|user unknown|(?:recipient|address|account|mailbox).{0,70}(?:not found|does not exist|doesn.t exist)/i.test(
      diagnostic,
    )
  ) {
    return SignupBounceReason.MAILBOX_MISSING;
  }
  if (
    /\b[45]\.2\.2\b|mailbox full|over quota|quota exceeded/i.test(diagnostic)
  ) {
    return SignupBounceReason.MAILBOX_FULL;
  }
  return SignupBounceReason.OTHER;
}

function structuredFailures(status: string): FailedRecipient[] {
  const failures: FailedRecipient[] = [];
  for (const block of status.split(/\r?\n[ \t]*\r?\n/)) {
    const fields = readHeaders(block);
    const action = fields.get("action")?.toLowerCase();
    const code = fields.get("status") ?? "";
    if (action !== "failed" && (action || !code.startsWith("5."))) {
      continue;
    }
    const recipient =
      recipientAddress(fields.get("original-recipient") ?? "") ??
      recipientAddress(fields.get("final-recipient") ?? "");
    if (recipient) {
      failures.push({
        recipient,
        reason: classify(`${code} ${fields.get("diagnostic-code") ?? ""}`),
      });
    }
  }
  return failures;
}

function textFailures(
  text: string,
  headerRecipients: string | undefined,
): FailedRecipient[] {
  if (
    !/\b5[0-9]{2}(?:[ -]|$)|\b5\.\d{1,3}\.\d{1,3}\b|mail flow rule|not permitted to receive email from outside/i.test(
      text,
    )
  ) {
    return [];
  }
  const explicitRecipient =
    /(?:your message (?:wasn.t|was not|could not be) delivered to|delivery (?:has )?failed (?:permanently )?to:)\s*<?([^\s<>@]+@[^\s<>@,;)]+)/i.exec(
      text,
    )?.[1] ??
    /^delivery has failed to these recipients or groups:\s*(?:[^\r\n]*?\()?<?([^\s<>@]+@[^\s<>@,;)]+)>?\)?\s*$/im.exec(
      text,
    )?.[1];
  const recipients = headerRecipients?.split(",") ?? [explicitRecipient ?? ""];
  return recipients.flatMap((value) => {
    const recipient = recipientAddress(value);
    return recipient ? [{ recipient, reason: classify(text) }] : [];
  });
}

function originalMessageId(value: string | undefined): string | undefined {
  const id = /^<?([^<>\s]+@[^<>\s]+)>?$/.exec(value?.trim() ?? "")?.[1];
  return id ? `<${id}>` : undefined;
}

export async function parseDeliveryReport(
  raw: Buffer,
): Promise<DeliveryReport | null> {
  const root = readHeaders(raw.toString("utf8").split(/\r?\n\r?\n/, 1)[0]);
  const standardReport =
    /^multipart\/report\b.*\breport-type\s*=\s*"?delivery-status\b/i.test(
      root.get("content-type") ?? "",
    );
  const failedRecipients = root.get("x-failed-recipients");
  const deliveryAgent =
    /(?:mailer-daemon|postmaster)@|mail delivery (?:system|subsystem)/i.test(
      root.get("from") ?? "",
    );
  if (!standardReport && !deliveryAgent && !failedRecipients) {
    return null;
  }
  const { simpleParser } = await import("mailparser");
  const parsed = await simpleParser(raw, {
    keepDeliveryStatus: true,
    keepCidLinks: true,
    skipTextToHtml: true,
    maxHtmlLengthToParse: 256_000,
  });
  const status = parsed.attachments
    .filter((part) => part.contentType === "message/delivery-status")
    .map((part) => part.content.toString("utf8"));
  const [text, quotedHeaders] = (parsed.text ?? "").split(
    /^original message headers\s*:/im,
    2,
  );
  const failures = status.length
    ? status.flatMap(structuredFailures)
    : textFailures(text, failedRecipients);
  if (!failures.length) {
    return null;
  }

  const originalPart = parsed.attachments.find(
    (part) =>
      part.contentType === "message/rfc822" ||
      part.contentType === "text/rfc822-headers",
  );
  const originalSource = originalPart?.content ?? quotedHeaders?.trim();
  const original = originalSource
    ? await simpleParser(originalSource, {
        keepCidLinks: true,
        skipHtmlToText: true,
        skipTextToHtml: true,
      })
    : undefined;
  const messageId = [
    original?.messageId,
    root.get("original-message-id"),
    root.get("x-original-message-id"),
    ...status.map((part) =>
      readHeaders(part.split(/\r?\n[ \t]*\r?\n/, 1)[0]).get(
        "original-message-id",
      ),
    ),
    parsed.inReplyTo,
  ]
    .map(originalMessageId)
    .find(Boolean);
  return {
    failures,
    messageId,
    sentAt: original?.date,
    sender: original?.from?.value[0]?.address?.toLowerCase(),
    subject: original?.subject,
  };
}

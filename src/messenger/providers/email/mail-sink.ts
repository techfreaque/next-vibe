/**
 * Local Mail Sink
 *
 * Outside production, outgoing email never reaches a real mail server. Every
 * message is rendered to RFC822, written to `.tmp/mail-sink/<ts>-<to>.eml`
 * for inspection and logged. Real sending from dev needs
 * `VIBE_DEV_REAL_SMTP=true`; tests (NODE_ENV=test) always sink.
 *
 * Prod behaviour is unchanged: NODE_ENV=production never sinks.
 */

import "server-only";

import { mkdir, writeFile } from "node:fs";
import { join } from "node:path";

import { coreEnv } from "next-vibe/core/env";
import { parseError } from "next-vibe/core/utils/parse-error";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  MailMessage,
  SendMailOptions,
  Transport,
  Transporter,
} from "nodemailer";
import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { messengerEnv } from "../../env";

export const MAIL_SINK_DIR = join(".tmp", "mail-sink");

/** Pure decision, exported for tests. */
export function shouldSinkMail(
  nodeEnv: Environment,
  realSmtpFlag: boolean,
): boolean {
  if (nodeEnv === Environment.TEST) {
    return true;
  }
  if (nodeEnv === Environment.PRODUCTION) {
    return false;
  }
  return !realSmtpFlag;
}

export function isMailSinkActive(): boolean {
  return shouldSinkMail(coreEnv.NODE_ENV, messengerEnv.VIBE_DEV_REAL_SMTP);
}

function sinkFileName(to: string, now: Date): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  const safeTo = to.replace(/[^a-zA-Z0-9@._-]/g, "_").slice(0, 80);
  const tail = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${safeTo || "unknown"}-${tail}.eml`;
}

function storeSinkedMail(
  raw: Buffer,
  meta: { from: string; to: string; subject: string },
  logger: EndpointLogger,
  done: (file: string) => void,
): void {
  const file = join(MAIL_SINK_DIR, sinkFileName(meta.to, new Date()));
  const finish = (error: NodeJS.ErrnoException | null): void => {
    if (error) {
      // The sink must never turn into a real send; a failed write only logs.
      logger.warn("mail-sink: could not store message", {
        file,
        error: parseError(error).message,
      });
    }
    logger.info("mail-sink: email captured, not sent (non-production)", {
      from: meta.from,
      to: meta.to,
      subject: meta.subject,
      file,
      enableRealSending: "VIBE_DEV_REAL_SMTP=true",
    });
    done(file);
  };
  mkdir(MAIL_SINK_DIR, { recursive: true }, (mkdirError) => {
    if (mkdirError) {
      finish(mkdirError);
      return;
    }
    writeFile(file, raw, finish);
  });
}

/**
 * Store an already rendered RFC822 message in the sink.
 * Returns the file path (relative to the repo root).
 */
export function writeSinkedMail(
  raw: Buffer,
  meta: { from: string; to: string; subject: string },
  logger: EndpointLogger,
): Promise<string> {
  return new Promise<string>((resolve) => {
    storeSinkedMail(raw, meta, logger, resolve);
  });
}

type SinkSendCallback = Parameters<
  Transport<SMTPTransport.SentMessageInfo>["send"]
>[1];

/**
 * nodemailer transport with the SMTP result shape that writes to the sink.
 * Drop-in for the SMTP transport, including `verify()`.
 */
class MailSinkTransport implements Transport<SMTPTransport.SentMessageInfo> {
  readonly name = "vibe-mail-sink";
  readonly version = "1.0.0";

  constructor(private readonly logger: EndpointLogger) {}

  send(
    mail: MailMessage<SMTPTransport.SentMessageInfo>,
    callback: SinkSendCallback,
  ): void {
    const envelope = mail.message.getEnvelope();
    const messageId = mail.message.messageId();
    const started = Date.now();
    mail.message.build((buildError, raw) => {
      if (buildError) {
        callback(buildError);
        return;
      }
      storeSinkedMail(
        raw,
        {
          from: envelope.from || "",
          to: envelope.to.join(", "),
          subject: mail.data.subject ?? "",
        },
        this.logger,
        (file) =>
          callback(null, {
            envelope,
            messageId,
            accepted: envelope.to,
            rejected: [],
            envelopeTime: 0,
            messageTime: Date.now() - started,
            messageSize: raw.length,
            response: `250 mail-sink ${file}`,
          }),
      );
    });
  }

  verify(): Promise<true> {
    return Promise.resolve(true);
  }
}

export function createMailSinkTransport(
  logger: EndpointLogger,
): Transporter<SMTPTransport.SentMessageInfo> {
  return createTransport(new MailSinkTransport(logger));
}

/** Render and sink an arbitrary message (used by non-SMTP providers). */
export async function sinkMail(
  options: SendMailOptions,
  logger: EndpointLogger,
): Promise<SMTPTransport.SentMessageInfo> {
  return createMailSinkTransport(logger).sendMail(options);
}

import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import { SignupBounceReason } from "../bounce-reason";
import { parseDeliveryReport } from "./delivery-report";

async function sample(name: string): ReturnType<typeof parseDeliveryReport> {
  return parseDeliveryReport(
    await readFile(new URL(`./fixtures/${name}.eml`, import.meta.url)),
  );
}

describe("signup delivery reports", () => {
  it("classifies the Office 365 external mail rule rejection", async () => {
    const report = await sample("office365-policy");
    expect(report).toMatchObject({
      failures: [
        {
          recipient: "student@live.cvesd.org",
          reason: SignupBounceReason.POLICY,
        },
      ],
      messageId: "<signup-office365@unbottled.ai>",
      subject: "Confirm my email",
      sender: "hi@unbottled.ai",
    });
  });

  it("classifies Gmail 550 5.1.1 and reads the returned message ID", async () => {
    const report = await sample("gmail-address-not-found");
    expect(report).toMatchObject({
      failures: [
        {
          recipient: "missing@example.com",
          reason: SignupBounceReason.MAILBOX_MISSING,
        },
      ],
      messageId: "<signup-gmail@unbottled.ai>",
    });
  });

  it("reads RFC 3464 recipients independently and ignores delayed mail", async () => {
    const report = await sample("rfc3464-mixed-outcomes");
    expect(report).toEqual({
      failures: [
        {
          recipient: "full@example.org",
          reason: SignupBounceReason.MAILBOX_FULL,
        },
        { recipient: "other@example.org", reason: SignupBounceReason.OTHER },
      ],
      messageId: undefined,
      sentAt: new Date("2026-11-18T22:23:00Z"),
      sender: "hi@unbottled.ai",
      subject: "Confirm my email",
    });
  });

  it("accepts a Gmail failure without a structured MIME part", async () => {
    const report = await parseDeliveryReport(
      Buffer.from(
        [
          "From: Mail Delivery Subsystem <mailer-daemon@googlemail.com>",
          "Subject: Delivery Status Notification (Failure)",
          "In-Reply-To: <original@unbottled.ai>",
          "",
          "Your message wasn't delivered to missing@example.com because the address couldn't be found.",
          "",
          "550 5.1.1 The email account that you tried to reach does not exist.",
        ].join("\r\n"),
      ),
    );
    expect(report).toMatchObject({
      failures: [
        {
          recipient: "missing@example.com",
          reason: SignupBounceReason.MAILBOX_MISSING,
        },
      ],
      messageId: "<original@unbottled.ai>",
    });
  });

  it("ignores ordinary emails quoting delivery errors", async () => {
    const result = await parseDeliveryReport(
      Buffer.from(
        "From: user@example.com\r\n\r\nYour message wasn't delivered to example@example.com. 550 5.1.1",
      ),
    );
    expect(result).toBeNull();
  });
});

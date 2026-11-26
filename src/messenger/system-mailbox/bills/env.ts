import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const mailboxBindingSchema = z.object({
  sender: z.email().transform((address) => address.toLowerCase()),
  recipient: z
    .email()
    .transform((address) => address.toLowerCase())
    .optional(),
  companyId: z.uuid(),
  vendorId: z.uuid(),
  debitAccountId: z.uuid(),
  nativeCurrency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .optional(),
  autoDraft: z.boolean().optional(),
  providerSender: z
    .email()
    .transform((address) => address.toLowerCase())
    .optional(),
  providerSubjectPrefix: z.string().trim().min(4).max(100).optional(),
  allowAiReview: z.boolean().optional(),
});

export const {
  env: billMailboxEnv,
  schema: billMailboxEnvSchema,
  examples: billMailboxEnvExamples,
} = defineEnv({
  THEA_MAIL_BILLS_ENABLED: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment: "Opt in to production IMAP bill intake.",
    commented: true,
  },
  THEA_MAIL_BILLS_FOLDER: {
    schema: z.string().trim().min(1).max(120).optional().default("Bills"),
    example: "Bills",
    comment: "Folder scanned without setting the Seen flag.",
    commented: true,
  },
  THEA_MAIL_BILLS_BINDINGS: {
    schema: z.string().max(30000).optional(),
    example: "[]",
    comment:
      "JSON array of explicit mail recipient, sender, company, supplier and debit account bindings. For autoDraft, use a trusted Bills folder and set recipient, providerSender and providerSubjectPrefix.",
    commented: true,
  },
  THEA_MAIL_BILLS_UNATTENDED_APPLY: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment:
      "Allow an explicitly owned cron task to save supplier bill drafts. Leave disabled while reviewing previews.",
    commented: true,
  },
  THEA_MAIL_BILLS_ACTOR: {
    schema: z.uuid().optional(),
    example: "00000000-0000-4000-8000-000000000000",
    comment: "Company document manager allowed to run scheduled bill intake.",
    commented: true,
  },
});

export type MailboxBinding = z.output<typeof mailboxBindingSchema>;

export function readMailboxBindings(): MailboxBinding[] {
  try {
    const entries = z
      .array(mailboxBindingSchema)
      .max(60)
      .safeParse(JSON.parse(billMailboxEnv.THEA_MAIL_BILLS_BINDINGS ?? "[]"));
    return entries.success ? entries.data : [];
  } catch {
    return [];
  }
}

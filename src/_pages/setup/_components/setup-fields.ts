/**
 * Settings the /setup page asks for, grouped by step section. Each entry maps
 * a human label (i18n key) to the env key the settings PATCH writes. The env
 * key itself is shown only as a small "advanced" detail.
 */

import type { EnvKeyName } from "@/generated/env/keys";

export type SetupFieldKind =
  | "text"
  | "secret"
  | "email"
  | "number"
  | "boolean"
  | "select";

export type SetupFieldId =
  | "openRouter"
  | "venice"
  | "nanoGpt"
  | "openAi"
  | "smtpHost"
  | "smtpPort"
  | "smtpSecure"
  | "smtpUser"
  | "smtpPass"
  | "smtpFromEmail"
  | "smtpFromName"
  | "stripeSecret"
  | "stripePublishable"
  | "stripeWebhook"
  | "storageType"
  | "s3Endpoint"
  | "s3Region"
  | "s3Bucket"
  | "s3AccessKey"
  | "s3SecretKey"
  | "s3PublicUrl";

export interface SetupField {
  id: SetupFieldId;
  envKey: EnvKeyName;
  kind: SetupFieldKind;
  /** Where to get the value, shown as a link next to the help text. */
  getKeyUrl?: string;
  options?: readonly string[];
}

export type SetupSectionId = "email" | "payments" | "storage";

export interface SetupSection {
  id: SetupSectionId;
  /** The setting that tells whether this extra is set up (not one with a default). */
  statusKey: EnvKeyName;
  fields: readonly SetupField[];
}

export const PROVIDER_FIELDS: readonly SetupField[] = [
  {
    id: "openRouter",
    envKey: "OPENROUTER_API_KEY",
    kind: "secret",
    getKeyUrl: "https://openrouter.ai/keys",
  },
  {
    id: "venice",
    envKey: "VENICE_AI_API_KEY",
    kind: "secret",
    getKeyUrl: "https://venice.ai/settings/api",
  },
  {
    id: "nanoGpt",
    envKey: "NANO_GPT_API_KEY",
    kind: "secret",
    getKeyUrl: "https://nano-gpt.com/api",
  },
  {
    id: "openAi",
    envKey: "OPENAI_API_KEY",
    kind: "secret",
    getKeyUrl: "https://platform.openai.com/api-keys",
  },
];

export const STORAGE_S3 = "s3" as const;

export const EXTRA_SECTIONS: readonly SetupSection[] = [
  {
    id: "email",
    statusKey: "EMAIL_HOST",
    fields: [
      { id: "smtpHost", envKey: "EMAIL_HOST", kind: "text" },
      { id: "smtpPort", envKey: "EMAIL_PORT", kind: "number" },
      { id: "smtpSecure", envKey: "EMAIL_SECURE", kind: "boolean" },
      { id: "smtpUser", envKey: "EMAIL_USER", kind: "text" },
      { id: "smtpPass", envKey: "EMAIL_PASS", kind: "secret" },
      { id: "smtpFromEmail", envKey: "EMAIL_FROM_EMAIL", kind: "email" },
      { id: "smtpFromName", envKey: "EMAIL_FROM_NAME", kind: "text" },
    ],
  },
  {
    id: "payments",
    statusKey: "STRIPE_SECRET_KEY",
    fields: [
      {
        id: "stripeSecret",
        envKey: "STRIPE_SECRET_KEY",
        kind: "secret",
        getKeyUrl: "https://dashboard.stripe.com/apikeys",
      },
      {
        id: "stripePublishable",
        envKey: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        kind: "text",
      },
      {
        id: "stripeWebhook",
        envKey: "STRIPE_WEBHOOK_SECRET",
        kind: "secret",
        getKeyUrl: "https://dashboard.stripe.com/webhooks",
      },
    ],
  },
  {
    id: "storage",
    statusKey: "CHAT_STORAGE_TYPE",
    fields: [
      {
        id: "storageType",
        envKey: "CHAT_STORAGE_TYPE",
        kind: "select",
        options: ["filesystem", STORAGE_S3],
      },
      { id: "s3Endpoint", envKey: "S3_ENDPOINT", kind: "text" },
      { id: "s3Region", envKey: "S3_REGION", kind: "text" },
      { id: "s3Bucket", envKey: "S3_BUCKET", kind: "text" },
      { id: "s3AccessKey", envKey: "S3_ACCESS_KEY_ID", kind: "secret" },
      { id: "s3SecretKey", envKey: "S3_SECRET_ACCESS_KEY", kind: "secret" },
      { id: "s3PublicUrl", envKey: "S3_PUBLIC_URL_BASE", kind: "text" },
    ],
  },
];

/** Every env key the page reads a snapshot for. */
export const SETUP_ENV_KEYS: readonly EnvKeyName[] = [
  ...PROVIDER_FIELDS.map((f) => f.envKey),
  ...EXTRA_SECTIONS.flatMap((s) => s.fields.map((f) => f.envKey)),
];

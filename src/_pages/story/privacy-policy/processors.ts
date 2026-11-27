/**
 * Service providers (processors) that receive personal data from the
 * production instance, grouped for the privacy policy "Third-Party Services"
 * section. Source of truth: the providers configured in the prod env
 * (AI keys in src/vibe/agent/env.ts, payments, mail host, hosting).
 * Purpose, shared data and location are translated per provider id in i18n.
 */

export interface Processor {
  readonly id:
    | "hostinger"
    | "hosttech"
    | "stripe"
    | "paypal"
    | "nowpayments"
    | "openrouter"
    | "nanogpt"
    | "venice"
    | "uncensoredAi"
    | "freedomgpt"
    | "gabAi"
    | "modelslab"
    | "edenAi"
    | "braveSearch"
    | "kagi"
    | "scrappey";
  /** Company / brand name, not translated. */
  readonly name: string;
  readonly privacyUrl: string;
}

export interface ProcessorGroup {
  readonly id: "hosting" | "email" | "payments" | "ai" | "web";
  readonly processors: readonly Processor[];
}

/* eslint-disable i18next/no-literal-string -- company names and their privacy policy URLs are not translatable */
export const PROCESSOR_GROUPS: readonly ProcessorGroup[] = [
  {
    id: "hosting",
    processors: [
      {
        id: "hostinger",
        name: "Hostinger (HOSTINGER, UAB)",
        privacyUrl: "https://www.hostinger.com/legal/privacy-policy",
      },
    ],
  },
  {
    id: "email",
    processors: [
      {
        id: "hosttech",
        name: "hosttech GmbH",
        privacyUrl: "https://www.hosttech.ch/datenschutz",
      },
    ],
  },
  {
    id: "payments",
    processors: [
      {
        id: "stripe",
        name: "Stripe",
        privacyUrl: "https://stripe.com/privacy",
      },
      {
        id: "paypal",
        name: "PayPal",
        privacyUrl: "https://www.paypal.com/webapps/mpp/ua/privacy-full",
      },
      {
        id: "nowpayments",
        name: "NOWPayments (FD Transfers LLC)",
        privacyUrl: "https://nowpayments.io/doc/fd-privacy-policy.pdf",
      },
    ],
  },
  {
    id: "ai",
    processors: [
      {
        id: "openrouter",
        name: "OpenRouter, Inc.",
        privacyUrl: "https://openrouter.ai/privacy",
      },
      {
        id: "nanogpt",
        name: "NanoGPT LLC",
        privacyUrl: "https://nano-gpt.com/legal/privacy-policy",
      },
      {
        id: "venice",
        name: "Venice.ai",
        privacyUrl: "https://venice.ai/legal/privacy-policy",
      },
      {
        id: "uncensoredAi",
        name: "Uncensored AI (uncensored.ai)",
        privacyUrl: "https://uncensored.ai/privacy-policy",
      },
      {
        id: "freedomgpt",
        name: "FreedomGPT Inc.",
        privacyUrl: "https://www.freedomgpt.com/privacy-policy",
      },
      {
        id: "gabAi",
        name: "Gab AI Inc.",
        privacyUrl: "https://gab.ai/privacy",
      },
      {
        id: "modelslab",
        name: "ModelsLab",
        privacyUrl: "https://modelslab.com/privacy-policy",
      },
      {
        id: "edenAi",
        name: "Eden AI SAS",
        privacyUrl: "https://www.edenai.co/privacy-policy",
      },
    ],
  },
  {
    id: "web",
    processors: [
      {
        id: "braveSearch",
        name: "Brave Search API (Brave Software, Inc.)",
        privacyUrl: "https://search.brave.com/help/privacy-policy",
      },
      {
        id: "kagi",
        name: "Kagi Inc.",
        privacyUrl: "https://kagi.com/privacy",
      },
      {
        id: "scrappey",
        name: "Scrappey",
        privacyUrl: "https://scrappey.com/gdpr",
      },
    ],
  },
];
/* eslint-enable i18next/no-literal-string */

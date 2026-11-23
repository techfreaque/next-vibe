/**
 * Metadata keys of conversion-wall engagements (CREDIT_WALL,
 * CONSENT_DECLINED). The tracking endpoint stores client `customData` with a
 * `custom_` prefix; server-recorded walls use the same keys.
 */
export const WALL_META = {
  model: "custom_model",
  /** "guest" | "account" (strings: the tracking schema coerces booleans to numbers) */
  who: "custom_who",
  via: "custom_via",
  /** consent only: "select" (model picked) | "send" (a send was held) */
  prompt: "custom_prompt",
} as const;

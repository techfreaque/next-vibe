export const REFERRAL_LINKS_ALIAS = "referral-links" as const;
export const REFERRAL_LINK_CREATE_ALIAS = "referral-link-create" as const;

/** Default UTM medium for creator-made links. */
export const REFERRAL_LINK_DEFAULT_MEDIUM = "referral" as const;

/** Quick-pick sources shown in the link builder (free text still allowed). */
export const REFERRAL_LINK_SOURCE_PRESETS = [
  "youtube",
  "newsletter",
  "x",
  "reddit",
  "blog",
  "directory",
  "discord",
  "tiktok",
] as const;

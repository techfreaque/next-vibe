import type { socialMediaTranslations as EnglishSocialMediaTranslations } from "../../en/sections/socialMedia";

export const socialMediaTranslations: typeof EnglishSocialMediaTranslations = {
  platforms: {
    facebook: "Facebook",
    twitter: "Twitter",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    snapchat: "Snapchat",
    whatsapp: "WhatsApp",
    threads: "Threads",
    mastodon: "Mastodon",
  },
  errors: {
    post_failed: "Nie udało się opublikować w mediach społecznościowych",
    invalid_credentials:
      "Nieprawidłowe dane uwierzytelniające dla platformy mediów społecznościowych",
    no_accounts_connected: "Brak połączonych kont mediów społecznościowych",
    platform_not_supported:
      "Platforma mediów społecznościowych nie jest obsługiwana",
  },
  success: {
    updated: "Platformy mediów społecznościowych zaktualizowane pomyślnie",
  },
};

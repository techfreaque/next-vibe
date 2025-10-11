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
    post_failed: "Posting in Social Media fehlgeschlagen",
    invalid_credentials: "Ungültige Anmeldedaten für Social Media Plattform",
    no_accounts_connected: "Keine Social Media Konten verbunden",
    platform_not_supported: "Social Media Plattform nicht unterstützt",
  },
  success: {
    updated: "Social Media Plattformen erfolgreich aktualisiert",
  },
};

import type { formTranslations as EnglishFormTranslations } from "../../../en/sections/social/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Social Media Strategie",
  description: "Konfigurieren Sie Ihre Social Media Plattformen und Strategie",
  sections: {
    platforms: {
      title: "Social Plattformen",
      description:
        "Wählen Sie die Plattformen aus, auf denen Ihr Unternehmen präsent ist",
    },
    strategy: {
      title: "Content-Strategie",
      description: "Definieren Sie Ihren Social Media Ansatz und Ihre Ziele",
    },
  },
  fields: {
    platforms: {
      label: "Social Media Plattformen *",
    },
    contentStrategy: {
      label: "Content-Strategie",
      placeholder:
        "Beschreibe Ihren Content-Ansatz, Themen und Posting-Stil...",
    },
    targetAudience: {
      label: "Zielgruppe",
      placeholder: "Wer ist Ihre Zielgruppe in den sozialen Medien?",
    },
    postingFrequency: {
      label: "Posting-Häufigkeit",
      placeholder: "Wie oft planen Sie zu posten? (z.B. täglich, 3x pro Woche)",
    },
    goals: {
      label: "Social Media Ziele",
      placeholder: "Was möchten Sie durch Social Media erreichen?",
    },
  },
  platformNames: {
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    snapchat: "Snapchat",
    discord: "Discord",
    reddit: "Reddit",
    telegram: "Telegram",
    whatsapp: "WhatsApp Business",
    other: "Andere",
  },
  messages: {
    selectPlatform: "Bitte wähle mindestens eine Social Media Plattform aus",
  },
  submit: {
    save: "Social Media Strategie speichern",
    saving: "Wird gespeichert...",
  },
};

import type { formTranslations as EnglishFormTranslations } from "../../../en/sections/social/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Strategia Mediów Społecznościowych",
  description:
    "Skonfiguruj swoje platformy mediów społecznościowych i strategię",
  sections: {
    platforms: {
      title: "Platformy Społecznościowe",
      description: "Wybierz platformy, na których Twoja firma ma obecność",
    },
    strategy: {
      title: "Strategia Treści",
      description:
        "Zdefiniuj swoje podejście i cele w mediach społecznościowych",
    },
  },
  fields: {
    platforms: {
      label: "Platformy Mediów Społecznościowych *",
    },
    contentStrategy: {
      label: "Strategia Treści",
      placeholder:
        "Opisz swoje podejście do treści, tematy i styl publikowania...",
    },
    targetAudience: {
      label: "Grupa Docelowa",
      placeholder: "Kto jest Twoją grupą docelową w mediach społecznościowych?",
    },
    postingFrequency: {
      label: "Częstotliwość Publikowania",
      placeholder:
        "Jak często planujesz publikować? (np. codziennie, 3 razy w tygodniu)",
    },
    goals: {
      label: "Cele Mediów Społecznościowych",
      placeholder: "Co chcesz osiągnąć poprzez media społecznościowe?",
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
    other: "Inne",
  },
  messages: {
    selectPlatform:
      "Wybierz przynajmniej jedną platformę mediów społecznościowych",
  },
  submit: {
    save: "Zapisz Strategię Mediów Społecznościowych",
    saving: "Zapisywanie...",
  },
};

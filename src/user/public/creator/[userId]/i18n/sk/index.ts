import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil autora",
  tags: {
    creator: "creator",
    profile: "profil",
    public: "public",
  },
  get: {
    title: "Načítať profil autora",
    titleShort: "Profil autora",
    description:
      "Načítať verejný profil autora s predstavením, odkazmi na sociálne siete a zručnosťami",
    form: {
      title: "Profil autora",
      description: "Verejný profil autora zručností",
      creatorId: {
        label: "ID autora",
        description: "ID alebo identifikátor autora v URL",
      },
    },
    response: {
      title: "Profil autora",
      description: "Údaje verejného profilu autora",
      publicName: "Zobrazované meno",
      avatarUrl: "Avatar",
      bio: "O mne",
      websiteUrl: "Webová stránka",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorAccentColor: "Farba zvýraznenia",
      creatorHeaderImageUrl: "Obrázok hlavičky",
      referralCode: "Kód odporúčania",
      appName: "Názov aplikácie",
      leadMagnetActive: "Zber kontaktov je aktívny",
      leadMagnetHeadline: "Nadpis formulára na zber kontaktov",
      leadMagnetButtonText: "Tlačidlo formulára na zber kontaktov",
      skills: "Zručnosti",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Autor sa nenašiel",
        detail: "Pre používateľa {{userId}} neexistuje profil autora",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Konflikt požiadavky",
      },
      network: { title: "Chyba siete", description: "Chyba siete" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
      internal: {
        title: "Chyba servera",
        description: "Interná chyba",
        detail: "Profil autora sa nepodarilo načítať: {{error}}",
      },
      unknown: { title: "Neznáma chyba", description: "Neznáma chyba" },
    },
    success: {
      title: "Profil autora",
      description: "Profil autora sa načítal",
    },
  },
  widget: {
    notFound: {
      title: "Autor sa nenašiel",
      description: "Tento profil neexistuje alebo bol odstránený.",
      back: "Späť domov",
    },
    skills: {
      title: "Zručnosti",
    },
    referral: {
      label: "Kód odporúčania",
    },
    nav: {
      backArrow: "\u2190",
      copyright: "\u00a9",
    },
  },
  meta: {
    title: "Profil autora {{publicName}}",
    description:
      "{{publicName}} vytvára zručnosti AI na {{appName}}. Pozrite si ich a začnite četovať.",
    notFound: "Autor sa nenašiel | {{appName}}",
  },
};

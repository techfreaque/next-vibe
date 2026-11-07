import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Creator-Profil",
  tags: {
    creator: "creator",
    profile: "profil",
    public: "oeffentlich",
  },
  get: {
    title: "Creator-Profil abrufen",
    titleShort: "Creator-Profil",
    description:
      "Oeffentliches Creator-Profil mit Bio, Social-Links und Skills",
    form: {
      title: "Creator-Profil",
      description: "Oeffentliches Profil eines Skill-Creators",
      creatorId: {
        label: "Creator-ID",
        description: "ID oder Slug des Creators",
      },
    },
    response: {
      title: "Creator-Profil",
      description: "Oeffentliche Creator-Profildaten",
      publicName: "Anzeigename",
      avatarUrl: "Avatar",
      bio: "Bio",
      websiteUrl: "Website",
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
      creatorAccentColor: "Akzentfarbe",
      creatorHeaderImageUrl: "Header-Bild",
      referralCode: "Empfehlungscode",
      appName: "App-Name",
      leadMagnetActive: "Lead-Magnet aktiv",
      leadMagnetHeadline: "Lead-Magnet-Titel",
      leadMagnetButtonText: "Lead-Magnet-Button",
      skills: "Skills",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungueltige Anfrage",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Nicht autorisiert",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Creator nicht gefunden",
        detail: "Für {{userId}} existiert kein Creator-Profil",
      },
      conflict: { title: "Konflikt", description: "Anfragenkonflikt" },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      unsavedChanges: {
        title: "Ungespeicherte Aenderungen",
        description: "Ungespeicherte Aenderungen",
      },
      internal: {
        title: "Serverfehler",
        description: "Interner Fehler",
        detail: "Creator-Profil konnte nicht geladen werden: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler",
      },
    },
    success: {
      title: "Creator-Profil",
      description: "Creator-Profil abgerufen",
    },
  },
  widget: {
    notFound: {
      title: "Creator nicht gefunden",
      description: "Dieses Profil existiert nicht oder wurde entfernt.",
      back: "Zurück zur Startseite",
    },
    skills: {
      title: "Skills",
    },
    referral: {
      label: "Empfehlungscode",
    },
    nav: {
      backArrow: "\u2190",
      copyright: "\u00a9",
    },
  },
  meta: {
    title: "{{publicName}} - Creator-Profil",
    description:
      "{{publicName}} baut KI-Skills auf {{appName}}. Arbeiten ansehen, Gespräch starten.",
    notFound: "Creator nicht gefunden - {{appName}}",
  },
};

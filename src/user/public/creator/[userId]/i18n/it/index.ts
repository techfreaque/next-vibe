import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profilo del creatore",
  tags: {
    creator: "creatore del creatore",
    profile: "profilo",
    public: "pubblico pubblico",
  },
  get: {
    title: "Ottieni il profilo del creatore",
    titleShort: "Profilo del creatore",
    description:
      "Ottenere profilo creatore pubblico con bio, legami sociali e competenze",
    form: {
      title: "Profilo del creatore",
      description: "Profilo pubblico per un creatore di abilità",
      creatorId: {
        label: "Creatore ID",
        description: "ID o slug del creatore",
      },
    },
    response: {
      title: "Profilo del creatore",
      description: "Dati del profilo del creatore pubblico",
      publicName: "Nome dell'esposizione",
      avatarUrl: "Avatar",
      bio: "Bio",
      websiteUrl: "Sito web",
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
      creatorAccentColor: "Colore dell'acustica",
      creatorHeaderImageUrl: "Immagine dell'intestazione",
      referralCode: "Codice invito",
      appName: "Nome dell'app",
      leadMagnetActive: "Magnete di contatto attivo",
      leadMagnetHeadline: "Headline magnetica di contatto",
      leadMagnetButtonText: "Pulsante magnetico di contatto",
      skills: "Skill",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non autorizzato",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      notFound: {
        title: "Non trovato",
        description: "Creatore non trovato",
        detail: "Nessun profilo creatore esiste per {{userId}}",
      },
      conflict: { title: "Conflitto", description: "Richiesta conflitto" },
      network: { title: "Errore di rete", description: "Errore di rete" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Modifiche non salvate",
      },
      internal: {
        title: "Errore del server",
        description: "Errore interno",
        detail:
          "Non è possibile caricare questo profilo del creatore: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Errore sconosciuto",
      },
    },
    success: {
      title: "Profilo del creatore",
      description: "Profilo del creatore recuperato",
    },
  },
  widget: {
    notFound: {
      title: "Creatore non trovato",
      description: "Questo profilo non esiste o è stato rimosso.",
      back: "Torna a casa",
    },
    skills: {
      title: "Skill",
    },
    referral: {
      label: "Codice invito",
    },
    nav: {
      backArrow: "←",
      copyright: "©",
    },
  },
  meta: {
    title: "{{publicName}} - Profilo del Creatore",
    description:
      "{{publicName}} costruisce competenze AI su {{appName}}. Esplora il loro lavoro e inizia una conversazione.",
    notFound: "Creatore Non Trovato - {{appName}}",
  },
};

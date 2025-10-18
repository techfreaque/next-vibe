import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  creditPricing: {
    badge: "Einfache kreditbasierte Preise",
    title: "Pay As You Go KI-Chat",
    subtitle:
      "Wählen Sie zwischen monatlichen Credits oder einmaligen Credit-Paketen. Volle Kostentransparenz für alle KI-Modelle und Funktionen.",

    subscription: {
      badge: "Am beliebtesten",
      title: "Monatsabonnement",
      price: "€{{price}}",
      perMonth: "/Monat",
      description: "{{credits}} Credits pro Monat (verfallen monatlich)",
      expiryInfo:
        "Credits verfallen am Ende jedes Abrechnungszyklus. Ideal für regelmäßige Nutzer.",
      features: {
        credits: "{{credits}} Credits monatlich",
        allModels:
          "Zugang zu allen KI-Modellen (kostenlos und kostenpflichtig)",
        allFeatures: "Brave-Suche, TTS und STT-Funktionen",
        cancel: "Jederzeit kündbar, keine Verpflichtung",
      },
      button: "Jetzt abonnieren",
    },

    creditPack: {
      badge: "Verfallen nie",
      title: "Credit-Paket",
      price: "€{{price}}",
      description: "{{credits}} Credits (verfallen nie)",
      permanentInfo:
        "Credits verfallen nie! Einmal kaufen, jederzeit nutzen. Perfekt für gelegentliche Nutzer.",
      quantityLabel: "Anzahl (1-10 Pakete)",
      pricePerPack: "€{{price}} pro {{credits}} Credits",
      features: {
        credits: "{{credits}} dauerhafte Credits",
        allModels:
          "Zugang zu allen KI-Modellen (kostenlos und kostenpflichtig)",
        allFeatures: "Brave-Suche, TTS und STT-Funktionen",
        multiple: "Mehrere Pakete jederzeit kaufen",
      },
      button: "{{quantity}} Paket kaufen",
      buttonPlural: "{{quantity}} Pakete kaufen",
    },

    common: {
      processing: "Wird verarbeitet...",
    },

    costTransparency: {
      title: "Kostentransparenz",
      card: {
        title: "KI-Modellkosten",
        description: "Klare Preise für jedes KI-Modell und jede Funktion",
      },
      table: {
        provider: "Anbieter",
        model: "Modell",
        costPerMessage: "Kosten pro Nachricht",
        features: "Funktionen",
        braveSearch: "Brave-Suche",
        braveSearchCost: "+1 Credit pro Suche",
        tts: "Text-zu-Sprache (TTS)",
        ttsCost: "1 Credit pro Minute",
        stt: "Sprache-zu-Text (STT)",
        sttCost: "1 Credit pro Minute",
        free: "Kostenlos",
        credits: "{{count}} Credit",
        creditsPlural: "{{count}} Credits",
        parameters: "{{count}}B Parameter",
      },
    },

    calculator: {
      title: "Credit-Rechner",
      card: {
        title: "Schätzen Sie Ihre monatlichen Credits",
        description:
          "Berechnen Sie, wie viele Credits Sie basierend auf Ihrer Nutzung benötigen",
      },
      messagesLabel: "Nachrichten pro Monat",
      estimates: {
        free: "Mit kostenlosen Modellen (0 Credits):",
        freeCredits: "0 Credits",
        basic: "Mit Basis-Modellen (1 Credit/Nachricht):",
        basicCredits: "{{count}} Credits",
        pro: "Mit Pro-Modellen (2 Credits/Nachricht):",
        proCredits: "{{count}} Credits",
        premium: "Mit Premium-Modellen (5 Credits/Nachricht):",
        premiumCredits: "{{count}} Credits",
      },
      recommendation: {
        title: "Empfehlung:",
        freeTier:
          "Beginnen Sie mit dem kostenlosen Tarif (20 Credits), um den Service auszuprobieren!",
        subscription:
          "Das Monatsabonnement ({{credits}} Credits) ist perfekt für Ihre Nutzung!",
        additionalPacks:
          "Erwägen Sie den Kauf von {{packs}} Credit-Paket(en) zusätzlich zum Abonnement oder nutzen Sie öfter kostenlose Modelle.",
      },
    },

    freeTier: {
      title: "Kostenloser Tarif verfügbar",
      description:
        "Starten Sie mit 20 kostenlosen Credits (verfolgt nach IP/leadId). Keine Kreditkarte erforderlich. Viele Modelle sind völlig kostenlos!",
      button: "Jetzt kostenlos starten",
    },
  },
};

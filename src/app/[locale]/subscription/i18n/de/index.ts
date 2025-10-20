import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Credits",
    description: "Verwalten Sie Ihre Credits und Abonnements",
    balance: {
      title: "Credit-Guthaben",
      description: "Ihre verfügbaren Credits für KI-Gespräche",
      total: "Credits",
      nextExpiration: "Nächster Ablauf: {{date}}",
      expiring: {
        title: "Ablaufende Credits",
        description: "Aus Abonnement",
      },
      permanent: {
        title: "Permanente Credits",
        description: "Laufen nie ab",
      },
      free: {
        title: "Kostenlose Credits",
        description: "Test-Credits",
      },
    },
    overview: {
      howItWorks: {
        title: "Wie Credits funktionieren",
        description: "Verstehen Sie Ihr Credit-System",
        expiring: {
          title: "Ablaufende Credits",
          description:
            "Credits aus monatlichen Abonnements laufen am Ende jedes Abrechnungszyklus ab. Nutzen Sie sie, bevor sie ablaufen!",
        },
        permanent: {
          title: "Permanente Credits",
          description:
            "Gekaufte Credit-Pakete laufen nie ab. Einmal kaufen, jederzeit nutzen. Perfekt für gelegentliche Nutzer.",
        },
        free: {
          title: "Kostenlose Credits",
          description:
            "Jeder erhält 20 kostenlose Credits zum Testen unseres Services. Starten Sie sofort mit KI-Chats!",
        },
      },
      costs: {
        title: "Credit-Kosten",
        description: "Sehen Sie, wie viel jede Funktion kostet",
        models: {
          title: "KI-Modelle (pro Nachricht)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} Credits",
        },
        features: {
          title: "Funktionen",
          search: "Brave-Suche",
          tts: "Text-zu-Sprache",
          stt: "Sprache-zu-Text",
          searchCost: "+1 Credit",
          audioCost: "+2 Credits",
        },
      },
    },
    buy: {
      subscription: {
        badge: "Bester Wert",
        title: "Monatsabonnement",
        description:
          "Erhalten Sie jeden Monat Credits, die am Ende Ihres Abrechnungszyklus ablaufen",
        perMonth: "/Monat",
        features: {
          credits: "{{count}} Credits pro Monat",
          expiry: "Credits laufen monatlich ab",
          bestFor: "Am besten für regelmäßige Nutzer",
        },
        button: "Jetzt abonnieren",
      },
      pack: {
        title: "Credit-Pakete",
        description: "Kaufen Sie Credits, die nie ablaufen",
        badge: "Läuft nie ab",
        perPack: "/Paket",
        quantity: "Menge",
        total: "{{count}} Credits",
        features: {
          credits: "{{count}} Credits",
          permanent: "Läuft nie ab",
          expiry: "Läuft nie ab",
          bestFor: "Am besten für gelegentliche Nutzung",
        },
        button: "{{count}} {{type}} kaufen",
        totalPrice: "Gesamt: {{price}}",
        pack: "Paket",
        packs: "Pakete",
      },
    },
    history: {
      title: "Transaktionsverlauf",
      description: "Ihre letzten Credit-Transaktionen",
      empty: {
        title: "Noch keine Transaktionen",
        description: "Ihr Credit-Transaktionsverlauf wird hier angezeigt",
      },
      balance: "Guthaben: {{count}}",
      loadMore: "Mehr laden",
      types: {
        purchase: "Kauf",
        subscription: "Abonnement",
        usage: "Nutzung",
        expiry: "Ablauf",
        free_tier: "Kostenlose Stufe",
      },
    },
    tabs: {
      overview: "Übersicht",
      buy: "Credits kaufen",
      billing: "Abrechnung",
      history: "Verlauf",
      plans: "Pläne",
    },
  },
  meta: {
    subscription: {
      title: "Abonnement & Credits",
      description: "Verwalten Sie Ihr Abonnement, Credits und Abrechnung",
      category: "Konto",
      imageAlt: "Abonnement- und Credit-Verwaltung",
      keywords: {
        subscription: "Abonnement",
        billing: "Abrechnung",
        plans: "Pläne",
        pricing: "Preise",
      },
    },
  },
};

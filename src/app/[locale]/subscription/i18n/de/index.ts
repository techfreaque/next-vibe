import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Credits",
    description: "Verwalten Sie Ihre Credits und Abonnements",
    backToChat: "Zurück zum Chat",
    billingInterval: "Abrechnungsintervall",
    currentPeriodStart: "Aktueller Zeitraum Start",
    nextBillingDate: "Nächstes Abrechnungsdatum",
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
        description: "Credits, die in Paketen gekauft wurden, laufen nie ab",
      },
      free: {
        title: "Kostenlose monatliche Credits",
        description: "{{count}} kostenlose Credits pro Monat für alle",
      },
    },
    overview: {
      howItWorks: {
        title: "Wie Credits funktionieren",
        description: "Verstehen Sie Ihr Credit-System",
        expiring: {
          title: "Monatsabonnement-Credits",
          description:
            "€10/Monat gibt Ihnen 1000 Credits, die am Ende jedes Abrechnungszyklus ablaufen. Erschwingliche Preise für alle!",
        },
        permanent: {
          title: "Zusätzliche Credits für Power-User",
          description:
            "Brauchen Sie mehr? Kaufen Sie Credit-Pakete (€5 für 500 Credits), die nie ablaufen. Perfekt für Power-User, die zusätzliche Kapazität benötigen.",
        },
        free: {
          title: "Kostenlose Test-Credits",
          description:
            "Jeder erhält 20 kostenlose Credits zum Testen unseres Services. Keine Kreditkarte erforderlich!",
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
      signInRequired: {
        title: "Anmeldung erforderlich",
        description:
          "Bitte melden Sie sich an oder erstellen Sie ein Konto, um Credits und Abonnements zu kaufen.",
      },
      subscription: {
        badge: "Für alle zugänglich",
        title: "Monatsabonnement",
        description:
          "€10/Monat - Erschwinglicher KI-Zugang für alle mit 1000 Credits monatlich",
        perMonth: "/Monat",
        features: {
          credits: "{{count}} Credits pro Monat",
          expiry: "Credits laufen monatlich ab",
          bestFor: "Erschwingliche Preise für alle Nutzer",
        },
        button: "Jetzt abonnieren",
      },
      pack: {
        title: "Credit-Pakete",
        description:
          "Zusätzliche Credits für Power-User (erfordert aktives Abonnement)",
        badge: "Für Power-User",
        perPack: "/Paket",
        quantity: "Menge",
        total: "{{count}} Credits",
        features: {
          credits: "{{count}} Credits pro Paket",
          permanent: "Läuft nie ab",
          expiry: "Läuft nie ab",
          bestFor: "Für Power-User, die zusätzliche Credits benötigen",
        },
        button: {
          submit: "Credit Pack kaufen",
        },
        totalPrice: "Gesamt: {{price}}",
        pack: "Paket",
        packs: "Pakete",
        requiresSubscription:
          "Abonnieren Sie einen monatlichen Plan, um zusätzliche Credit Packs zu kaufen.",
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
    payment: {
      success: {
        title: "Zahlung erfolgreich",
        subscription:
          "Ihr Abonnement wurde erfolgreich aktiviert! Ihre Credits sind in Kürze verfügbar.",
        credits:
          "Ihr Credit-Paket-Kauf war erfolgreich! Ihre Credits sind in Kürze verfügbar.",
      },
      canceled: {
        title: "Zahlung abgebrochen",
        subscription:
          "Ihre Abonnement-Zahlung wurde abgebrochen. Sie können es jederzeit erneut versuchen.",
        credits:
          "Ihr Credit-Paket-Kauf wurde abgebrochen. Sie können es jederzeit erneut versuchen.",
      },
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
  payment: {
    success: {
      title: "Zahlung erfolgreich",
      subscription: "Ihr Abonnement wurde erfolgreich aktiviert!",
      credits: "Ihr Credit Pack-Kauf war erfolgreich!",
    },
    canceled: {
      title: "Zahlung abgebrochen",
      subscription: "Ihre Abonnementzahlung wurde abgebrochen.",
      credits: "Ihr Credit Pack-Kauf wurde abgebrochen.",
    },
  },
};

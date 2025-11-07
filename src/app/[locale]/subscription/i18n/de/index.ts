import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Credits & Abonnement",
    description: "Verwalten Sie Ihre Credits und monatliches Abonnement",
    backToChat: "Zurück zum Chat",
    billingInterval: "Abrechnungsintervall",
    currentPeriodStart: "Aktueller Zeitraum Start",
    nextBillingDate: "Nächstes Abrechnungsdatum",
    endsOn: "Abonnement endet am",
    cancellation: {
      title: "Abonnement zur Kündigung vorgemerkt",
      description: "Ihr Abonnement endet am {{date}}. Sie behalten bis dahin den Zugriff.",
    },
    manage: {
      stripe: {
        button: "Abonnement verwalten",
      },
      nowpayments: {
        button: "Abonnement-Details anzeigen",
        info: "Ihr Abonnement wird per E-Mail verwaltet. Bitte überprüfen Sie Ihren Posteingang auf Zahlungslinks und Abonnementdetails von NOWPayments.",
      },
    },
    balance: {
      title: "Credit-Guthaben",
      description:
        "Ihre verfügbaren Credits für KI-Gespräche mit {{modelCount}} Modellen",
      credit: "{{count}} Credit",
      credits: "{{count}} Credits",
      nextExpiration: "Nächster Ablauf",
      expiring: {
        title: "Abonnement-Credits",
        description: "Aus monatlichem Abonnement ({{subCredits}} Credits/Monat)",
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
        description:
          "Abonnieren Sie für {{subCredits}} monatliche Credits und kaufen Sie zusätzliche Pakete bei Bedarf",
        expiring: {
          title: "Monatsabonnement",
          description:
            "{{subPrice}}/Monat - {{subCredits}} Credits pro Monat mit allen {{modelCount}} KI-Modellen. Perfekt für regelmäßige Nutzer!",
        },
        permanent: {
          title: "Zusätzliche Credit-Pakete",
          description:
            "{{packPrice}} für {{packCredits}} Credits - Benötigen Sie mehr als {{subCredits}} Credits? Kaufen Sie zusätzliche Pakete, die nie ablaufen. Erfordert aktives Abonnement.",
        },
        free: {
          title: "Kostenlose Test-Credits",
          description:
            "Jeder erhält {{count}} kostenlose Credits zum Testen unseres Services. Keine Kreditkarte erforderlich!",
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
      provider: {
        stripe: {
          description: "Kredit-/Debitkarten",
        },
        nowpayments: {
          description: "Kryptowährung",
        },
      },
      subscription: {
        badge: "Für alle zugänglich",
        title: "Monatsabonnement",
        description:
          "{{subPrice}}/Monat - {{subCredits}} Credits pro Monat mit allen {{modelCount}} KI-Modellen",
        perMonth: "/Monat",
        features: {
          credits: "{{count}} Credits pro Monat",
          expiry: "Zugriff auf alle {{modelCount}} KI-Modelle",
          bestFor: "Perfekt für regelmäßige KI-Nutzer",
        },
        button: "Jetzt abonnieren",
        buttonAlreadySubscribed: "Bereits abonniert",
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
          "Credit-Pakete erfordern ein aktives Abonnement. Abonnieren Sie, um monatliche Credits zu erhalten und die Möglichkeit freizuschalten, Credit-Pakete zu kaufen!",
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
        monthly_reset: "Monatliche Zurücksetzung",
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

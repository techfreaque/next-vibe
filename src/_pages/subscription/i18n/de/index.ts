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
    canceledOn: "Gekündigt am",
    endedOn: "Beendet am",
    cancellation: {
      title: "Abonnement zur Kündigung vorgemerkt",
      description:
        "Ihr Abonnement endet am {{date}}. Sie behalten bis dahin den Zugriff.",
    },
    canceled: {
      title: "Abonnement gekündigt",
      description:
        "Ihr Abonnement wurde gekündigt. Sie können jederzeit erneut abonnieren, um wieder Zugriff auf monatliche Credits zu erhalten.",
    },
    manage: {
      stripe: {
        button: "Abonnement verwalten",
      },
      nowpayments: {
        button: "Abonnement-Details anzeigen",
        info: "Ihr Abonnement wird per E-Mail verwaltet. Bitte überprüfen Sie Ihren Posteingang auf Zahlungslinks und Abonnementdetails von NOWPayments.",
      },
      portal: {
        error: "Zahlungsportal ließ sich nicht öffnen. Erneut versuchen.",
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
        description:
          "Aus monatlichem Abonnement ({{subCredits}} Credits/Monat)",
      },
      permanent: {
        title: "Permanente Credits",
        description: "Credits, die in Paketen gekauft wurden, laufen nie ab",
      },
      free: {
        title: "Kostenlose monatliche Credits",
        description:
          "{{guest}} Gratis-Credits pro Monat als Gast, {{signedIn}} angemeldet, +{{bonus}} mit dem Newsletter",
      },
      earned: {
        title: "Verdiente Credits",
        description: "Verdiene durch Freunde einladen →",
      },
    },
    overview: {
      howItWorks: {
        title: "So funktionieren Credits",
        description:
          "Eine Währung für jedes Modell. Abonnieren, aufladen oder gratis starten.",
        expiring: {
          title: "Monatsabo",
          description:
            "{{subPrice}}/Monat. {{subCredits}} Credits jeden Monat, alle {{modelCount}} Modelle.",
        },
        permanent: {
          title: "Credit-Pakete",
          description:
            "{{packPrice}} für {{packCredits}} Credits, oder {{largePackPrice}} für {{largePackCredits}}. Verfallen nie. Kein Abo nötig.",
        },
        free: {
          title: "Gratis-Credits",
          description:
            "{{guest}} pro Monat als Gast. {{signedIn}} mit kostenlosem Konto, +{{bonus}} mit dem Newsletter. Keine Karte.",
        },
      },
      costs: {
        title: "Was es kostet",
        description: "Credits pro Nachricht, Bild, Clip oder Tool-Aufruf.",
        models: {
          title: "KI-Modelle (pro Nachricht)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} Credits",
          showLegacy: "Legacy-Modelle anzeigen",
          hideLegacy: "Legacy-Modelle ausblenden",
          free: "Kostenlos",
          approxCost: "~Credits",
          legacyBadge: "Legacy",
          types: {
            text: "Chat",
            tts: "Text zu Sprache",
            stt: "Sprache zu Text",
            image: "Bildgenerierung",
            audio: "Musikgenerierung",
            video: "Videogenerierung",
          },
        },
        features: {
          title: "Funktionen",
          braveSearchLabel: "Brave-Suche (pro Suche)",
          kagiSearchLabel: "Kagi-Suche (pro Suche)",
          fetchUrlLabel: "Website als Text (pro Abruf)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "Credits",
        },
      },
      cta: {
        title: "Alle Modelle freischalten.",
        description:
          "Monatliche Credits für alle {{modelCount}} Modelle. Jederzeit mit Paketen aufstocken.",
        button: "Jetzt abonnieren",
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
        cryptoMonthlyDisabled:
          "Kryptowährungszahlungen sind nur für Jahresabonnements verfügbar, aufgrund von Mindesttransaktionswertanforderungen (mindestens 20€).",
        cryptoMinimumPacks:
          "Kryptowährungszahlungen erfordern mindestens {{minPacks}} Credit-Pakete ({{minValue}}) aufgrund von Mindesttransaktionswertanforderungen.",
      },
      subscription: {
        badge: "Für alle zugänglich",
        title: "Monatsabonnement",
        description:
          "{{subPrice}}/Monat - {{subCredits}} Credits pro Monat mit allen {{modelCount}} KI-Modellen",
        perMonth: "/Monat",
        perYear: "/Jahr",
        yearlyEquivalent:
          "Nur {{monthlyPrice}}/Monat bei jährlicher Abrechnung",
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
        description: "Zahlen, was du nutzt. Kein Abo. Credits verfallen nie.",
        badge: "Ohne Abo",
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
        free_grant: "Kostenlose Gewährung",
        free_reset: "Kostenlose Zurücksetzung",
        refund: "Rückerstattung",
        transfer: "Übertragung",
        other_devices: "Verbrauch von anderen Geräten",
        referral_earning: "Empfehlungsvergütung",
        referral_payout: "Empfehlungsauszahlung",
      },
    },
    tabs: {
      overview: "Übersicht",
      buy: "Credits kaufen",
      adminBuy: "Credits verwalten",
      billing: "Abrechnung",
      history: "Verlauf",
      plans: "Pläne",
      remote: "Cloud-Sync",
    },
    admin: {
      title: "Credits & Limits",
      description:
        "Kreditkontingente und Nutzungslimits für diese Instanz verwalten",
      allocate: {
        title: "Credits zuweisen",
        description:
          "Fügen Sie einem Benutzerkonto Credits hinzu. Credits wirken als Ausgabenlimit - sie steuern, wie viel KI-Nutzung erlaubt ist.",
        howItWorks: {
          title: "Wie Credit-Limits funktionieren",
          freePool: {
            title: "Freier Pool (Geteilt)",
            description:
              "Alle Benutzer teilen sich einen Pool kostenloser Credits, der monatlich zurückgesetzt wird.",
          },
          bonus: {
            title: "Bonus-Credits (Pro Benutzer)",
            description:
              "Bonus-Credits sind dauerhaft - sie laufen nie ab und stapeln sich auf den freien Pool-Credits.",
          },
          apiKeys: {
            title: "Alle Limits entfernen",
            description:
              "Konfigurieren Sie eigene LLM-API-Schlüssel in den Einstellungen, um Credits vollständig zu umgehen.",
          },
        },
      },
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
    category: "Preise",
    imageAlt: "{{appName}} Preise: Credits für jedes KI-Modell",
    keywords:
      "KI-Chat Preise, unzensierte KI Preise, KI pro Nachricht bezahlen, KI-Credits, {{appName}}",
    overview: {
      title:
        "Preise - pro Nachricht zahlen, ohne Vertragsbindung | {{appName}}",
      description:
        "{{freeCredits}} Gratis-Credits pro Monat. {{subCredits}} Credits für {{subPrice}} im Monat oder ein Paket, das nie verfällt. Ein Guthaben für {{modelCount}} Modelle, vom Mainstream bis unzensiert.",
    },
    buyCredits: {
      title: "Credits kaufen - Abo oder Pakete | {{appName}}",
      description:
        "{{subCredits}} Credits im Monat für {{subPrice}} oder Credit-Pakete ohne Ablaufdatum. Zahlung per Karte oder Krypto. Nutzbar für {{modelCount}} KI-Modelle.",
    },
    history: {
      title: "Credit-Verlauf | {{appName}}",
      description:
        "Jeder Credit rein und raus: Käufe, monatliche Gutschriften, Empfehlungsprovisionen und was jeder Chat gekostet hat.",
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

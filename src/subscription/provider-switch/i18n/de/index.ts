import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zahlungen",
  tags: {
    subscription: "Abonnement",
    billing: "Abrechnung",
  },

  get: {
    title: "Plan umziehen",
    titleShort: "Plan umziehen",
    description:
      "Zeigt, ob dein Kartenplan zum neuen Zahlungsanbieter umziehen kann und wann die Abrechnung dort beginnt.",
  },
  post: {
    title: "Planumzug starten",
    titleShort: "Plan umziehen",
    description:
      "Öffnet den Checkout beim neuen Zahlungsanbieter für deinen aktuellen Plan. Dein alter Kartenplan endet, sobald der neue bezahlt ist. Keine Doppelabbuchung.",
  },

  form: {
    fields: {
      provider: {
        label: "Zahlungsart",
        description:
          "Karte (Whop) oder Krypto (NOWPayments). Standard ist die Hauptzahlungsart.",
      },
    },
  },

  response: {
    offer: "Angebot",
    targetProvider: "Neuer Anbieter",
    providers: "Zahlungsarten",
    nowPaymentsAcceptsCards: "Kartenzahlung über NOWPayments",
    cryptoMinUsd: "Niedrigster Krypto-Betrag (USD)",
    plan: "Plan",
    billingInterval: "Abrechnungsintervall",
    pastDue: "Überfällig",
    deadline: "Plan läuft bis",
    billingStartAt: "Neue Abrechnung ab",
    firstPeriodEnd: "Erster neuer Zeitraum endet",
    carryOver: "Übernahme der bezahlten Zeit",
    checkoutUrl: "Checkout-Link",
    sessionId: "Checkout-Sitzung",
  },

  widget: {
    badge: "Handlung nötig",
    title: "Zu frei für unseren Kartenanbieter",
    description:
      "Die haben entschieden: Eine KI, die frei antwortet, passt nicht in ihre Regeln. Wir ändern keine einzige Antwort. Dein Plan und deine Credits sind sicher.",
    deadline:
      "Kein Stress: Dein Plan läuft bis zum {{date}}. Zieh ihn jederzeit vorher um.",
    carryExtend:
      "Früh umziehen kostet nichts extra: Bereits bezahlte Tage werden übernommen (der erste neue Zeitraum läuft bis zum {{date}}).",
    carryDeferred:
      "Heute wird nichts abgebucht. Die Abrechnung beim neuen Anbieter beginnt am {{date}}, wenn deine bezahlte Zeit endet.",
    pastDue:
      "Deine letzte Verlängerung ist nicht durchgegangen. Zieh jetzt um, um deinen Plan zu behalten.",
    unsupportedPlan:
      "Der neue Kartencheckout kann diesen Plan noch nicht monatlich anbieten. Wähl jährliche Abrechnung oder zahl mit Krypto.",
    cta: "Plan umziehen",
    ctaLoading: "Checkout wird geöffnet...",
    noDoubleCharge:
      "Dein alter Kartenplan endet, sobald der neue bezahlt ist. Du zahlst nie doppelt.",
    checkoutReady: "Checkout ist bereit.",
    openCheckout: "Checkout öffnen",
    notEligible: "Kein Kartenplan zum Umziehen.",
  },

  manage: {
    cancelOld: "Alten Kartenplan kündigen",
    moveFirst: "Plan behalten? Zieh ihn oben um. Kündigen hier beendet ihn.",
  },

  enums: {
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
      whop: "Whop",
    },
    carryOver: {
      extendFirstPeriod:
        "Jetzt abbuchen, bezahlte Zeit verlängert den ersten Zeitraum",
      deferredStart: "Abrechnung beginnt, wenn die bezahlte Zeit endet",
    },
    status: {
      pending: "Checkout gestartet",
      completed: "Umgezogen",
      cancelFailed: "Umgezogen, Kündigung des alten Plans fehlgeschlagen",
    },
    cancelMode: {
      atPeriodEnd: "Zum Periodenende",
      immediate: "Sofort",
    },
    offer: {
      available: "Verfügbar",
      planNotSupported: "Plan nicht unterstützt",
      notEligible: "Nicht berechtigt",
    },
    notice: {
      sending: "Wird gesendet",
      sent: "Gesendet",
      failed: "Fehlgeschlagen",
    },
  },

  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Prüf die Anfrage und versuch es noch mal.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melde dich an, um deinen Plan umzuziehen.",
    },
    forbidden: {
      title: "Nicht erlaubt",
      description: "Dieses Konto kann keinen Plan umziehen.",
    },
    notFound: {
      title: "Kein Kartenplan",
      description: "Auf diesem Konto gibt es keinen Kartenplan zum Umziehen.",
    },
    conflict: {
      title: "Nichts umzuziehen",
      description:
        "Der Planumzug ist gerade nicht offen, oder dieser Plan kann nicht umziehen. Dein Plan läuft weiter.",
    },
    unsupportedPlan: {
      title: "Plan nicht unterstützt",
      description:
        "Der neue Anbieter kann diesen Plan mit diesem Abrechnungsintervall nicht anbieten.",
    },
    server: {
      title: "Etwas ist kaputt",
      description:
        "Der Checkout konnte nicht geöffnet werden. Versuch es in einer Minute noch mal.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Server nicht erreichbar. Prüf deine Verbindung.",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description: "Etwas Unerwartetes ist passiert. Versuch es noch mal.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichere oder verwirf zuerst deine Änderungen.",
    },
  },

  success: {
    title: "Checkout bereit",
    description: "Schließ die Zahlung ab, um deinen Plan umzuziehen.",
  },
};

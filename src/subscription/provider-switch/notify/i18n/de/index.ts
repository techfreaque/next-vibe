import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zahlungen",
  tag: "Hinweis zum Planwechsel",

  post: {
    title: "Hinweis zum Planwechsel",
    titleShort: "Planwechsel-Hinweis",
    description:
      "Einmalige Mail an alle Kartenabonnenten: Plan zum neuen Zahlungsanbieter umziehen. Der Testlauf listet die Empfänger und rendert eine Vorschau. Ein echter Lauf schreibt jeden Nutzer genau einmal an und startet erst, wenn der neue Anbieter live ist.",
    container: {
      title: "Hinweis zum Planwechsel",
      description:
        "Kartenabonnenten (aktiv, Testphase, überfällig, endet zum Periodenende), die noch keine Mail bekommen haben",
    },
    fields: {
      dryRun: {
        label: "Testlauf",
        description:
          "Empfänger auflisten und Vorschau rendern. Es wird nichts gesendet.",
      },
      batchSize: {
        label: "Batchgröße",
        description:
          "Maximale Anzahl Mails in diesem Lauf (zusätzlich durch das Stundenbudget begrenzt)",
      },
      hourlyCap: {
        label: "Stundenlimit",
        description:
          "Maximale Plattform-Mails pro Stunde, alle Mails eingerechnet (Postfachlimit ist 500)",
      },
      previewLocale: {
        label: "Vorschausprache",
        description: "Mail in dieser Sprache rendern",
      },
      testRecipient: {
        label: "Testempfänger",
        description:
          "Schickt die echte Mail nur an diese Adresse. Ohne Live-Prüfung, niemand wird als angeschrieben markiert.",
      },
    },
    response: {
      providerLive: "Neuer Anbieter live",
      targetProvider: "Neuer Anbieter",
      totalRecipients: "Kartenabonnenten",
      alreadyNotified: "Bereits angeschrieben",
      pending: "Noch anzuschreiben",
      planNotSupported:
        "Plan beim neuen Anbieter nicht verfügbar (übersprungen)",
      hourlyBudget: "Verbleibendes Stundenbudget",
      sent: "Gesendet",
      failed: "Fehlgeschlagen",
      byLocale: "Nach Sprache",
      locale: "Sprache",
      count: "Anzahl",
      recipients: "Empfänger in diesem Lauf",
      userId: "Nutzer",
      email: "E-Mail",
      status: "Status",
      deadline: "Frist",
      testSentTo: "Test gesendet an",
      previewSubject: "Vorschau Betreff",
      previewHtml: "Vorschau HTML",
    },
    widget: {
      dryRunBadge: "Testlauf",
      liveBadge: "Echter Lauf",
      notLive:
        "Neuer Anbieter noch nicht live. Ein echter Lauf wird abgelehnt.",
      run: "Starten",
      noRecipients: "Niemand mehr anzuschreiben.",
    },
    errors: {
      notLive: {
        title: "Neuer Anbieter nicht live",
        description:
          "Setze SUBSCRIPTION_SWITCH_PROVIDER und SUBSCRIPTION_SWITCH_ENABLED=true und stell vor dem Versand sicher, dass der Anbieter Zahlungen annimmt.",
      },
      validation: {
        title: "Ungültige Anfrage",
        description: "Prüf die Felder und versuch es noch mal.",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Nur für Admins.",
      },
      forbidden: {
        title: "Nicht erlaubt",
        description: "Nur für Admins.",
      },
      server: {
        title: "Lauf fehlgeschlagen",
        description: "Der Hinweis-Lauf ist fehlgeschlagen. Prüf die Logs.",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Etwas Unerwartetes ist passiert.",
      },
    },
    success: {
      title: "Hinweis-Lauf fertig",
      description: "Die Zahlen stehen unten.",
    },
  },

  emailTemplate: {
    name: "Hinweis zum Planwechsel",
    description:
      "Einmalige Mail, die Kartenabonnenten bittet, ihren Plan zum neuen Zahlungsanbieter umzuziehen",
    category: "Abonnements",
    preview: {
      privateName: {
        label: "Name",
        description: "Vorname des Abonnenten",
      },
      planName: {
        label: "Plan",
        description: "Name des Plans",
      },
      deadline: {
        label: "Frist",
        description: "Letzter Tag des bezahlten Zeitraums",
      },
    },
  },

  email: {
    subject:
      "Zu frei für unseren Kartenanbieter. Zieh deinen Plan bis zum {{deadline}} um",
    subjectPastDue:
      "Zu frei für unseren Kartenanbieter. Zieh deinen Plan jetzt um",
    subjectNoDate:
      "Zu frei für unseren Kartenanbieter. Zieh deinen Plan um und behalte ihn",
    previewText:
      "Ein Klick sichert deinen Plan. Gleicher Preis, Credits bleiben.",
    headline: "Zu frei für deren Regeln. Genau richtig für dich.",
    greeting: "Hallo {{privateName}},",
    intro:
      "Unser Kartenzahlungsanbieter hat entschieden, dass eine KI mit freien Antworten nicht in seine Regeln passt, deshalb laufen Kartenzahlungen für deinen {{planName}}-Plan nicht mehr. Ein Klick zieht ihn bis zum {{deadline}} auf unseren neuen Checkout um, sonst endet der Plan am {{deadline}} und deine Credits bleiben.",
    introPastDue:
      "Unser Kartenzahlungsanbieter hat entschieden, dass eine KI mit freien Antworten nicht in seine Regeln passt, deshalb ist deine letzte {{planName}}-Verlängerung nicht durchgegangen. Ein Klick zieht deinen Plan sofort auf unseren neuen Checkout um, und deine Credits bleiben so oder so.",
    introNoDate:
      "Unser Kartenzahlungsanbieter hat entschieden, dass eine KI mit freien Antworten nicht in seine Regeln passt, deshalb laufen Kartenzahlungen für deinen {{planName}}-Plan nicht mehr. Ein Klick zieht ihn auf unseren neuen Checkout um, sonst endet der Plan mit Ablauf deines bezahlten Zeitraums und deine Credits bleiben.",
    cta: "Plan umziehen",
    reassurance:
      "Gleicher Plan, gleicher Preis, bezahlte Tage wandern mit. Keine Doppelabbuchung. Jeder Credit bleibt deiner.",
    stance:
      "Eher wechseln wir den Zahlungsanbieter, als auch nur eine Antwort zu zensieren.",
    crypto: "Lieber mit Krypto zahlen? Geht auch.",
    cryptoCta: "Mit Krypto bezahlen",
    help: "Fragen? Antworte einfach auf diese Mail. Ein Mensch liest jede einzelne.",
    signoff: "Danke, dass du hinter uns stehst,\nDein {{appName}}-Team",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      firstChat: "Angemeldet, nie gechattet",
      outOfCredits: "Gratis-Credits aufgebraucht",
      whatsNew: "7 Tage inaktiv",
      winBack: "30 Tage inaktiv",
      newsletterInvite: "Newsletter, kein Konto",
    },
    enrollmentStatus: {
      active: "Aktiv",
      completed: "Abgeschlossen",
      exited: "Beendet",
    },
    exitReason: {
      goalMet: "Ziel erreicht",
      unsubscribed: "Abgemeldet",
      suppressed: "Gesperrt",
      ineligible: "Nicht mehr berechtigt",
      sendFailed: "Versand fehlgeschlagen",
    },
    sendStatus: {
      pending: "Ausstehend",
      sent: "Gesendet",
    },
    template: {
      firstChatPrompts: "Erster Chat: drei Prompts",
      outOfCredits: "Credits leer: Tarife",
      whatsNew: "Was ist neu",
      winBack: "Rückholung: letzte Mail",
      inviteSignup: "Einladung: Konto erstellen",
      inviteReminder: "Einladung: Erinnerung",
    },
  },
  errors: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Administratorzugriff erforderlich",
    },
    forbidden: { title: "Verboten", description: "Keine Berechtigung" },
    server: {
      title: "Serverfehler",
      description: "Lifecycle-Vorgang fehlgeschlagen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    validation: {
      title: "Ungültige Eingabe",
      description: "Werte prüfen und erneut versuchen",
    },
    notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
    conflict: { title: "Konflikt", description: "Konflikt" },
    network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Nicht gespeicherte Änderungen",
    },
  },
  emails: {
    greeting: "Hallo,",
    greetingNamed: "Hallo {{name}},",
    signoff: "Max",
    signature: "unbottled.ai",
    senderName: "Max von unbottled.ai",
    unsubscribeText: "Abmelden:",
    firstChatPrompts: {
      subject: "Drei erste Nachrichten zum Kopieren",
      preview:
        "Eine unzensiert, eine Mainstream, ein Bild. Aussuchen, abschicken.",
      intro:
        "Dein Konto steht, der Chat ist noch leer. Hier sind drei Nachrichten für den Anfang. Kopieren, einfügen, abschicken.",
      uncensoredTitle: "Fragen ohne Belehrung",
      uncensoredPrompt:
        "„Schreib eine düstere Krimigeschichte, in der der Täter gewinnt. Kein Happy End, keine Moral.“ Nimm eins der {{uncensoredCount}} unzensierten Modelle. Einmal bestätigen, dass du volljährig bist, fertig.",
      mainstreamTitle: "Die Großen im direkten Vergleich",
      mainstreamPrompt:
        "„Plane ein günstiges Wochenende in Lissabon. Wo essen, was auslassen?“ Frag zuerst GPT. Wechsle dann im selben Thread zu Claude oder Gemini und vergleiche.",
      mediaTitle: "Bild, Video oder Song erstellen",
      mediaPrompt:
        "„Ein Fuchs mit rotem Schal in einer verschneiten Straße in Tokio, nachts, analoges Foto.“ Ein Prompt, ein Bild. Kurze Videos und Musik funktionieren genauso.",
      body: "Dein Gratis-Konto bekommt jeden Monat {{freeCreditsSignedIn}} Credits, mit Newsletter {{freeCreditsMax}}. Keine Karte nötig.",
      cta: "Erste Nachricht senden",
      ps: "P.S. Kein Plan, womit du anfangen sollst? Antworte einfach auf diese Mail. Wir lesen die Antworten.",
    },
    outOfCredits: {
      subject: "Deine Gratis-Credits für diesen Monat sind aufgebraucht",
      preview:
        "Am 1. kommen sie zurück. Oder du machst jetzt weiter, Tarife ab {{subscriptionPrice}} im Monat.",
      intro:
        "Deine Gratis-Credits für diesen Monat sind weg. Am 1. kommen sie zurück. Keine Lust zu warten? Such dir einen Tarif aus. Klare Preise.",
      starterTitle: "Starter: {{subscriptionPrice}}/Monat",
      starterBody:
        "{{subscriptionCredits}} Credits jeden Monat, jederzeit kündbar. Passt, wenn du fast täglich chattest.",
      moreTitle: "Mehr nötig? Drei größere Tarife",
      moreBody:
        "Plus: {{plusCredits}} Credits für {{plusPrice}}. Pro: {{proCredits}} für {{proPrice}}. Ultra: {{ultraCredits}} für {{ultraPrice}}. Zu jedem Tarif gibt es Credit-Pakete zum Aufstocken, ohne Ablaufdatum.",
      body: "Zahlung per Karte, PayPal oder Krypto. Gleiche Modelle, gleiche Filtereinstellungen.",
      cta: "{{subscriptionCredits}} Credits für {{subscriptionPrice}}",
      ps: "P.S. Bis zum 1. warten ist völlig in Ordnung. Deine Threads bleiben, wo sie sind.",
    },
    whatsNew: {
      subject: "Das hat sich getan, seit du weg warst",
      preview:
        "{{modelCount}} Modelle, Video und Musik im Chat, sechs Sprachen.",
      intro: "Dein letzter Chat ist über eine Woche her. Das ist neu.",
      modelsTitle: "{{modelCount}} Chat-Modelle",
      modelsBody:
        "{{mainstreamCount}} Mainstream, {{openCount}} offen, {{uncensoredCount}} unzensiert. Wechsel mitten im Thread, wann immer du willst.",
      mediaTitle: "Bilder, Videos und Musik",
      mediaBody:
        "Prompt in den Chat, zurück kommt ein Bild, ein kurzer Clip oder ein Track.",
      languagesTitle: "Sechs Sprachen",
      languagesBody:
        "Die ganze App läuft auf Deutsch, Englisch, Polnisch, Französisch, Spanisch und Italienisch.",
      body: "Deine Threads liegen genau da, wo du aufgehört hast.",
      cta: "Alle Modelle ansehen",
      ps: "P.S. Kennst du jemanden, für den das passt? Über deinen Empfehlungslink bekommst du {{referralPercent}} % von allem, was diese Person ausgibt, jeden Monat.",
    },
    winBack: {
      subject: "Eine letzte Mail von uns",
      preview: "Konto, Threads und Gratis-Credits sind noch da.",
      intro:
        "Dein letzter Chat ist über einen Monat her. Das ist unsere letzte Erinnerung.",
      body: "Dein Konto, deine Threads und deine monatlichen Gratis-Credits sind alle noch da. Mehr Modelle als beim letzten Mal, und den Filter stellst immer noch du ein.",
      cta: "Zurück zu deinen Chats",
      ps: "P.S. Was hat dich gestört? Antworte und sag es uns. Wir lesen jede Antwort.",
    },
    inviteSignup: {
      subject: "Du liest den Newsletter. Jetzt probier die App.",
      preview:
        "Gratis-Konto, bis zu {{freeCreditsMax}} Credits im Monat. Ohne Karte.",
      intro:
        "Du bekommst unseren Newsletter. Die App ist nur einen Schritt entfernt: {{modelCount}} Modelle, und den Filter stellst du ein.",
      guestTitle: "Ohne Konto: {{freeCreditsGuest}} Credits im Monat",
      guestBody: "Reicht, um ein paar Modelle zu testen.",
      accountTitle: "Gratis-Konto: {{freeCreditsSignedIn}} Credits im Monat",
      accountBody: "Deine Threads gespeichert, auf jedem Gerät.",
      newsletterTitle:
        "Konto + Newsletter: {{freeCreditsMax}} Credits im Monat",
      newsletterBody:
        "Lass den Newsletter in deinem Konto aktiv, dann gehört der Bonus dir.",
      body: "Keine Karte. Die Gratis-Credits starten, sobald du deine E-Mail-Adresse bestätigt hast.",
      cta: "Gratis-Konto erstellen",
    },
    inviteReminder: {
      subject: "Letzte Erinnerung: dein Gratis-Konto",
      preview:
        "{{freeCreditsMax}} statt {{freeCreditsGuest}} Credits im Monat. Ohne Karte.",
      intro:
        "Letzte Erinnerung. Ein Gratis-Konto mit Newsletter bekommt jeden Monat {{freeCreditsMax}} Credits. Ohne Konto sind es {{freeCreditsGuest}}.",
      body: "Dauert eine Minute. Keine Karte.",
      cta: "Gratis-Konto erstellen",
      ps: "P.S. Danach kommt keine Erinnerung mehr. Der Newsletter läuft ganz normal weiter.",
    },
  },
  emailTemplates: {
    category: "Lifecycle-Journeys",
    preview: {
      name: {
        label: "Vorname",
        description: "Name für die Anrede. Leer = allgemeine Anrede.",
      },
    },
    firstChatPrompts: {
      name: "Lifecycle: erster Chat",
      description:
        "48 Std. nach Anmeldung, verifiziertes Konto, noch kein Chat. Drei konkrete Prompts.",
    },
    outOfCredits: {
      name: "Lifecycle: Credits aufgebraucht",
      description:
        "Gratis-Credits des Monats verbraucht, nie bezahlt. Tarifpreise.",
    },
    whatsNew: {
      name: "Lifecycle: Was ist neu",
      description: "7 Tage ohne Chat. Modelle, Medien, Sprachen.",
    },
    winBack: {
      name: "Lifecycle: Rückholung",
      description: "30 Tage ohne Chat. Letzte Journey-Mail.",
    },
    inviteSignup: {
      name: "Lifecycle: Newsletter-Einladung",
      description:
        "Bestätigter Newsletter-Abonnent ohne Konto, 48 Std. nach Bestätigung.",
    },
    inviteReminder: {
      name: "Lifecycle: Einladungs-Erinnerung",
      description: "Eine Woche nach der Einladung, immer noch kein Konto.",
    },
  },
  run: {
    post: {
      title: "Automatisierte E-Mail-Strecken ausführen",
      titleShort: "Lifecycle ausführen",
      description:
        "Nimmt neu berechtigte Kontakte in die E-Mail-Strecken auf und sendet fällige Nachrichten. Der Notausschalter pausiert beides.",
      container: {
        title: "Lifecycle ausführen",
        description:
          "Aufnehmen und senden. Notausschalter und Frequenzlimit gelten.",
      },
      fields: {
        dryRun: {
          label: "Testlauf",
          description: "Nichts tun, nur berichten",
        },
      },
      response: {
        paused: "Pausiert",
        enrolled: "Aufgenommen",
        sent: "Gesendet",
        exited: "Beendet",
        deferred: "Verschoben",
        failed: "Fehlgeschlagen",
      },
      success: {
        title: "Lifecycle-Lauf beendet",
        description: "Fällige Journey-Schritte wurden verarbeitet",
      },
    },
  },
  settings: {
    post: {
      title: "Lifecycle-Einstellungen",
      titleShort: "Lifecycle-Einstellungen",
      description:
        "Notausschalter, Frequenzlimit, Versand-Drosselung und Einwilligungsmodus für Lifecycle-Mails.",
      container: {
        title: "Lifecycle-Einstellungen",
        description: "Leeres Feld behält den aktuellen Wert.",
      },
      fields: {
        paused: {
          label: "Gesamten Lifecycle-Versand pausieren",
          description: "An = nichts wird aufgenommen oder gesendet",
        },
        minHoursBetweenEmails: {
          label: "Mindeststunden zwischen Mails",
          description:
            "Frequenzlimit pro Kontakt, über Lifecycle und Kampagnen hinweg",
        },
        maxSendsPerRun: {
          label: "Max. Mails pro Lauf",
          description: "Drosselung pro geplantem Lauf",
        },
        autoEnrollWindowDays: {
          label: "Auto-Aufnahme-Fenster (Tage)",
          description:
            "Der geplante Lauf nimmt nur Kontakte auf, deren Auslöser so aktuell ist. Ältere laufen über den Backfill.",
        },
        requireUserMarketingConsent: {
          label: "Marketing-Einwilligung für Nutzer verlangen",
          description:
            "An = registrierte Nutzer brauchen Marketing-Einwilligung oder bestätigtes Newsletter-Opt-in",
        },
      },
      response: {
        paused: "Pausiert",
        minHoursBetweenEmails: "Mindeststunden zwischen Mails",
        maxSendsPerRun: "Max. Mails pro Lauf",
        autoEnrollWindowDays: "Auto-Aufnahme-Fenster (Tage)",
        requireUserMarketingConsent: "Marketing-Einwilligung erforderlich",
      },
      success: {
        title: "Einstellungen gespeichert",
        description: "Lifecycle-Einstellungen sind aktiv",
      },
    },
  },
  backfill: {
    post: {
      title: "Lifecycle-Backfill",
      titleShort: "Backfill",
      description:
        "Vorschau, dann bestehende berechtigte Kontakte in die passende Journey aufnehmen. Start bei Schritt 0, verteilt über ein Sendefenster.",
      container: {
        title: "Bestehende Kontakte aufnehmen",
        description:
          "Testlauf ist Standard. Solange pausiert, wird nichts gesendet.",
      },
      fields: {
        dryRun: {
          label: "Testlauf",
          description: "Nur zählen. Ausschalten zum Aufnehmen.",
        },
        spreadHours: {
          label: "Verteilen über (Stunden)",
          description: "Zeitfenster, über das die ersten Mails verteilt werden",
        },
      },
      response: {
        dryRunResult: "Testlauf",
        segments: "Segmente",
        journey: "Journey",
        eligible: "Berechtigt",
        alreadyEnrolled: "Bereits aufgenommen",
        enrolled: "Aufgenommen",
        autoEligible: "Geplanter Lauf würde aufnehmen",
        heldSuppressed: "Zurückgehalten: abgemeldet / Bounce",
        heldPaid: "Zurückgehalten: bereits zahlend",
        heldNoConsent: "Zurückgehalten: keine Marketing-Einwilligung",
        heldUnverified: "Zurückgehalten: E-Mail nicht verifiziert",
        heldPendingNewsletter: "Zurückgehalten: Newsletter nicht bestätigt",
        heldInactiveAccount: "Zurückgehalten: gesperrt / inaktiv",
        heldNothingDue: "Zurückgehalten: nichts fällig (aktiv, hat Credits)",
      },
      success: {
        title: "Backfill beendet",
        description: "Segment-Zahlen stehen in der Antwort",
      },
    },
  },
  overview: {
    get: {
      title: "Lifecycle-Journeys",
      titleShort: "Lifecycle",
      description:
        "Journeys, Aufnahmen, Sendungen und Konversionen. Notausschalter und Backfill.",
      response: {
        paused: "Pausiert",
        minHoursBetweenEmails: "Mindeststunden zwischen Mails",
        maxSendsPerRun: "Max. Mails pro Lauf",
        autoEnrollWindowDays: "Auto-Aufnahme-Fenster (Tage)",
        requireUserMarketingConsent: "Marketing-Einwilligung erforderlich",
        journeys: "Journeys",
        steps: "Schritte",
        enrolled: "Aufgenommen",
        active: "Aktiv",
        completed: "Abgeschlossen",
        exited: "Beendet",
        converted: "Konvertiert",
        unsubscribed: "Abgemeldet",
        sent: "Gesendet",
        sent24h: "Gesendet (24h)",
        attributedPaid: "Zahlend nach Aufnahme",
      },
      success: {
        title: "Lifecycle geladen",
        description: "Journey-Zahlen geladen",
      },
    },
  },
  widget: {
    title: "Lifecycle-Journeys",
    refresh: "Aktualisieren",
    pausedTitle: "Pausiert",
    pausedBody: "Nichts wird aufgenommen oder gesendet.",
    liveTitle: "Live",
    liveBody: "Fällige Mails gehen bei jedem Lauf raus.",
    pause: "Alles pausieren",
    resume: "Versand fortsetzen",
    settings: "Einstellungen",
    backfill: "Backfill",
    capLine: "Limit: 1 Mail pro {{hours}} Std. Max. {{max}} pro Lauf.",
    consentOn: "Nutzer brauchen Marketing-Einwilligung.",
    consentOff: "Nutzer brauchen keine Marketing-Einwilligung.",
    noJourneys: "Keine Journeys.",
    stepsLine: "{{steps}} Schritte",
    enrolled: "Aufgenommen",
    active: "Aktiv",
    sent: "Gesendet",
    sent24h: "Gesendet (24h)",
    converted: "Konvertiert",
    paid: "Zahlend danach",
    unsubscribed: "Abgemeldet",
  },
};

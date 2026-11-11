import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      inactiveUser: "Angemeldet, nie gechattet",
      engagedFree: "Gechattet, nie bezahlt",
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
      inactiveNudge: "Anstoß: Chat starten",
      inactiveModels: "Modellwahl",
      inactiveUpgrade: "Credit-Hinweis",
      engagedValue: "Mehrwert: mehr herausholen",
      engagedUpgrade: "Upgrade: nicht auf den Reset warten",
      engagedLast: "Letzte Notiz zu Credits",
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
    signature: "unbottled.ai",
    unsubscribeText: "Abmelden:",
    inactiveNudge: {
      subject: "Du hast dich angemeldet. Gefragt hast du noch nichts.",
      preview: "Deine Gratis-Credits warten.",
      body1:
        "Dein Konto ist aktiv, deine Gratis-Credits erneuern sich jeden Monat. Kein Filter, den du nicht selbst gewählt hast.",
      body2:
        "Stell die Frage, die du sonst nirgends stellen konntest. Eine Nachricht reicht.",
      cta: "Chat starten",
    },
    inactiveModels: {
      subject: "{{modelCount}} Modelle. Du bestimmst, was gefiltert wird.",
      preview: "Mainstream, offen oder unzensiert. Deine Entscheidung.",
      body1:
        "Die meiste KI entscheidet für dich, was du fragen darfst. Hier wählst du: Mainstream-, offene oder unzensierte Modelle, direkt nebeneinander.",
      body2:
        "Modell wählen, eigenen Filter einstellen, einen Prompt senden. Mehr Setup gibt es nicht.",
      cta: "Modell wählen",
    },
    inactiveUpgrade: {
      subject: "Gratis-Credits zum Start. Credits für mehr.",
      preview: "Größere Modelle, längere Chats.",
      body1:
        "Gratis-Credits reichen weit. Wenn du größere Modelle und längere Gespräche willst, lade auf und mach weiter.",
      body2: "Du zahlst nur, was du nutzt. Kauf Credits, wenn du sie brauchst.",
      cta: "Credit-Optionen ansehen",
    },
    engagedValue: {
      subject: "Du chattest schon. So holst du mehr heraus.",
      preview: "Derselbe Prompt, ein zweites Modell.",
      body1:
        "Jedes Modell antwortet anders. Schick denselben Prompt an ein zweites und vergleiche.",
      body2:
        "Deine Gratis-Credits erneuern sich monatlich. Ist das Limit erreicht, musst du nicht warten.",
      cta: "Weiterchatten",
    },
    engagedUpgrade: {
      subject: "Gratis-Credits aufgebraucht? Warte nicht auf den Reset.",
      preview: "Aufladen dauert eine Minute.",
      body1:
        "Gratis-Credits erneuern sich monatlich. Bezahlte Credits lassen dich nicht warten: Paket oder Abo wählen und im Thread bleiben.",
      body2: "Du zahlst pro Nutzung. Sonst nichts.",
      cta: "Mehr Credits holen",
    },
    engagedLast: {
      subject: "Unsere letzte Notiz zu Credits",
      preview: "Danach lassen wir dich in Ruhe.",
      body1:
        "Das ist die letzte Mail dieser Reihe. Reichen dir die Gratis-Credits, bleib dabei. Brauchst du mehr Luft, sind Credits einen Klick entfernt.",
      body2: "Du kannst dich jederzeit am Ende dieser E-Mail abmelden.",
      cta: "Credit-Optionen prüfen",
    },
    inviteSignup: {
      subject: "Du bist auf der Liste. Jetzt fehlt das Konto.",
      preview: "Gratis-Konto. 70 Credits jeden Monat.",
      body1:
        "Ein kostenloses Konto bringt dir 70 Credits pro Monat und Zugriff auf {{modelCount}} Modelle, mit einem Filter, den du selbst setzt.",
      body2:
        "Newsletter-Abonnenten bekommen jeden Monat zusätzlich +20 Credits Bonus.",
      cta: "Gratis-Konto erstellen",
    },
    inviteReminder: {
      subject: "Noch kein Konto? Das dauert eine Minute.",
      preview: "Der Start ist gratis.",
      body1:
        "Du liest uns per Mail. Du kannst uns direkt nutzen: Modell wählen, alles fragen, Filter selbst bestimmen.",
      body2:
        "Gratis-Konten bekommen 70 Credits pro Monat. Newsletter-Abonnenten bekommen 20 dazu.",
      cta: "Gratis-Konto erstellen",
    },
  },
  run: {
    post: {
      title: "Lifecycle-Journeys ausführen",
      titleShort: "Lifecycle ausführen",
      description:
        "Neu berechtigte Kontakte aufnehmen und fällige Journey-Mails senden. Tut nichts, solange der Notausschalter aktiv ist.",
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
        heldSuppressed: "Zurückgehalten: abgemeldet / Bounce",
        heldPaid: "Zurückgehalten: bereits zahlend",
        heldNoConsent: "Zurückgehalten: keine Marketing-Einwilligung",
        heldUnverified: "Zurückgehalten: E-Mail nicht verifiziert",
        heldPendingNewsletter: "Zurückgehalten: Newsletter nicht bestätigt",
        heldInactiveAccount: "Zurückgehalten: gesperrt / inaktiv",
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

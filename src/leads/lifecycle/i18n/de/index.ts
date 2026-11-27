import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      firstChat: "Angemeldet, nie gechattet",
      outOfCredits: "Gratis-Credits aufgebraucht",
      whatsNew: "7 Tage inaktiv",
      winBack: "30 Tage inaktiv",
      customerCheckin: "Aktives Abo: Feedback-Check-ins",
      lapsedWinback: "Früher bezahlt, 14 Tage still",
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
      firstChatSkills: "Erster Chat: Skill fängt an",
      outOfCredits: "Credits leer: Tarife",
      whatsNew: "Was ist neu",
      winBack: "Rückholung: letzte Mail",
      paymentFailed: "Zahlung fehlgeschlagen",
      customerLikes: "Kunde: was passt",
      customerBuildNext: "Kunde: was als Nächstes",
      lapsedWinback: "Ehemalig: warum aufgehört",
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
    signoff: "Dein unbottled.ai-Team",
    senderName: "unbottled.ai",
    unsubscribeText: "Abmelden:",
    ctaLine: "{{text}}: {{url}}",
    footerAccount:
      "Du bekommst diese Mail, weil du ein unbottled.ai-Konto hast.",
    footerAccountLink: "Diese Mails abbestellen",
    footerBilling: "Dies ist ein Zahlungshinweis zu deinem Abo.",
    newModels: {
      one: "neues Modell",
      few: "neue Modelle",
      many: "neue Modelle",
      other: "neue Modelle",
    },
    tier: {
      mainstream: "Mainstream",
      open: "Open Source",
      uncensored: "Unzensiert",
    },
    firstChatPrompts: {
      subject: "Drei erste Nachrichten. Kopieren, einfügen, senden.",
      preview:
        "Eine Frage, der gefilterte KIs ausweichen. Ein Modellduell. Ein Bild.",
      intro:
        "Dein Konto steht, dein Chat ist noch leer. Nimm eine davon, füg sie ein, schick sie ab.",
      uncensoredTitle: "1. Frag, wo gefilterte KIs ausweichen",
      uncensoredPrompt:
        "„Vertritt in einer Debatte die Seite, die du normalerweise ablehnst. Mit voller Wucht, ohne Disclaimer.“ Nimm eins der {{uncensoredCount}} unzensierten Modelle. Einmal bestätigen, dass du volljährig bist, fertig.",
      mainstreamTitle: "2. Lass die Großen gegeneinander antreten",
      mainstreamPrompt:
        "„Plane ein günstiges Wochenende in Lissabon. Wo essen, was auslassen?“ Frag GPT. Wechsle dann im selben Thread zu Claude oder Gemini und vergleiche.",
      mediaTitle: "3. Erstell ein Bild",
      mediaPrompt:
        "„Ein Fuchs mit rotem Schal in einer verschneiten Straße in Tokio, nachts, analoges Foto.“ Ein Prompt, ein Bild.",
      body: "Deine Gratis-Credits sind schon auf deinem Konto. Keine Kreditkarte nötig.",
      cta: "Meinen Chat öffnen",
      ps: "P.S. Hängst du fest? Antworte auf diese Mail. Wir antworten auf jede Nachricht.",
    },
    firstChatSkills: {
      subject: "Keine Idee, was du schreiben sollst? Nimm einen Skill.",
      preview:
        "Charaktere und Spezialisten mit eigener Stimme, eigenem Modell, eigenen Tools.",
      intro:
        "Das leere Chatfenster ist die größte Hürde. Ein Skill gibt dem Chat eine Aufgabe, bevor du ein Wort tippst.",
      characterTitle: "Charaktere",
      characterBody:
        "Begleiter, Rollenspielpartner, bissige Kritiker. Jeder hat seine eigene Stimme und bleibt dabei.",
      specialistTitle: "Spezialisten",
      specialistBody:
        "Programmierer, Lektor, Rechercheur. Jeder bringt eigene Anweisungen, ein eigenes Modell und eigene Tools mit.",
      body: "Such dir einen aus und sag Hallo.",
      cta: "Skill aussuchen",
    },
    outOfCredits: {
      subject: "Gratis-Credits fast aufgebraucht. Neue am {{resetDate}}.",
      preview: "Nichts geht verloren. Deine Threads und Einstellungen bleiben.",
      intro:
        "Deine Gratis-Credits für diesen Monat sind fast aufgebraucht. Am {{resetDate}} werden sie aufgefüllt.",
      cta: "Meine Credits ansehen",
      plansLink: "Tarife ansehen",
    },
    paymentFailed: {
      subject: "Deine Abo-Zahlung ist fehlgeschlagen",
      preview:
        "Dein Tarif bleibt bis zum {{graceDate}} aktiv. Aktualisiere deine Zahlungsmethode, um ihn zu behalten.",
      intro: "Wir konnten die letzte Zahlung für dein Abo nicht einziehen.",
      body: "Dein Tarif bleibt bis zum {{graceDate}} aktiv. Aktualisiere vorher deine Zahlungsmethode, um ihn zu behalten. Hat deine Bank die Abbuchung zur Freigabe zurückgehalten (häufig bei indischen Karten)? Gib sie auf deiner Kontoseite frei. Du kannst auch ein einmaliges Credit-Paket kaufen oder mit Krypto zahlen.",
      cta: "Zahlungsmethode aktualisieren",
      ps: "P.S. Schon erledigt? Dann ignoriere diese Mail.",
    },
    customerLikes: {
      subject: "Eine Woche dabei. Was passt, was nicht?",
      preview:
        "Zwei Fragen. Eine Zeile Antwort reicht. Hilfreiches Feedback bringt {{feedbackCredits}} Credits.",
      intro:
        "Du nutzt deinen Tarif seit einer Woche. Danke dafür. Zwei Fragen:",
      likeTitle: "Was gefällt dir?",
      likeBody:
        "Das Modell, die Funktion, der Moment, in dem es Klick gemacht hat. Sag uns, was bleiben soll.",
      missingTitle: "Was fehlt oder hakt?",
      missingBody:
        "Ein Bug, eine verwirrende Einstellung, alles, was dich ausgebremst hat.",
      body: "Eine Zeile zu einer der beiden Fragen reicht. Hilfreiches Feedback bringt dir {{feedbackCredits}} Credits.",
      cta: "Feedback senden",
    },
    customerBuildNext: {
      subject: "Was sollen wir als Nächstes bauen?",
      preview: "Du bestimmst mit, was wir als Nächstes bauen.",
      intro: "Du unterstützt uns seit über einem Monat. Danke.",
      body: "Eine Frage: Was sollen wir als Nächstes für dich bauen? Ein Modell, eine Funktion, ein Fix. Antworte in einer Zeile. Hilfreiches Feedback bringt dir {{feedbackCredits}} Credits.",
      cta: "Idee schicken",
    },
    lapsedWinback: {
      subject: "Was hätten wir besser machen können?",
      preview:
        "Eine Zeile Antwort hilft. Hilfreiches Feedback bringt {{feedbackCredits}} Credits.",
      intro:
        "Du hast schon einmal für unbottled.ai bezahlt und warst länger nicht mehr da. Falls dich etwas gestört hat, sag es uns.",
      body: "Eine Zeile als Antwort reicht: Preis, ein fehlendes Modell, ein Bug, egal was. Hilfreiches Feedback bringt dir {{feedbackCredits}} Credits.",
      cta: "Feedback senden",
      newsPs:
        "P.S. Seit deinem letzten Besuch sind {{newModelCount}} {{newModelsPhrase}} dazugekommen, darunter {{modelList}}.",
      newsPsAll: "P.S. Seit deinem letzten Besuch neu dabei: {{modelList}}.",
    },
    whatsNew: {
      subject:
        "{{newModelCount}} {{newModelsPhrase}} seit deinem letzten Besuch",
      subjectOne: "Neu seit deinem letzten Besuch: {{newModelName}}",
      preview:
        "Nach deinem letzten Besuch dazugekommen. Schon in deiner Modellauswahl.",
      intro:
        "Seit deinem letzten Besuch sind {{newModelCount}} {{newModelsPhrase}} dazugekommen. Die neuesten:",
      introOne: "Seit deinem letzten Besuch ist ein Modell dazugekommen:",
      body: "Öffne einen Thread und wechsle das Modell. Dein Verlauf bleibt.",
      bodyMore:
        "Dazu {{moreCount}} weitere. Öffne einen Thread und wechsle das Modell mitten im Gespräch.",
      cta: "Meine Chats öffnen",
      introAll:
        "Seit deinem letzten Besuch sind {{newModelCount}} {{newModelsPhrase}} dazugekommen:",
    },
    whatsNewQuiet: {
      subject: "Frag ein Modell, dann ein anderes",
      preview: "Wechsle im selben Chat das Modell und vergleiche.",
      intro: "Probier das: Stell zwei Modellen dieselbe Frage.",
      compareTitle: "Modellwechsel",
      compareBody:
        "Frag ein Modell, wechsle im selben Thread zu einem anderen, vergleiche die Antworten.",
      body: "Deine Threads sind da, wo du sie gelassen hast.",
      cta: "Meine Chats öffnen",
    },
    winBack: {
      subject: "Was hat gefehlt?",
      preview: "Was hat gefehlt? Eine Zeile Antwort reicht.",
      intro:
        "Dein letzter Chat ist über einen Monat her. Eine Frage: Was hat gefehlt? Antworte einfach, eine Zeile reicht. Wir lesen jede Antwort und beheben, was wir können.",
      body: "Dein Konto und deine Threads sind noch da, und deine Gratis-Credits werden weiter jeden Monat aufgefüllt.",
      cta: "Sag uns, was gefehlt hat",
      newsPs:
        "P.S. Seit deinem letzten Besuch sind {{newModelCount}} {{newModelsPhrase}} dazugekommen, darunter {{modelList}}.",
      newsPsAll: "P.S. Seit deinem letzten Besuch neu dabei: {{modelList}}.",
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
        "Service. 24 Std. nach Anmeldung, verifiziertes Konto, noch kein Chat. Drei fertige erste Nachrichten.",
    },
    firstChatSkills: {
      name: "Lifecycle: erster Chat, Skills",
      description:
        "Service. Tag 5, immer noch kein Chat. Skills geben dem Chat eine Aufgabe.",
    },
    outOfCredits: {
      name: "Lifecycle: Credits aufgebraucht",
      description:
        "Service. Gratis-Credits des Monats verbraucht, nie bezahlt. Auffülldatum und Tarife.",
    },
    paymentFailed: {
      name: "Lifecycle: Zahlung fehlgeschlagen",
      description:
        "Transaktional. Abo überfällig: eine Mail pro fehlgeschlagener Zahlung, Tarif aktiv bis zum Ende der Kulanzfrist.",
    },
    customerLikes: {
      name: "Lifecycle: Kunden-Check-in",
      description:
        "Service. Aktives Abo, 7 Tage im Tarif. Reine Feedback-Frage, Antwort per Reply, Feedback-Credits wie im Footer versprochen.",
    },
    customerBuildNext: {
      name: "Lifecycle: was als Nächstes bauen",
      description:
        "Service. Aktives Abo, etwa 5 Wochen dabei. Fragt, was wir als Nächstes bauen sollen.",
    },
    lapsedWinback: {
      name: "Lifecycle: ehemalige Kunden",
      description:
        "Marketing. Früher bezahlt, kein aktiver Tarif, 14 Tage still. Fragt nach dem Grund, listet neue Modelle.",
    },
    whatsNew: {
      name: "Lifecycle: Was ist neu",
      description:
        "Marketing. 7 Tage ohne Chat. Modelle, die seit dem letzten Chat dazugekommen sind.",
    },
    winBack: {
      name: "Lifecycle: Rückholung",
      description:
        "Marketing. 30 Tage ohne Chat. Letzte Journey-Mail, fragt, was gefehlt hat.",
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

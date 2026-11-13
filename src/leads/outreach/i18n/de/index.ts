import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outreach",
  tags: {
    outreach: "outreach",
    crm: "crm",
    deals: "deals",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "Gesendet",
      replied: "Geantwortet",
      interested: "Interessiert",
      deal: "Deal",
      declined: "Abgelehnt",
      optOut: "Abgemeldet",
      bounced: "Unzustellbar",
    },
    contactKind: {
      creator: "Creator",
      newsletter: "Newsletter",
      directory: "Verzeichnis",
      other: "Sonstige",
    },
    direction: {
      out: "Von uns gesendet",
      in: "Antwort von ihnen",
    },
    dealStatus: {
      proposed: "Angeboten",
      committed: "Zugesagt",
      paid: "Bezahlt",
      canceled: "Storniert",
    },
    angleGroup: {
      affiliate: "A · Affiliate",
      audienceFit: "B · Zielgruppen-Fit",
      mission: "C · Meinungsfreiheit / Datenschutz",
      tryIt: "D · Testen / Eintrag",
      video: "Video-Anfrage",
      infoFirst: "Erst Preise",
      negotiation: "Verhandlung",
      other: "Sonstige",
    },
    attributionBasis: {
      tracked: "Tracking-Link / Ref-Code",
      channel: "Kanalweit",
      none: "Nicht getrackt",
    },
  },
  crm: {
    get: {
      title: "Outreach-CRM",
      titleShort: "Outreach",
      description:
        "Jeder angeschriebene Kontakt, sein Stand, und was die bezahlten Deals an Registrierungen und Umsatz zurückgebracht haben.",
      fields: {
        status: {
          label: "Status",
          description: "Nur Kontakte mit diesem Status",
        },
        kind: {
          label: "Art",
          description: "Creator, Newsletter, Verzeichnis oder Sonstige",
        },
        angle: {
          label: "Ansatz",
          description:
            "Anfang des Pitch-Ansatzes, z. B. A, B-audience-fit, VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "Suche",
          description: "Name, E-Mail, Betreff oder Notizen",
          placeholder: "Name, E-Mail, Betreff suchen…",
        },
        page: { label: "Seite", description: "Seitennummer" },
        limit: { label: "Pro Seite", description: "Kontakte pro Seite" },
      },
      response: {
        summary: "Übersicht",
        angles: "Ansätze",
        contacts: "Kontakte",
        deals: "Deals",
        dealTotals: "Deal-Summen",
      },
      widget: {
        title: "Outreach",
        subtitle:
          "Wen wir angeschrieben haben, wer geantwortet hat, was das Geld gebracht hat.",
        refresh: "Aktualisieren",
        addContact: "Kontakt erfassen",
        addDeal: "Deal anlegen",
        import: "Log importieren",
        loading: "Outreach wird geladen…",
        allStatuses: "Alle",
        clearFilters: "Filter zurücksetzen",
        kpi: {
          contacts: "Kontakte",
          replyRate: "Antwortquote",
          replyRateHint: "{{replied}} von {{total}} haben geantwortet",
          deals: "Bezahlte Deals",
          spent: "Ausgegeben",
          spentHint: "{{committed}} zugesagt, noch nicht bezahlt",
        },
        angles: {
          title: "Ansätze",
          hint: "Antwortquote je Pitch-Ansatz. Mehr von dem, was Antworten bringt.",
          row: "{{contacts}} angeschrieben · {{replied}} geantwortet",
        },
        contacts: {
          title: "Kontakte",
          columns: {
            contact: "Kontakt",
            status: "Status",
            angle: "Ansatz",
            last: "Letzter Kontakt",
            touches: "E-Mails",
          },
          showing: "{{start}}–{{end}} von {{total}}",
          never: "nie",
          replied: "Antwort {{date}}",
        },
        deals: {
          title: "Bezahlte Deals",
          hint: "Ausgaben gegen Besuche, Registrierungen und Umsatz, die Tracking-Link oder Ref-Code des Deals gebracht haben.",
          columns: {
            deal: "Deal",
            status: "Status",
            spend: "Ausgabe",
            visits: "Besuche",
            signups: "Registrierungen",
            paying: "Zahlend",
            revenue: "Umsatz",
            costPerSignup: "Kosten / Registrierung",
          },
          live: "live ab {{date}}",
          basisChannel: "kanalweit, nicht deal-spezifisch",
          basisNone: "kein Link, keine Kampagne, kein Ref-Code zum Abgleich",
          empty: {
            title: "Noch keine bezahlten Deals",
            hint: "Deal anlegen, sobald ein Creator einem Preis zustimmt. Tracking-Link oder Ref-Code anhängen, dann landen die Ergebnisse hier.",
          },
        },
        empty: {
          title: "Noch kein Outreach erfasst",
          hint: "Sendelog importieren oder jede E-Mail beim Versand erfassen.",
          cta: "Sendelog importieren",
          filtered: "Keine Kontakte für diese Filter",
        },
        text: {
          header:
            "{{total}} Kontakte · {{replied}} geantwortet ({{rate}}) · {{deals}} bezahlte Deals",
          statusLine: "Status: {{counts}}",
          anglesTitle: "Ansätze (angeschrieben / geantwortet):",
          contactsTitle: "Kontakte {{start}}-{{end}} von {{total}}:",
          dealsTitle: "Bezahlte Deals:",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · Besuche {{visits}} · Registrierungen {{signups}} · zahlend {{paying}} · Umsatz {{revenue}} · Kosten/Registrierung {{cps}}",
          pageHint: "Seite {{page}}/{{pages}} - weiter mit --page={{next}}",
          noContacts: "Keine passenden Kontakte.",
          noDeals: "Keine bezahlten Deals erfasst.",
        },
      },
    },
  },
  contact: {
    post: {
      title: "Outreach-Kontakt erfassen",
      titleShort: "Kontakt erfassen",
      description:
        "Kontakt per E-Mail anlegen oder aktualisieren. Mit Betreff wird die gerade gesendete (oder erhaltene) E-Mail mitprotokolliert.",
      fields: {
        email: {
          label: "E-Mail",
          description: "E-Mail des Kontakts. Groß-/Kleinschreibung egal",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "Name",
          description: "Creator, Medium oder Person",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "Art",
          description: "Creator, Newsletter, Verzeichnis oder Sonstige",
        },
        url: {
          label: "URL",
          description: "Kanal, Website oder Newsletter-Seite",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "Ansatz",
          description: "Pitch-Ansatz, z. B. A-affiliate, B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "Status",
          description:
            "Geht nur vorwärts (gesendet → geantwortet → interessiert → Deal). Ausstiege gelten immer",
        },
        forceStatus: {
          label: "Status erzwingen",
          description: "Status exakt setzen, auch rückwärts",
        },
        notes: {
          label: "Notizen",
          description: "Ersetzt die Notizen des Kontakts",
          placeholder: "Preisliste 550 $ Integration, 20-150K Aufrufe",
        },
        refCode: {
          label: "Ref-Code",
          description: "Empfehlungscode für diesen Kontakt",
          placeholder: "moemoe",
        },
        channel: {
          label: "Kanal",
          description: "Growth-Kanalschlüssel, z. B. youtube, newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "Kampagnenlink-ID",
          description:
            "utm_id ihres Tracking-Links. Unbekannte IDs werden verworfen",
        },
        subject: {
          label: "E-Mail-Betreff",
          description: "Gesetzt = diese E-Mail wird protokolliert",
          placeholder: "Deine Zuschauer wollen das längst",
        },
        direction: {
          label: "Richtung",
          description: "Von uns gesendet (Standard) oder Antwort von ihnen",
        },
        at: {
          label: "Gesendet am",
          description: "Versandzeitpunkt. Standard: jetzt",
        },
        touchNote: {
          label: "Notiz zur E-Mail",
          description: "Was die E-Mail gesagt oder gefragt hat",
          placeholder: "Preisliste angefragt",
        },
      },
      response: {
        id: "Kontakt-ID",
        created: "Neu angelegt",
        status: "Status",
        previousStatus: "Vorheriger Status",
        touchLogged: "E-Mail protokolliert",
        contactCount: "Gesendete E-Mails",
        warning: "Warnung",
      },
      widget: {
        back: "Zurück",
        hint: "Ein Aufruf pro gesendeter E-Mail. Gleiche Adresse, gleicher Kontakt.",
        touchSection: "Diese E-Mail",
        contactSection: "Kontakt",
        submit: "Kontakt speichern",
        warnOptOut:
          "Dieser Kontakt hat sich abgemeldet. Nicht mehr anschreiben.",
        warnBounced:
          "Diese Adresse war schon unzustellbar. Vor dem Senden prüfen.",
        saved: "{{status}} · gesendete E-Mails: {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "Outreach-Deal speichern",
      titleShort: "Deal speichern",
      description:
        "Bezahlten Deal für einen Kontakt anlegen oder per ID aktualisieren. Kampagnenlink, utm_campaign oder Ref-Code anhängen, um ihn zu messen.",
      fields: {
        id: {
          label: "Deal-ID",
          description: "Gesetzt = bestehenden Deal aktualisieren",
        },
        contactEmail: {
          label: "Kontakt-E-Mail",
          description: "Pflicht für neue Deals. Legt den Kontakt bei Bedarf an",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "Kontaktname",
          description: "Nur genutzt, wenn der Kontakt noch nicht existiert",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "Leistung",
          description: "Wofür das Geld fließt",
          placeholder: "YouTube-Integration",
        },
        amount: {
          label: "Betrag",
          description: "Gesamtpreis in Währungseinheiten",
        },
        currency: {
          label: "Währung",
          description: "Währung des Betrags",
        },
        status: {
          label: "Status",
          description: "Angeboten, zugesagt, bezahlt oder storniert",
        },
        channel: {
          label: "Kanal",
          description: "Growth-Kanalschlüssel, wie bei Kanalausgaben",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "Kampagnenlink-ID",
          description:
            "utm_id des Tracking-Links. Bleibt leer, wenn der Link auf dieser Instanz fehlt",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "Kampagnenwert im Tracking-Link",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "Ref-Code",
          description: "Empfehlungscode, den der Creator teilt",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "Geht live",
          description: "Veröffentlichungsdatum. Umsatz zählt ab hier",
        },
        paidAt: {
          label: "Bezahlt am",
          description: "Standard: jetzt, sobald der Status bezahlt ist",
        },
        notes: {
          label: "Notizen",
          description: "Zahlungsweg, Rechnung, Konditionen",
          placeholder: "Payoneer, Ref. 1059964703",
        },
      },
      response: {
        id: "Deal-ID",
        created: "Neu angelegt",
        status: "Status",
        linkFound: "Kampagnenlink gefunden",
      },
      widget: {
        back: "Zurück",
        hint: "Zugesagte oder bezahlte Deals setzen den Kontakt auf Deal.",
        submit: "Deal speichern",
      },
    },
  },
  import: {
    post: {
      title: "Outreach-Log importieren",
      titleShort: "Log importieren",
      description:
        "Liest ein Sendelog (tabgetrennte Zeilen oder Markdown-Tabellen) in Kontakte und E-Mails ein. Beliebig oft ausführbar: Bekannte E-Mails werden übersprungen.",
      fields: {
        content: {
          label: "Log-Inhalt",
          description:
            "sent-log-Zeilen oder sent-log.md-Tabellen einfügen. Funktioniert auch gegen Remote-Instanzen",
          placeholder:
            "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut\tSENT",
        },
        filePaths: {
          label: "Server-Dateien",
          description:
            "Kommagetrennte Pfade unter .tmp/ auf dem Server, z. B. .tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "Adressen ignorieren",
          description: "Kommagetrennte Adressen, die kein Outreach sind",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "Probelauf",
          description: "Nur auswerten und zählen, nichts schreiben",
        },
      },
      response: {
        rowsParsed: "Zeilen gelesen",
        contactsCreated: "Kontakte neu",
        contactsUpdated: "Kontakte aktualisiert",
        touchesAdded: "E-Mails neu",
        touchesDuplicate: "Schon bekannt",
        statusChanges: "Statuswechsel",
        skipped: "Übersprungene Zeilen",
        skippedLines: "Details zu Übersprungenem",
      },
      widget: {
        back: "Zurück",
        hint: "Log einfügen oder Server-Dateien angeben. Jede E-Mail wird nur einmal gespeichert, egal wie oft du importierst.",
        submit: "Importieren",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "keine gültige E-Mail",
    noDate: "kein gültiges Datum",
    skippedStatus: "als SKIPPED markiert",
    ignored: "ignorierte Adresse",
    columns: "zu wenige Spalten",
    unreadable: "Datei nicht lesbar",
    outsideTmp: "Pfad außerhalb von .tmp/",
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Markierte Felder prüfen",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Als Admin anmelden",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Outreach-Werkzeuge brauchen die Admin-Rolle",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Diesen Eintrag gibt es nicht",
    },
    conflict: {
      title: "Konflikt",
      description: "Eintrag wurde zwischenzeitlich geändert, neu laden",
    },
    server: {
      title: "Serverfehler",
      description: "Anfrage konnte nicht abgeschlossen werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Änderungen erst speichern oder verwerfen",
    },
    dealNotFound: "Kein Deal mit ID {{id}}",
    dealNeedsContact: "Ein neuer Deal braucht eine Kontakt-E-Mail",
    dealNeedsFields: "Ein neuer Deal braucht Leistung und Betrag",
    importEmpty: "Log-Inhalt oder mindestens eine Server-Datei angeben",
  },
  success: {
    title: "Erledigt",
    description: "Gespeichert",
  },
};

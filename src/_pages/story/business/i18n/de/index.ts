import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Buchhaltung, CRM und KI selbst gehostet | {{appName}}",
    description:
      "Doppelte Buchführung, Rechnungen, Einkauf, Lager, Kasse, CRM und Newsletter in einer Open-Source-App. Läuft auf deinem Server. Jede Funktion ist ein Werkzeug für deine KI.",
    category: "Business",
    imageAlt: "{{appName}} selbst gehostet: Buchhaltung, CRM und KI",
    keywords:
      "Buchhaltungssoftware selbst hosten, Open-Source-ERP, Open-Source-Buchhaltung, doppelte Buchführung, Rechnungssoftware, KI-Buchhaltung, CRM selbst hosten, SKR03, {{appName}}",
  },
  hero: {
    badge: "Open-Source-Unternehmenssoftware",
    title: "Deine Buchhaltung. Dein Server.",
    titleHighlight: "KI inklusive.",
    subtitle:
      "Doppelte Buchführung, Rechnungen, Einkauf, Lager, Kasse, CRM und Newsletter in einer Open-Source-App. Sie läuft auf deinem Server. Jede Funktion ist ein Werkzeug, das deine KI bedienen kann.",
    ctaStart: "Selbst betreiben",
    ctaGithub: "Auf GitHub ansehen",
    shotAlt: "Summen- und Saldenliste einer Demo-Firma: Soll gleich Haben",
    stats: {
      actions: "Aktionen, die deine KI ausführen kann",
      reports: "Berichte, live aus dem Hauptbuch",
      charts: "Kontenrahmen: SKR03, ÖKR, SK, IFRS",
      languages: "Sprachen eingebaut",
    },
  },
  trialBalance: {
    sample: "Konten (Auszug) · {{date}} · EUR",
    account: "Konto",
    debit: "Soll",
    credit: "Haben",
    bank: "Bank",
    sales: "Umsatz",
    wages: "Löhne",
    total: "Gesamtsumme",
    open: "Vollständigen Bericht ansehen",
  },
  ledger: {
    eyebrow: "Buchhaltung",
    title: "Jede Buchung im Gleichgewicht.",
    intro:
      "Rechnungen, Eingangsrechnungen, Zahlungen und Kassenverkäufe landen von selbst im Hauptbuch, inklusive Fremdwährungsbuchungen mit täglichen EZB-Kursen, realisierten Kursdifferenzen und Stichtagsbewertung. Soll gleich Haben, sonst wird nichts gebucht.",
    points: {
      balanced: {
        title: "Ausgeglichen oder abgelehnt",
        body: "Jeder Buchungssatz braucht mindestens zwei Zeilen und exakten Ausgleich. Geprüft beim Anlegen, Buchen und Stornieren.",
      },
      final: {
        title: "Gebucht ist gebucht",
        body: "Kein stilles Ändern. Fehler korrigiert eine Stornobuchung, die das Original spiegelt und darauf verweist.",
      },
      periods: {
        title: "Perioden, die schließen",
        body: "Buchungen müssen in einer offenen Periode liegen. Abschluss nur ohne offene Entwürfe, mit Protokoll, wer abgeschlossen hat.",
      },
      templates: {
        title: "Start mit deinem Land",
        body: "Deutschland (SKR03), Österreich (ÖKR) oder Slowakei (SK): Steuersätze, Kasse und Bankkonto kommen gleich mit. Überall sonst: ein allgemeiner IFRS-Kontenrahmen, die Sätze legst du an.",
      },
    },
    reportsLabel: "Berichte, live aus dem Hauptbuch",
    reports: {
      balanceSheet: "Bilanz",
      profitLoss: "Gewinn- und Verlustrechnung",
      trialBalance: "Summen- und Saldenliste",
      aging: "Offene Posten nach Fälligkeit",
      vat: "Umsatzsteuerbericht",
      payablesAging: "Verbindlichkeiten nach Fälligkeit",
      journalExport: "Journal-Export als CSV",
      taxFilings:
        "Steuermeldungen je Land (DE UStVA/EÜR, AT UVA, SK DPH/KV, allgemeine USt)",
    },
    shotAlt:
      "Eingangsrechnungen mit Status und Beträgen im Admin von {{appName}}",
  },
  flows: {
    eyebrow: "Geld rein, Geld raus",
    title: "Vom Angebot ins Hauptbuch. Ohne Abtippen.",
    intro:
      "Jedes Dokument wird mit einer Aktion zum nächsten. Die Buchung passiert unterwegs.",
    posted: "Im Hauptbuch gebucht",
    sales: {
      title: "Verkauf",
      steps: {
        estimate: "Angebot",
        invoice: "Rechnung",
        payment: "Zahlung erfasst",
      },
      note: "Gutschriften, gebrandete PDFs mit ZUGFeRD und Zahlungs-QR-Code, E-Mail-Versand mit Protokoll, wiederkehrende Rechnungen und Online-Zahllinks über Stripe.",
    },
    purchasing: {
      title: "Einkauf",
      steps: {
        order: "Bestellung",
        receipt: "Wareneingang",
        bill: "Eingangsrechnung",
        payment: "Bezahlt",
      },
      note: "Lieferanten mit Standard-Steuersatz. Teillieferungen pro Position erfasst. Wareneingänge buchen den Bestand ins Lager.",
    },
    pos: {
      title: "Kasse",
      steps: {
        session: "Kasse öffnen",
        order: "Kassieren",
        payment: "Bar, Karte oder Überweisung",
      },
      note: "Verkäufe und Erstattungen buchen den Bestand direkt im Lager der Kasse samt Wareneinsatz (COGS) und konfigurierbarer Minusbestandsregel. Beim Abschluss wird das Bargeld gezählt.",
    },
    inventory: {
      title: "Lager",
      body: "Lagerorte, Zugänge, Abgänge und Korrekturen, Umlagerungen zwischen Standorten. Jede Bewegung landet in einem unveränderlichen Protokoll, samt Urheber.",
    },
  },
  suite: {
    eyebrow: "Rund um die Bücher",
    title: "Der Rest der Firma. Gleiche App.",
    intro:
      "Ein Login, eine Datenbank, ein Admin. Kein Abgleich zwischen fünf Abos.",
    aiLabel: "Jedes Modell",
    toolCount: "{{count}} Aktionen",
    cards: {
      crm: {
        title: "CRM und Leads",
        body: "Kontakte per CSV importieren, Deals und Akquise verfolgen, jederzeit exportieren.",
      },
      newsletter: {
        title: "Newsletter und Kampagnen",
        body: "Double-Opt-in, Abmeldung mit einem Klick, Bounce-Verarbeitung, E-Mail-Strecken.",
      },
      messaging: {
        title: "Posteingang und Nachrichten",
        body: "Dein Postfach über IMAP und SMTP, dazu SMS, Telegram und WhatsApp Business.",
      },
      payments: {
        title: "Abo-Abrechnung",
        body: "Checkout über Stripe und Krypto, Webhooks und Erstattungen für Abo-Tarife.",
      },
      team: {
        title: "Firmen und Rollen",
        body: "Mehrere Firmen in einer Instanz. Lade dein Team als Inhaber, Admin, Buchhalter, Mitglied oder Leser ein.",
      },
      ai: {
        title: "Agenten nach Zeitplan",
        body: "Agenten erledigen Berichte und Prüfungen nach Zeitplan. Mit deinem {{appName}}-Konto oder eigenem Anbieterschlüssel.",
      },
    },
  },
  ai: {
    eyebrow: "KI, die mitarbeitet",
    title: "Frag deine Bücher. Antworten statt Diagramme.",
    intro:
      "Jede Buchhaltungsaktion ist ein typisiertes Werkzeug. Deine KI ruft denselben Code auf wie die Buttons im Admin, mit denselben Prüfungen.",
    points: {
      chat: "Frag in normalen Worten. Das Modell führt den Bericht aus und erklärt ihn.",
      cli: "Monatsabschluss per Skript aus dem Terminal. Jedes Werkzeug ist ein CLI-Befehl.",
      mcp: "Claude Code, Cursor und Codex erreichen dieselben Werkzeuge über MCP.",
      permissions:
        "Agenten handeln als der Nutzer, der sie startet. Gleiche Firmenrolle, gleiche Prüfungen.",
    },
    demo: {
      label: "Beispiel",
      question: "Wer schuldet uns Geld, und wie lange schon?",
      tool: "Offene Posten nach Fälligkeit",
      answer:
        "Drei Kunden sind überfällig, zusammen 4.180 EUR. Der größte Posten, 2.380 EUR, ist 47 Tage drüber. Soll ich die Rechnungsnummern auflisten?",
    },
    tabs: {
      cli: "CLI",
      mcp: "MCP",
    },
  },
  compare: {
    eyebrow: "Der Unterschied",
    title: "Typische Buchhaltungs-SaaS gegen deinen eigenen Server.",
    intro:
      "Gehostete Tools sind bequem. Das gibst du dafür ab, und hier sind sie noch vorn.",
    colSaas: "Typische Buchhaltungs-SaaS",
    colUs: "{{appName}}, selbst gehostet",
    colSaasShort: "SaaS",
    colUsShort: "Selbst gehostet",
    rows: {
      data: {
        label: "Wo deine Bücher liegen",
        saas: "In deren Cloud, zu deren Bedingungen",
        us: "Auf deinem Server, in deinem Postgres",
      },
      seats: {
        label: "Preis pro Nutzer",
        saas: "Monatsgebühr pro Platz",
        us: "Keine Platzgebühren. Du zahlst Hosting und die KI, die du nutzt.",
      },
      ai: {
        label: "KI",
        saas: "Als Zusatzpaket oder gar nicht",
        us: "Jede Funktion ist ein KI-Werkzeug, mit jedem Modell",
      },
      code: {
        label: "Quellcode",
        saas: "Geschlossen",
        us: "Offen auf GitHub",
      },
      missing: {
        label: "Eine Funktion fehlt",
        saas: "Auf die Roadmap warten",
        us: "Selbst bauen: eine Definitionsdatei",
      },
      exit: {
        label: "Wechsel",
        saas: "Export, so weit erlaubt",
        us: "Es ist schon deine Datenbank",
      },
      filings: {
        label: "Bankanbindung und Steuermeldung",
        saas: "Oft eingebaut",
        us: "Eingebaut: Bank-Feeds (Enable Banking), Kontoauszug-Import (CAMT.053, MT940, CSV) und Abgleich, dazu DE UStVA/EÜR, AT UVA, SK DPH/KV und allgemeine USt-Exporte.",
      },
      hosting: {
        label: "Betrieb",
        saas: "Wird für dich erledigt",
        us: "Du betreibst es. Wir helfen auf Anfrage.",
      },
    },
  },
  start: {
    eyebrow: "Einrichtung",
    title: "Drei Befehle. Dann deine Firma anlegen.",
    intro:
      "Klonen, installieren, starten. Der Einrichtungsassistent erledigt Admin-Login und KI. Dann legst du im Admin deine Firma an. Deutschland, Österreich oder Slowakei: Kontenrahmen, Steuersätze, Kasse und Bankkonto in einem Schritt. Überall sonst: ein allgemeiner IFRS-Kontenrahmen als Basis.",
    terminalTitle: "Instanz starten",
    guide: "Komplette Self-Hosting-Anleitung",
    developers: "Eigene Module bauen",
  },
  code: {
    copy: "Kopieren",
    copied: "Kopiert",
    wrap: "Zeilen umbrechen",
  },
  help: {
    title: "Du ziehst eine Firma um?",
    description:
      "Hilfe bei der Einrichtung, Datenübernahme, eigene Module. Jede Nachricht liest ein Mensch.",
  },
};

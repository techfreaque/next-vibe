import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 Minute",
      "3m": "3 Minuten",
      "5m": "5 Minuten",
      "15m": "15 Minuten",
      "30m": "30 Minuten",
      "1h": "1 Stunde",
      "4h": "4 Stunden",
      "1d": "1 Tag",
      "1w": "1 Woche",
      "1M": "1 Monat",
    },
    runStatus: {
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
    },
    backtestActionMode: {
      simulate: "Simulieren",
      execute: "Ausführen",
    },
    graphOwnerType: {
      system: "System",
      admin: "Admin",
      user: "Benutzer",
    },
    triggerType: {
      manual: "Manuell",
      cron: "Geplant",
    },
  },
  fields: {
    source: { label: "Quelle", description: "Eingabe-Zeitreihe" },
    resolution: { label: "Auflösung", description: "Berechnungszeitraum" },
    range: { label: "Bereich", description: "Zu berechnender Zeitraum" },
    lookback: {
      label: "Rückblick",
      description: "Zusätzliche Balken vor dem Bereichsstart",
    },
    result: { label: "Ergebnis", description: "Ausgabe-Zeitreihe" },
    meta: { label: "Meta", description: "Knoten-Ausführungsmetadaten" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytics",
    pipeline: "pipeline",
  },
  graphs: {
    list: {
      title: "Pipeline-Graphen",
      description:
        "Alle für den aktuellen Benutzer sichtbaren Graphen auflisten",
      container: { title: "Graphen", description: "Alle Pipeline-Graphen" },
      response: { graphs: "Graphen" },
      success: {
        title: "Graphen geladen",
        description: "Pipeline-Graphen erfolgreich abgerufen",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Graphen konnten nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Anfrage",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Graphen gefunden",
        },
        conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    create: {
      title: "Graph erstellen",
      description: "Einen neuen Pipeline-Graphen erstellen",
      fields: {
        name: {
          label: "Name",
          description: "Anzeigename des Graphen",
          placeholder: "Mein Graph",
        },
        slug: {
          label: "Slug",
          description: "Eindeutiger Bezeichner",
          placeholder: "mein-graph",
        },
        description: {
          label: "Beschreibung",
          description: "Optionale Beschreibung",
          placeholder: "",
        },
        config: {
          label: "Konfiguration",
          description: "Graph DAG-Konfiguration",
        },
      },
      response: { id: "Graph-ID" },
      success: {
        title: "Graph erstellt",
        description: "Pipeline-Graph erfolgreich erstellt",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Graph konnte nicht erstellt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Graph-Konfiguration",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Graph-Slug existiert bereits",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    get: {
      title: "Graph abrufen",
      description: "Einen bestimmten Graphen nach ID abrufen",
      fields: {
        id: { label: "Graph-ID", description: "UUID der Graph-Version" },
      },
      response: { graph: "Graph" },
      success: {
        title: "Graph geladen",
        description: "Graph erfolgreich abgerufen",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        server: {
          title: "Serverfehler",
          description: "Graph konnte nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige ID",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Graph nicht gefunden",
        },
        conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    edit: {
      title: "Graph bearbeiten",
      description:
        "Graph verzweigen und bearbeiten (erstellt neue Version, mutiert nie)",
      fields: {
        id: {
          label: "Graph-ID",
          description: "UUID der Version zum Verzweigen",
        },
        config: {
          label: "Konfiguration",
          description: "Aktualisierte Graph-Konfiguration",
        },
        name: { label: "Name", description: "Aktualisierter Name" },
        description: {
          label: "Beschreibung",
          description: "Aktualisierte Beschreibung",
        },
      },
      response: { id: "Neue Versions-ID" },
      success: {
        title: "Graph verzweigt",
        description: "Neue Graph-Version erfolgreich erstellt",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        server: {
          title: "Serverfehler",
          description: "Graph konnte nicht bearbeitet werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Konfiguration",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Graph nicht gefunden",
        },
        conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    promote: {
      title: "Zu System befördern",
      description: "Einen Admin-Graphen zu system-eigentümer befördern",
      fields: {
        id: {
          label: "Graph-ID",
          description: "UUID des zu befördernden Graphen",
        },
      },
      response: { id: "Graph-ID" },
      success: {
        title: "Graph befördert",
        description: "Graph erfolgreich zum System befördert",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Beförderung fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige ID",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Graph nicht gefunden",
        },
        conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    trigger: {
      title: "Graph auslösen",
      description: "Graph-Ausführung manuell auslösen",
      fields: {
        id: {
          label: "Graph-ID",
          description: "UUID des auszulösenden Graphen",
        },
        rangeFrom: { label: "Von", description: "Bereichsstart (ISO-Datum)" },
        rangeTo: { label: "Bis", description: "Bereichsende (ISO-Datum)" },
      },
      response: {
        nodeCount: "Ausgeführte Knoten",
        errorCount: "Fehler",
        errors: "Fehler",
      },
      success: {
        title: "Graph ausgeführt",
        description: "Graph erfolgreich ausgeführt",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Graph-Ausführung fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Parameter",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Graph nicht gefunden",
        },
        conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    backtest: {
      title: "Backtest durchführen",
      description:
        "Backtest über historischen Bereich durchführen (Aktionen simuliert)",
      fields: {
        id: { label: "Graph-ID", description: "UUID der Graph-Version" },
        rangeFrom: { label: "Von", description: "Backtest-Bereichsstart" },
        rangeTo: { label: "Bis", description: "Backtest-Bereichsende" },
        resolution: {
          label: "Auflösung",
          description: "Zeitrahmen für die Auswertung",
        },
      },
      response: {
        runId: "Lauf-ID",
        eligible: "Geeignet",
        ineligibleNodes: "Ungeeignete Knoten",
      },
      success: {
        title: "Backtest abgeschlossen",
        description: "Backtest erfolgreich durchgeführt",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Backtest fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Parameter",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Graph nicht gefunden",
        },
        conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    data: {
      title: "Graph-Daten",
      description: "Zeitreihendaten für einen Graphen abrufen",
      fields: {
        id: { label: "Graph-ID", description: "UUID des Graphen" },
        rangeFrom: { label: "Von", description: "Bereichsstart" },
        rangeTo: { label: "Bis", description: "Bereichsende" },
      },
      response: { series: "Serien", signals: "Signale" },
      success: {
        title: "Daten geladen",
        description: "Graph-Daten erfolgreich abgerufen",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        server: {
          title: "Serverfehler",
          description: "Daten konnten nicht abgerufen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Parameter",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Graph nicht gefunden",
        },
        conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
  },
  indicators: {
    ema: {
      description: "Exponentieller gleitender Durchschnitt",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "EMA" } },
      params: {
        period: {
          label: "Periode",
          description: "Anzahl der Perioden (1–500)",
        },
      },
    },
    rsi: {
      description: "Relativer Stärke-Index - Momentum-Oszillator (0–100)",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "RSI" } },
      params: {
        period: { label: "Periode", description: "Rückblickperioden (2–100)" },
      },
    },
    bollinger: {
      description:
        "Bollinger-Bänder - Volatilitätshülle um einen gleitenden Durchschnitt",
      input: { source: { label: "Quelle" } },
      output: {
        upper: { label: "Oberes Band" },
        middle: { label: "Mittleres Band" },
        lower: { label: "Unteres Band" },
      },
      params: {
        period: {
          label: "Periode",
          description: "Periode des gleitenden Durchschnitts",
        },
        stdDev: {
          label: "Std. Abw.",
          description: "Standardabweichungs-Multiplikator",
        },
      },
    },
    macd: {
      description: "MACD - trendfolgendes Momentum-Indikator",
      input: { source: { label: "Quelle" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "Signal" },
        histogram: { label: "Histogramm" },
      },
      params: {
        fastPeriod: {
          label: "Schnelle Periode",
          description: "Schnelle EMA-Periode",
        },
        slowPeriod: {
          label: "Langsame Periode",
          description: "Langsame EMA-Periode",
        },
        signalPeriod: {
          label: "Signalperiode",
          description: "Signal-EMA-Periode",
        },
      },
    },
    ratio: {
      description: "A / B pro Zeitstempel berechnen",
      input: { a: { label: "Zähler" }, b: { label: "Nenner" } },
      output: { value: { label: "Verhältnis" } },
    },
    delta: {
      description: "Periode-über-Periode-Änderung",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Werte auf [min, max] begrenzen",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Begrenzt" } },
      params: {
        min: { label: "Min", description: "Untere Grenze" },
        max: { label: "Max", description: "Obere Grenze" },
      },
    },
    windowAvg: {
      description: "Rollender Durchschnitt über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Durchschn." } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
    windowSum: {
      description: "Rollende Summe über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Summe" } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
    windowMin: {
      description: "Rollendes Minimum über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
    windowMax: {
      description: "Rollendes Maximum über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
  },

  dataSources: {
    leadsCreated: {
      description: "Anzahl neuer Leads pro Minute",
      output: { value: { label: "Neue Leads" } },
    },
    leadsConverted: {
      description: "Anzahl konvertierter Leads pro Minute",
      output: { value: { label: "Konvertierte Leads" } },
    },
    leadsActive: {
      description: "Gesamtzahl aktiver Leads (Snapshot pro Tag)",
      output: { value: { label: "Aktive Leads" } },
    },
    leadsBounced: {
      description: "Anzahl der E-Mail-Bounces pro Minute",
      output: { value: { label: "Gebouncte Leads" } },
    },
    leadsEngagements: {
      description: "Gesamte Engagement-Events (Öffnungen + Klicks) pro Minute",
      output: { value: { label: "Lead-Engagements" } },
    },
    leadsEmailsSent: {
      description: "Anzahl versendeter Kampagnen-E-Mails pro Minute",
      output: { value: { label: "Versendete E-Mails" } },
    },
    leadsUnsubscribed: {
      description: "Anzahl abgemeldeter Leads pro Minute",
      output: { value: { label: "Abgemeldete Leads" } },
    },
    leadsEmailOpens: {
      description: "Anzahl getrackter E-Mail-Öffnungen pro Minute",
      output: { value: { label: "E-Mail-Öffnungen" } },
    },
    leadsEmailClicks: {
      description: "Anzahl getrackter E-Mail-Link-Klicks pro Minute",
      output: { value: { label: "E-Mail-Klicks" } },
    },
    leadsNewsletterSubscribers: {
      description:
        "Gesamtzahl Leads mit bestätigtem Newsletter-Abo (Snapshot pro Tag)",
      output: { value: { label: "Newsletter-Abonnenten" } },
    },
    leadsWebsiteUsers: {
      description:
        "Gesamtzahl Leads mit Website-Nutzerstatus (Snapshot pro Tag)",
      output: { value: { label: "Website-Nutzer" } },
    },
    leadsCampaignRunning: {
      description:
        "Gesamtzahl Leads in aktiver E-Mail-Kampagne (Snapshot pro Tag)",
      output: { value: { label: "In Kampagne" } },
    },
    leadsInContact: {
      description: "Gesamtzahl Leads im Kontaktstatus (Snapshot pro Tag)",
      output: { value: { label: "In Kontakt" } },
    },
    leadsWebsiteVisits: {
      description: "Anzahl Website-Besuchs-Events pro Minute",
      output: { value: { label: "Website-Besuche" } },
    },
    leadsFormSubmits: {
      description: "Anzahl Formular-Einsendungs-Events pro Minute",
      output: { value: { label: "Formular-Einsendungen" } },
    },
    usersRegistered: {
      description: "Anzahl neuer Nutzerregistrierungen pro Minute",
      output: { value: { label: "Registrierte Nutzer" } },
    },
    usersActiveTotal: {
      description: "Gesamtzahl aktiver verifizierter Nutzer (Snapshot pro Tag)",
      output: { value: { label: "Aktive Nutzer" } },
    },
    usersBanned: {
      description: "Anzahl gesperrter Nutzer pro Minute (näherungsweise)",
      output: { value: { label: "Gesperrte Nutzer" } },
    },
    usersEmailVerified: {
      description:
        "Gesamtzahl Nutzer mit verifizierter E-Mail (Snapshot pro Tag)",
      output: { value: { label: "E-Mail verifiziert" } },
    },
    usersMarketingConsent: {
      description:
        "Gesamtzahl Nutzer mit Marketing-Einwilligung (Snapshot pro Tag)",
      output: { value: { label: "Marketing-Einwilligung" } },
    },
    usersWithStripe: {
      description: "Gesamtzahl Nutzer mit Stripe-Konto (Snapshot pro Tag)",
      output: { value: { label: "Stripe-Nutzer" } },
    },
    usersTwoFaEnabled: {
      description: "Gesamtzahl Nutzer mit aktivierter 2FA (Snapshot pro Tag)",
      output: { value: { label: "2FA aktiviert" } },
    },
    usersLoginAttemptsTotal: {
      description: "Gesamte Anmeldeversuche pro Minute",
      output: { value: { label: "Anmeldeversuche" } },
    },
    usersLoginAttemptsFailed: {
      description: "Fehlgeschlagene Anmeldeversuche pro Minute",
      output: { value: { label: "Fehlgeschlagene Anmeldungen" } },
    },
    creditsSpentTotal: {
      description: "Gesamte ausgegebene Credits pro Minute",
      output: { value: { label: "Ausgegebene Credits" } },
    },
    creditsSpentByUsers: {
      description: "Von Nutzern ausgegebene Credits pro Minute",
      output: { value: { label: "Credits (Nutzer)" } },
    },
    creditsSpentByLeads: {
      description: "Von Leads ausgegebene Gratis-Credits pro Minute",
      output: { value: { label: "Credits (Leads)" } },
    },
    creditsPurchased: {
      description: "Gekaufte oder per Abo hinzugefügte Credits pro Minute",
      output: { value: { label: "Gekaufte Credits" } },
    },
    creditsFreeGrants: {
      description: "Gratis-Credits für Leads pro Minute",
      output: { value: { label: "Gratis-Credits" } },
    },
    creditsEarned: {
      description: "Per Empfehlung verdiente Credits pro Minute",
      output: { value: { label: "Verdiente Credits" } },
    },
    creditsExpired: {
      description: "Abgelaufene Credits pro Minute",
      output: { value: { label: "Abgelaufene Credits" } },
    },
    creditsRefunded: {
      description: "Erstattete Credits pro Minute",
      output: { value: { label: "Erstattete Credits" } },
    },
    creditsBalanceTotal: {
      description: "Gesamtguthaben aller Nutzer-Wallets (Snapshot pro Tag)",
      output: { value: { label: "Gesamtguthaben" } },
    },
    creditsSubscriptionRevenue: {
      description: "Credits aus Abo-Paketen pro Minute",
      output: { value: { label: "Abo-Einnahmen" } },
    },
    creditsTransferVolume: {
      description: "Kreditübertragungsvolumen zwischen Wallets pro Minute",
      output: { value: { label: "Übertragungsvolumen" } },
    },
    creditsFreePoolUtilization: {
      description:
        "Prozentualer Verbrauch des Gratis-Kredit-Pools (Snapshot pro Tag)",
      output: { value: { label: "Gratis-Pool-Auslastung" } },
    },
  },

  evaluators: {
    threshold: {
      description:
        "Löst aus, wenn ein Reihenwert einen Vergleich mit einer Konstante erfüllt",
      input: {
        series: { label: "Reihe" },
      },
      output: {
        signal: { label: "Signal" },
      },
      params: {
        op: {
          label: "Operator",
          description: "Vergleichsoperator",
        },
        value: {
          label: "Wert",
          description: "Konstante zum Vergleichen",
        },
      },
    },
    and: {
      description:
        "Löst aus, wenn alle Eingangssignale zum gleichen Zeitpunkt feuern",
      input: { signals: { label: "Signale" } },
      output: { signal: { label: "Signal" } },
    },
    or: {
      description:
        "Löst aus, wenn eines der Eingangssignale zu einem Zeitpunkt feuert",
      input: { signals: { label: "Signale" } },
      output: { signal: { label: "Signal" } },
    },
    not: {
      description: "Invertiert einen Signalstrom",
      input: { signal: { label: "Signal" } },
      output: { signal: { label: "Invertiert" } },
    },
    crossover: {
      description: "Löst aus, wenn Reihe A Reihe B von unten kreuzt",
      input: {
        seriesA: { label: "Reihe A" },
        seriesB: { label: "Reihe B" },
      },
      output: { signal: { label: "Signal" } },
    },
    script: {
      description:
        "Sandboxierter benutzerdefinierter Evaluator - erhält Eingangsreihen, gibt Signalereignisse zurück",
      input: { inputs: { label: "Eingaben" } },
      output: { signal: { label: "Signal" } },
      params: {
        fn: {
          label: "Funktion",
          description:
            "JS-Funktionskörper, der Eingangsreihenarrays empfängt und Signalereignisse zurückgibt",
        },
      },
    },
  },

  transformers: {
    merge: {
      description: "Zwei Reihen zu passenden Zeitstempeln summieren",
      input: {
        a: { label: "Reihe A" },
        b: { label: "Reihe B" },
      },
      output: { value: { label: "Zusammengeführt" } },
    },
    ratio: {
      description: "A / B pro Zeitstempel berechnen",
      input: {
        a: { label: "Zähler" },
        b: { label: "Nenner" },
      },
      output: { value: { label: "Verhältnis" } },
    },
    delta: {
      description: "Periode-über-Periode-Änderung",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Werte auf [min, max] begrenzen",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Begrenzt" } },
      params: {
        min: { label: "Min", description: "Untere Grenze" },
        max: { label: "Max", description: "Obere Grenze" },
      },
    },
    windowAvg: {
      description: "Rollender Durchschnitt über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Durchschn." } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
    windowSum: {
      description: "Rollende Summe über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Summe" } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
    windowMin: {
      description: "Rollendes Minimum über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Min" } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
    windowMax: {
      description: "Rollendes Maximum über N Perioden",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Max" } },
      params: {
        size: { label: "Fenster", description: "Anzahl der Perioden (1–500)" },
      },
    },
    fieldPick: {
      description:
        "Ein benanntes Feld aus einer mehrwertigen Reihe extrahieren",
      input: { source: { label: "Mehrwertig" } },
      output: { value: { label: "Feld" } },
      params: {
        field: {
          label: "Feldname",
          description: "Name des zu extrahierenden Feldes",
        },
      },
    },
    jsonPath: {
      description:
        "Einen Wert über Punktnotationspfad aus DataPoint-Meta extrahieren",
      input: { source: { label: "Quelle" } },
      output: { value: { label: "Wert" } },
      params: {
        path: {
          label: "Pfad",
          description: "Punktnotationspfad, z. B. data.stats.total",
        },
      },
    },
    script: {
      description: "Benutzerdefinierte Sandbox-Skript-Transformation",
      input: { inputs: { label: "Eingaben" } },
      output: { value: { label: "Ergebnis" } },
      params: {
        fn: {
          label: "Funktion",
          description:
            "JS-Pfeilfunktion, die Eingangsreihenarrays empfängt und DataPoint[] zurückgibt",
        },
      },
    },
  },

  cleanup: {
    post: {
      title: "Vibe Sense Bereinigung",
      description: "Aufbewahrungsbereinigung für Datenpunkte durchführen",
      success: {
        title: "Bereinigung abgeschlossen",
        description: "Aufbewahrungsbereinigung abgeschlossen",
      },
      response: {
        nodesProcessed: "Verarbeitete Knoten",
        totalDeleted: "Gelöschte Zeilen",
        snapshotsDeleted: "Gelöschte Snapshots",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Admin-Zugriff erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Bereinigung fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Anfrage",
        },
        notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
        conflict: { title: "Konflikt", description: "Konflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkanfrage fehlgeschlagen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen zuerst speichern",
        },
      },
    },
    name: "Vibe Sense Bereinigung",
    description: "Alte Datenpunkte löschen und Snapshot-Cache ablaufen lassen",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  profit: {
    run: "Bericht anzeigen",
    unallocatedRevenue: "Gebuchte Erlöse ohne Modellzuordnung: {{amount}}",
    estimatedCosts: "Geschätzte Modellkosten: {{amount}}",
    usageValue: "Bezahlte Nutzung zu bestätigten Kaufpreisen: {{amount}}",
    estimatedMargin: "Geschätzte Nutzungsmarge: {{amount}}",
    marginUnknown:
      "Marge nicht verfügbar. Angaben zur Finanzierung oder zum Nutzungswert fehlen.",
    missingPrice:
      "Kein bestätigter Kaufpreis für {{credits}} verbrauchte Credits.",
    title: "Monatliche Gewinn- und Verlustrechnung",
    description:
      "Prüfen Sie gebuchte Erlöse, Aufwendungen und das Monatsergebnis.",
    revenue: "Nettoerlöse",
    expenses: "Aufwendungen",
    net: "Gewinn oder Verlust",
    empty: "In diesem Monat wurden keine Erlöse oder Aufwendungen gebucht.",
    areas: "Aufwandsquellen",
    signedExpenseAreas:
      "Stornierungen und andere Gutschriften mindern den Aufwand. Ein negativer Betrag bedeutet, dass sie in diesem Monat die Belastungen überstiegen.",
    openLedger: "Buchungen anzeigen",
    noAccounts: "Keine Bewegungen.",
    estimatesHint:
      "Nutzungsbasierte USD-Schätzwerte für bis zu 20 Modelle zugeordneter Anbieter. Feste Abos und Kosten ohne Nutzungsdaten sind ausgenommen.",
    estimatesEmpty:
      "Für diese Auswahl liegen keine Modellkostenschätzungen vor.",
    unknownModel: "Unbekanntes Modell",
    paid: "Bezahlte Credits: {{amount}}",
    free: "Freikontingent: {{amount}}",
    gifted: "Geschenkte Credits: {{amount}}",
    unknownFunding: "Unbekannte Finanzierung: {{amount}}",
    missing:
      "Für {{credits}} verbrauchte Credits liegen keine genauen Kostendaten vor.",
  },
  suppliers: {
    bankTransaction: "Bankumsatz",
    bankLoading: "Bankumsatz wird geladen …",
    bankUnavailable: "Der geprüfte Bankumsatz ist nicht verfügbar.",
    previewBankLink: "Verknüpfung prüfen",
    linkToBankBill: "Beleg verknüpfen",
    bankDraftBill: "Rechnung aus Bankumsatz (optional)",
    sponsorshipSource: "Creator-Sponsoring",
    confirmSeparateBankBill:
      "Separate Belastung gegenüber den Bankentwürfen bestätigen",
    possibleBankDuplicate:
      "Eine Rechnung aus einem Bankumsatz weist ähnliche Daten auf. Wählen Sie sie zum Verknüpfen aus oder bestätigen Sie eine separate Belastung.",
    monthlyReview: "Monatliche Quellenvorschau",
    monthlyReviewHint:
      "Prüfen Sie gespeicherte Messwerte und bestätigte Belege für Vorauszahlungen in diesem Monat. Unvollständige Intervalle können Lücken hinterlassen.",
    counterTotal: "Nutzung laut Zähler (USD): {{amount}}",
    estimatedTotal: "Geschätzte Nutzung (USD): {{amount}}",
    unclassifiedTotal: "Nutzung mit ungeklärter Grundlage (USD): {{amount}}",
    readingCoverage:
      "{{readings}} Messwerte, davon {{missing}} ohne Intervallkosten.",
    receiptTotal:
      "Bestätigte Vorauszahlungen: {{amount}} in {{count}} Belegen, davon {{posted}} gebucht.",
    noReceipts:
      "Für diesen Monat liegen keine bestätigten Belege für Vorauszahlungen vor.",
    ledgerPrepaid: "Gebuchte Vorauszahlungen",
    estimates: "Geschätzte Modellkosten",
    estimatesHint:
      "Die 20 höchsten nutzungsbasierten Schätzwerte für zugeordnete Anbieter. Feste Abos und Kosten ohne Nutzungsdaten sind ausgenommen.",
    month: "Monat (JJJJ-MM)",
    monthly: "Gebuchte Monatsaufwendungen",
    noMonthly: "Für diesen Monat sind keine Aufwendungen gebucht.",
    area: {
      referral: "Vermittlungsprovisionen",
      provider: "Anbieter",
      processor: "Zahlungsabwicklung",
      sponsorship: "Sponsoring",
      supplier: "Sonstige Lieferantenbelege",
      unallocated: "Nicht zugeordnet",
    },
    spendBasis: {
      counter: "Nutzungszähler des Anbieters",
      "balance-delta": "Aus Guthabenänderung geschätzt",
      "usage-estimate": "Aus interner Nutzung geschätzt",
    },
    title: "Lieferantenbelege",
    description: "Anbieterguthaben und Lieferantenbelege prüfen.",
    record: "Lieferantenbeleg erfassen",
    recordDescription:
      "Historische Belege prüfen, bevor Sie eine Rechnung oder Buchung erfassen.",
    company: "Unternehmen",
    vendor: "Lieferant",
    chooseSupplier: "Lieferanten auswählen",
    operation: "Aktion",
    provider: "Anbieter",
    reference: "Belegreferenz",
    invoiceReference: "Rechnungsnummer des Lieferanten",
    servicePeriodStart: "Leistungsbeginn (JJJJ-MM-TT)",
    servicePeriodEnd: "Leistungsende (JJJJ-MM-TT)",
    date: "Buchungsdatum (JJJJ-MM-TT)",
    gross: "Bruttobetrag",
    tax: "Bestätigter Steuerbetrag",
    currency: "Währung (EUR, USD oder PLN)",
    memo: "Beschreibung",
    preview: "Nur Vorschau",
    debit: "Soll- oder Aufwandskonto",
    credit: "Habenkonto",
    result: "Ergebnis",
    balances: "Anbieterguthaben",
    observed: "Gemeldetes Guthaben",
    interval: "Letzte Intervallkosten, Grundlage ungeprüft",
    unavailable: "Nicht verfügbar",
    recent: "Letzte Belege",
    noBindings: "Diesem Unternehmen ist kein Anbieter zugeordnet.",
    noEvidence: "Es wurden noch keine Lieferantenbelege erfasst.",
    run: "Lieferantenbelege anzeigen",
    previewEvidence: "Beleg prüfen",
    invalid:
      "Prüfen Sie Belegreferenz, bestätigte Beträge, Unternehmenswährung, Konten und offene Periode.",
    conflict: "Diese Belegreferenz ist bereits einem anderen Beleg zugeordnet.",
    taxHint:
      "Geben Sie 0 ein, wenn der Beleg bestätigt, dass keine Steuer anfällt.",
    referralHint:
      "Wählen Sie den Lieferanten mit der bestätigten E-Mail-Adresse des Empfängers. Übernehmen Sie Bruttobetrag, Währung und Steuer aus dem Provisionsbeleg. Der Auszahlungsantrag weist nur Credits aus.",
    evidenceHint:
      "Verwenden Sie den Originalbeleg oder einen Kontoauszug. Ein Anbieterguthaben allein reicht nicht aus.",
    openBill: "Rechnung öffnen",
    openJournal: "Buchung öffnen",
    banked:
      "Gemeldete Guthaben und Kosten dienen der Prüfung. Historische Intervallkosten können geschätzt sein.",
    kind: {
      processorFee: "Bestätigte Zahlungsgebühr verwenden",
      fundBill: "Lieferantenrechnung für Vorauszahlung",
      bind: "Anbieter zuordnen",
      bill: "Lieferantenrechnung",
      fund: "Vorauszahlung leisten",
      consume: "Vorauszahlung verbrauchen",
      paid: "Bezahlten Aufwand erfassen",
      sponsorship: "Sponsoringbeleg verwenden",
      referral: "Provisionsbeleg erfassen",
    },
    outcome: {
      linked: "Lieferantenbeleg verknüpft",
      preview: "Vorschau erfolgreich",
      bound: "Anbieter zugeordnet",
      bill: "Rechnungsentwurf erstellt",
      posted: "Buchung erfasst",
      replayed: "Bereits erfasst",
      review:
        "Prüfung erforderlich. Ein Quelldatensatz allein belegt weder den Ausgleich in Unternehmenswährung noch die Steuer.",
    },
  },
  spendAlert: {
    explained: "Das Ledger erklärt die Nutzungsspitze bei {{provider}}.",
    unexplained: "API-Schlüssel möglicherweise kompromittiert: {{provider}}.",
    cap: "Ausgaben von {{spend}} in {{hours}} Std. ({{rate}}/Std., Limit {{cap}}/Std.).",
    drain:
      "Die Ausgaben von {{rate}}/Std. liegen beim {{ratio}}-Fachen des bisherigen Schnitts von {{baseline}}/Std. über {{coveredHours}} erfasste Stunden (Limit: {{limit}}-fach).",
    ledgerCost:
      "Das Ledger weist für diesen Zeitraum Anbieterkosten von {{cost}} aus.",
    topWallets:
      "Guthabenkonten mit dem höchsten Credit-Verbrauch: {{wallets}}.",
  },
  category: "Finanzen",
  documents: {
    status: "Status",
    activeFilters: "{{label}} aktiv",
    loadFailed: "Belege konnten nicht geladen werden",
    loadFailedHint: "Laden Sie die Liste erneut.",
    scopeDenied: "Sie haben keinen Zugriff auf die ausgewählten Belege.",
    retry: "Erneut laden",
    openAction: "Öffnen",
    pickAction: "Auswählen",
    pageSingle: "Seite {{page}} von {{pages}} · {{total}} Ergebnis",
    clearCompany: "Unternehmensfilter entfernen",
    clearCustomer: "Kundenfilter entfernen",
    pageTotals: "Summe · {{currency}}",
    pageDocumentCount: "Belege auf dieser Seite: {{count}}",
    search: "Dokumente suchen",
    matches: "Gefundene Dokumente ({{count}})",
    emptyTitle: "Keine Dokumente für diese Filter",
    emptyHint: "Ändere den Suchbegriff oder die Filter.",
    allCompanies: "Alle Unternehmen mit Zugriff",
    chooseCompany: "Unternehmen auswählen",
    allCustomers: "Alle Kunden",
    chooseCustomer: "Kunden auswählen",
    apply: "Filter anwenden",
    clear: "Filter zurücksetzen",
    page: "Seite {{page}} von {{pages}} · {{total}} Ergebnisse",
    previous: "Vorherige Seite",
    next: "Nächste Seite",
    select: "{{reference}} auswählen",
    open: "{{reference}} öffnen",
    noReference: "Ohne Belegnummer",
    invoices: "Ausgangsrechnungen",
    bills: "Eingangsrechnungen",
    estimates: "Angebote",
    heading: "Geschäftsbelege",
  },
  tags: {
    finance: "finanzen",
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      openrouter: "OpenRouter",
      nanoGpt: "NanoGPT",
      venice: "Venice",
      uncensoredAi: "uncensored.ai",
      gab: "Gab AI",
      freedomGpt: "FreedomGPT",
      modelsLab: "ModelsLab",
      edenAi: "Eden AI",
    },
    provider: {
      all: "Alle Anbieter",
    },
    eventKind: {
      charge: "Zahlung",
      refund: "Erstattung",
      dispute: "Rückbuchung",
      cancellation: "Kündigung",
      payout: "Auszahlung",
      fee: "Zahlungsgebühr",
    },
    runStatus: {
      ok: "OK",
      skipped: "Übersprungen",
      failed: "Fehlgeschlagen",
    },
    alertType: {
      lowBalance: "Niedriges Prepaid-Guthaben",
      negativeMargin: "Negative Marge",
      thinMargin: "Dünne Marge",
      balanceDrain: "Guthaben-Abfluss",
      spendSpike: "Ausgabenspitze",
      refundSpike: "Erstattungsspitze",
      disputeSpike: "Rückbuchungsspitze",
      cancellationSpike: "Kündigungsspitze",
      billingGap: "Abrechnungslücke",
    },
    severity: {
      warning: "Warnung",
      critical: "Kritisch",
    },
    threshold: {
      openrouterAutoTopUpFloorUsd:
        "OpenRouter: Guthabengrenze bei automatischer Aufladung (USD)",
      openrouterAutoTopUpGraceHours:
        "OpenRouter: Wartezeit für automatische Aufladung (Stunden)",
      gabLowBalanceCredits: "Gab AI: Mindestguthaben (Credits)",
      uncensoredAiLowBalanceCredits: "uncensored.ai: Mindestguthaben (Credits)",
      freedomGptLowBalanceCredits: "FreedomGPT: Mindestguthaben (Credits)",
      nanoGptAutoTopUpFloorUsd:
        "NanoGPT Alarmschwelle bei automatischer Aufladung (USD)",
      nanoGptAutoTopUpGraceHours:
        "NanoGPT Wartezeit für automatische Aufladung (Stunden)",
      veniceAutoTopUpFloorUsd:
        "Venice Alarmschwelle bei automatischer Aufladung (USD)",
      modelsLabLowBalanceUsd: "ModelsLab-Guthabenuntergrenze (USD)",
      edenAiLowBalanceUsd: "Eden-AI-Guthabenuntergrenze (USD)",
      veniceAutoTopUpGraceHours:
        "Venice Wartezeit für automatische Aufladung (Stunden)",
      marginFloorPct: "Margenuntergrenze (%)",
      drainMultiplier: "Abfluss-Faktor (x Durchschnitt)",
      hourlySpendCapUsd: "Stundenlimit pro Anbieter ($/h)",
      minSpikeUsd: "Mindestausgabe für Spitzen ($)",
      refundRatePct: "Erstattungsquote-Limit (% der Zahlungen)",
      disputeCountDaily: "Rückbuchungen pro Tag",
      cancellationMultiplier: "Kündigungsspitze (x Durchschnitt)",
      cancellationMin: "Mindestkündigungen für Spitzen",
      billingGapPct: "Abrechnungslücke-Limit (% über Abgerechnetem)",
      alertDedupHours: "Wiederholungsfenster für Alarme (Stunden)",
      minRevenueUsd: "Mindest-Tagesumsatz für Margenprüfung ($)",
      minCostUsd: "Mindest-Tageskosten für Margenprüfung ($)",
    },
    scope: {
      all: "Alles",
      balances: "Nur Anbieter-Guthaben",
      revenue: "Nur Umsatz",
    },
    costCoverage: {
      complete: "Vollständig",
      partial: "Kosten unvollständig",
      none: "Kosten unbekannt",
    },
    metric: {
      stripeRevenue: "Stripe-Umsatz (brutto, $)",
      nowpaymentsRevenue: "NOWPayments-Umsatz (brutto, $)",
      netRevenue: "Nettoumsatz ($)",
      refunds: "Erstattungen ($)",
      upstreamCost: "Einkaufskosten ($)",
      internalBilled: "Nutzern berechnet ($)",
      grossMarginUsd: "Bruttomarge ($)",
      grossMarginPct: "Bruttomarge (%)",
      providerSpend: "Anbieter-Ausgaben ($)",
      providerBalance: "Anbieter-Restguthaben ($)",
      providerBalanceNative: "Anbieter-Restguthaben (Anbieter-Credits)",
      providerCost: "Anbieterkosten laut eigenem Nutzungsprotokoll ($)",
      costTotal: "Anbieterkosten gesamt ($)",
      costPaid: "Anbieterkosten bezahlter Nutzung ($)",
      costFree: "Anbieterkosten kostenloser Nutzung ($)",
      consumedList: "Verbrauchte Credits zum Listenpreis ($)",
      earned: "Verdient: bezahlte Credits zum gezahlten Preis ($)",
      freeList: "Verbrauchte Gratis-Credits zum Listenpreis ($)",
      aiMarginUsd: "KI-Marge: Verdient minus Anbieterkosten ($)",
      aiMarginPct: "KI-Marge (% vom Verdienten)",
      paidMarginUsd: "Marge bezahlter Nutzung ($)",
      paidMarginPct: "Marge bezahlter Nutzung (%)",
      alerts: "Ausgelöste Alarme",
    },
  },
  ingest: {
    title: "Finanz-Abruf",
    titleShort: "Abruf",
    description:
      "Lesender Abruf echter Umsätze (Stripe, NOWPayments) und echter Anbieter-Guthaben. Berechnet die Tagesmarge und schlägt Alarm. Bewegt kein Geld.",
    task: {
      balancesName: "Abgleich der Anbieter-Guthaben",
      revenueName: "Umsatzabgleich",
      balances:
        "Stündlich: Guthaben aller Anbieter lesen, Ausgaben messen, Abflüsse und Spitzen melden.",
      revenue:
        "Täglich: Stripe- und NOWPayments-Umsatz holen, Marge berechnen, Erstattungen, Rückbuchungen und dünne Marge melden.",
    },
    fields: {
      scope: {
        label: "Umfang",
        description: "Was abgerufen wird",
      },
      dryRun: {
        label: "Probelauf",
        description: "Lesen und rechnen, nichts speichern, nichts senden",
      },
      windowDays: {
        label: "Umsatzfenster (Tage)",
        description: "Wie weit zurück der Umsatz neu geholt wird. Standard 3.",
      },
      backfillFrom: {
        label: "Nachfüllen ab (JJJJ-MM-TT)",
        description:
          "Tagesauswertungen ab diesem UTC-Tag bis zum Nachfüllen-bis-Tag (Standard heute) neu berechnen. Baut den Umsatz aus unserer gesamten Zahlungshistorie neu auf; schreibt immer (ignoriert den Probelauf). Leer lassen für einen normalen Abruf.",
      },
      backfillTo: {
        label: "Nachfüllen bis (JJJJ-MM-TT)",
        description:
          "Letzter UTC-Tag, der neu berechnet wird. Standard: heute.",
      },
    },
    response: {
      dryRun: "Probelauf",
      ranAt: "Gelaufen um",
      sources: "Quellen",
      days: "Tagesmarge",
      alertsRaised: "Ausgelöste Alarme",
      alertsSuppressed: "Unterdrückte Alarme (Duplikat)",
      alerts: "Alarme",
    },
    widget: {
      hint: "Liest nur unsere eigenen Konten. Eine Quelle ohne Schnittstelle wird übersprungen, der Grund wird festgehalten.",
      submit: "Abruf starten",
      submitting: "Läuft…",
      result: "Ergebnis",
      resultDry: "Probelauf (nichts gespeichert, nichts gesendet)",
      events: "{{count}} Zeilen",
      margin: "Zahlungseingang und Anbieterausgaben pro Tag (keine Marge)",
      dayLine: "Eingang {{cash}} · Anbieterausgaben {{cost}}",
      costUnknown: "Kosten unbekannt",
      alerts: "Alarme: {{raised}} ausgelöst, {{suppressed}} unterdrückt",
    },
  },
  status: {
    title: "Finanzen",
    titleShort: "Finanzen",
    description:
      "Umsatz gegen Einkaufskosten: Anbieter-Guthaben, Marge, Alarme und Schwellenwerte.",
    response: {
      lastIngestAt: "Letzter Synchronisierungsversuch",
      lastSuccessfulIngestAt: "Letzte erfolgreiche Quellensynchronisierung",
      asOf: "Stand der Statusabfrage",
      sources: "Quellen",
      week: "Letzte 7 Tage",
      days: "Tagesmarge",
      alerts: "Letzte Alarme",
      thresholds: "Schwellenwerte",
    },
    widget: {
      back: "Zurück",
      title: "Finanzen",
      refresh: "Aktualisieren",
      runIngest: "Abruf starten",
      loading: "Lade Finanzen…",
      lastIngest: "Letzter Versuch {{when}}",
      lastSuccessful: "Zuletzt erfolgreich synchronisiert {{when}}",
      snapshot: "Letzter Messwert {{when}}",
      stale: "Veralteter Messwert",
      noBalance: "Kein Guthaben gemeldet",
      noSources: "Es liegen keine Daten aus Finanzquellen vor.",
      never: "nie",
      neverRun: "Noch nie gelaufen",
      margin: {
        title: "KI-Marge (letzte 7 Tage)",
        earned: "Verdient mit bezahlten Credits",
        cost: "Anbieterkosten",
        margin: "KI-Marge",
        pct: "KI-Marge %",
        paidPct: "Marge bezahlter Nutzung %",
        basis:
          "Verdient = verbrauchte bezahlte Credits zum gezahlten Preis. Kosten = Anbieterkosten aller Nutzung, inkl. {{free}} Gratis-Credits zum Listenpreis.",
        cash: "Zahlungseingang netto: {{net}}, Zahlungsgebühren {{fees}}. Cashflow, nie mit Anbieterkosten verrechnet.",
        cashDay: "Eingang {{net}}",
        empty: "Keine Nutzung in den letzten 7 Tagen.",
        missingPct: "Nichts verdient",
      },
      providers: {
        title: "Anbieter-Guthaben",
        lastSpend: "Seit letzter Messung ausgegeben: {{amount}}",
        lastSpendEstimate:
          "Geschätzte Ausgaben seit letzter Messung: {{amount}}",
        previousDaySpend: "API-Verbrauch am {{day}} (UTC): {{amount}}",
        lastNativeSpend:
          "API-Verbrauch bis zur letzten vollen Stunde: {{amount}}",
        noSpend: "Noch keine Ausgaben gemessen",
      },
      revenue: {
        title: "Umsatzquellen",
        fallback: "Ersatzdaten: eigene Buchungen",
      },
      alerts: {
        title: "Letzte Alarme",
        empty: "Keine Warnungen erfasst",
      },
      thresholds: {
        title: "Schwellenwerte",
        hint: "Standardwerte gelten, bis du einen setzt. Alarme wiederholen sich höchstens einmal pro Fenster.",
        custom: "Eigener Wert",
        default: "Standard",
        edit: "Ändern",
      },
    },
  },
  thresholds: {
    title: "Finanz-Schwellenwert setzen",
    titleShort: "Schwellenwert setzen",
    description:
      "Überschreibt einen Alarm-Schwellenwert. Ein deaktivierter Wert fällt auf den Standard zurück.",
    fields: {
      key: { label: "Schwellenwert", description: "Welches Limit sich ändert" },
      value: { label: "Wert", description: "Das neue Limit" },
      enabled: {
        label: "Wert verwenden",
        description: "Aus: Standard gilt",
      },
      note: {
        label: "Notiz",
        description: "Warum dieses Limit",
        placeholder: "z. B. Launch-Woche, Erstattungen erwartet",
      },
    },
    response: { key: "Gespeicherter Schwellenwert" },
    widget: {
      back: "Zurück",
      hint: "Gilt ab dem nächsten Abruf.",
    },
  },
  series: {
    title: "Finanz-Zeitreihe",
    titleShort: "Finanzen",
    description:
      "Zeitreihen des Finanz-Monitors: Umsatz je Zahlungsdienst, Nettoumsatz, Einkaufskosten, Marge, Anbieter-Ausgaben und -Guthaben, Alarme.",
    fields: {
      resolution: { label: "Auflösung", description: "Größe der Zeitfenster" },
      range: { label: "Zeitraum", description: "Abzurufender Zeitraum" },
      lookback: {
        label: "Vorlauf",
        description: "Warm-up-Balken vor dem Zeitraum",
      },
      metric: {
        label: "Kennzahl",
        description: "Welche Reihe gezeichnet wird",
      },
      provider: {
        label: "Anbieter",
        description: "Filtert Anbieter-Ausgaben und -Guthaben",
      },
      costProvider: {
        label: "Kostenanbieter",
        description:
          "API-Anbieter-ID für Anbieterkosten, z. B. openrouter, nano-gpt oder unattributed",
      },
      result: { label: "Reihe", description: "Finanz-Zeitreihe" },
      meta: { label: "Meta", description: "Ausführungs-Metadaten" },
    },
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Prüfe die markierten Felder",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Melde dich als Admin an",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Finanz-Tools brauchen die Admin-Rolle",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Diesen Eintrag gibt es nicht",
    },
    conflict: {
      title: "Konflikt",
      description: "Der Eintrag hat sich geändert, neu laden und wiederholen",
    },
    server: {
      title: "Serverfehler",
      description: "Die Anfrage konnte nicht abgeschlossen werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Die Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist fehlgeschlagen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Erst speichern oder verwerfen",
    },
    invalidThreshold: "Ein Schwellenwert braucht eine nicht negative Zahl",
    ingestFailed: "Finanz-Abruf fehlgeschlagen: {{error}}",
    backfill: {
      invalidRange:
        "Das Nachfüllen braucht ein gültiges Von-Datum am oder vor dem Bis-Datum (JJJJ-MM-TT)",
      tooWide:
        "Nachfüll-Zeitraum zu groß: höchstens {{max}} Tage pro Durchlauf",
    },
  },
  success: {
    title: "Erledigt",
    description: "Gespeichert",
  },
};

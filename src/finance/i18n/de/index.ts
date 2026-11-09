import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Finanzen",
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
    },
    runStatus: {
      ok: "OK",
      skipped: "Übersprungen",
      failed: "Fehlgeschlagen",
    },
    alertType: {
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
      alerts: "Ausgelöste Alarme",
    },
  },
  ingest: {
    title: "Finanz-Abruf",
    titleShort: "Abruf",
    description:
      "Lesender Abruf echter Umsätze (Stripe, NOWPayments) und echter Anbieter-Guthaben. Berechnet die Tagesmarge und schlägt Alarm. Bewegt kein Geld.",
    task: {
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
      margin: "Marge: Nettoumsatz - Einkaufskosten",
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
      lastIngestAt: "Letzter Abruf",
      sources: "Quellen",
      week: "Letzte 7 Tage",
      days: "Tagesmarge",
      alerts: "Letzte Alarme",
      thresholds: "Schwellenwerte",
    },
    widget: {
      title: "Finanzen",
      refresh: "Aktualisieren",
      runIngest: "Abruf starten",
      loading: "Lade Finanzen…",
      lastIngest: "Letzter Abruf: {{when}}",
      never: "nie",
      neverRun: "Noch nie gelaufen",
      margin: {
        title: "Marge (letzte 7 Tage)",
        revenue: "Nettoumsatz",
        cost: "Einkaufskosten",
        margin: "Bruttomarge",
        pct: "Marge %",
        empty: "Noch keine Auswertung. Abruf starten.",
        costUnknown: "Kosten unbekannt",
        costIncomplete:
          "Die Einkaufskosten sind für einige Tage in diesem Zeitraum unvollständig — die Marge lässt nicht erfasste Kosten aus und ist nur ein Teilwert.",
      },
      providers: {
        title: "Anbieter-Guthaben",
        lastSpend: "Seit letzter Messung ausgegeben: {{amount}}",
        noSpend: "Noch keine Ausgaben gemessen",
      },
      revenue: {
        title: "Umsatzquellen",
      },
      alerts: {
        title: "Letzte Alarme",
        empty: "Keine Alarme. Marge und Guthaben sehen normal aus.",
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

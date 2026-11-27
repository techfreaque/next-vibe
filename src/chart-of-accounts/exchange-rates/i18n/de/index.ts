import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Buchhaltung",
  tags: {
    ledger: "hauptbuch",
    fx: "fx",
    rates: "wechselkurse",
  },
  fields: {
    companyId: "Unternehmen",
    baseCurrency: "Basiswährung",
    quoteCurrency: "Zielwährung",
    rate: "Wechselkurs",
    rateDate: "Kursdatum",
    source: "Quelle",
    asOfDate: "Bewertungsstichtag",
    dryRun: "Nur Vorschau",
    postReversalNextDay: "Am Folgetag automatisch stornieren",
    currency: "Währung",
    limit: "Max. Einträge",
  },
  list: {
    title: "Wechselkurse",
    titleShort: "FX-Kurse",
    description:
      "Tägliche EZB-Referenzkurse und manuelle Wechselkurse für die Mehrwährungsbuchhaltung",
    syncEcbAction: "EZB-Kurse abrufen",
    setManualAction: "Manuellen Kurs anlegen",
    revalueAction: "Stichtagsbewertung (FX)",
    empty:
      "Noch keine Wechselkurse gespeichert. EZB-Tageskurse abrufen oder manuellen Kurs erfassen.",
    countLabel: "Gespeicherte Kurse",
    latestDate: "Letztes Kursdatum",
    success: "Wechselkurse geladen",
  },
  set: {
    title: "Manuellen Wechselkurs festlegen",
    description:
      "Manuellen Wechselkurs speichern (1 Basiswährung = Kurs Zielwährung). Manuelle Kurse haben am selben Tag Vorrang vor EZB-Kursen.",
    action: "Kurs speichern",
    success: "Wechselkurs gespeichert",
  },
  sync: {
    title: "EZB-Tageskurse synchronisieren",
    description:
      "Aktuelle Euro-Referenzkurse der Europäischen Zentralbank abrufen",
    action: "EZB-Kurse jetzt abrufen",
    success: "EZB-Tageskurse synchronisiert",
    upsertedCount: "Aktualisierte Kurse",
  },
  revaluation: {
    title: "Stichtagsbewertung Fremdwährungen",
    description:
      "Offene Fremdwährungsforderungen, Verbindlichkeiten und Bankbestände zum Stichtagskurs neu bewerten",
    action: "FX-Bewertung ausführen",
    previewAction: "Vorschau berechnen",
    postAction: "Bewertungsbuchung erstellen",
    success: "Fremdwährungsbewertung abgeschlossen",
    noAdjustments:
      "Keine offenen Fremdwährungsbestände erfordern eine Neubewertung.",
    functionalCurrency: "Hauswährung",
    totalUnrealized: "Unrealisiertes Kursergebnis",
    journalEntryId: "Bewertungsbuchung",
    reversalEntryId: "Stornobuchung Folgetag",
    missingRates: "Währungen ohne Stichtagskurs",
    account: "Konto",
    foreignBalance: "Originalbestand",
    carryingFunctional: "Buchwert",
    closingRate: "Stichtagskurs",
    revaluedFunctional: "Neubewertung",
    unrealizedDelta: "Unrealisierte Differenz",
    previewBanner: "Nur Vorschau. Es wurden keine Buchungen erzeugt.",
    postedBanner: "Unrealisierte Fremdwährungsbewertung gebucht.",
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Währungscodes, Datum und Wechselkurs prüfen.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Für Wechselkurse und FX-Bewertungen bitte anmelden.",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Für diese Aktion sind Buchhaltungsrechte erforderlich.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Unternehmen oder Kursdaten wurden nicht gefunden.",
    },
    conflict: {
      title: "Konflikt",
      description: "Offene Buchungsperiode oder benötigte FX-Konten fehlen.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Der EZB-Wechselkursfeed konnte nicht erreicht werden.",
    },
    server: {
      title: "Serverfehler",
      description: "Unerwarteter Fehler bei der FX-Verarbeitung.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es liegen ungespeicherte Änderungen vor.",
    },
  },
};

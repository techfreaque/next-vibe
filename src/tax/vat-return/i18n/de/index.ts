import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Steuern", vatReturn: "Umsatzsteuer-Voranmeldung" },
  title: "Umsatzsteuer-Voranmeldung",
  titleShort: "USt-Voranmeldung",
  description:
    "Ihre Umsatzsteuer-Voranmeldung für den Zeitraum im amtlichen Format Ihres Landes.",
  company: {
    label: "Unternehmen",
    description: "Das Unternehmen für die Meldung",
  },
  period: {
    label: "Zeitraum",
    description: "Monat oder Quartal der Meldung",
    month: "{{month}} {{year}}",
    quarter: "Q{{quarter}} {{year}}",
  },
  disclaimer:
    "Wir liefern Werkzeuge, keine Steuerberatung. Lassen Sie Meldungen vor der Einreichung von Ihrer Steuerberatung prüfen.",
  summary: "{{company}}, {{from}} bis {{to}}",
  formats: {
    SK_DPH: "Zeilen der DPH-Erklärung (DPHv25)",
    DE_USTVA: "Umsatzsteuer-Voranmeldung (UStVA)",
    DE_EUR_SMALL_BUSINESS: "EÜR-Übersicht (§ 19 UStG Kleinunternehmer)",
    AT_UVA: "Umsatzsteuervoranmeldung (U30)",
    AT_EA_SMALL_BUSINESS: "Einnahmen-Ausgaben-Übersicht (§ 6 Abs. 1 Z 27 UStG)",
    GENERIC_VAT: "Umsatzsteuer-Übersicht nach Steuersatz",
  },
  dueByFormat: {
    SK_DPH: "Fällig am 25. des Folgemonats, elektronisch.",
    DE_USTVA: "Fällig am 10. des Folgemonats über ELSTER.",
    DE_EUR_SMALL_BUSINESS: "Jährliche EÜR mit der Einkommensteuererklärung.",
    AT_UVA: "Fällig am 15. des übernächsten Monats über FinanzOnline.",
    AT_EA_SMALL_BUSINESS: "Jährliche Einnahmen-Ausgaben-Rechnung.",
    GENERIC_VAT: "Prüfen Sie die Abgabefrist Ihrer Finanzbehörde.",
  },
  smallBusiness: {
    title:
      "Keine Umsatzsteuer-Voranmeldung wegen Kleinunternehmerregelung nötig",
    body: {
      SK_DPH: "Dieses Unternehmen ist nicht umsatzsteuerpflichtig.",
      DE_USTVA: "Keine regelmäßige UStVA erforderlich.",
      DE_EUR_SMALL_BUSINESS:
        "Dieses Unternehmen nutzt die Kleinunternehmerregelung nach § 19 UStG. Eine reguläre UStVA ist nicht erforderlich. Unten sehen Sie Ihre EÜR-Übersicht für den Zeitraum.",
      AT_UVA: "Keine regelmäßige UVA erforderlich.",
      AT_EA_SMALL_BUSINESS:
        "Dieses Unternehmen nutzt die Kleinunternehmerregelung nach § 6 Abs. 1 Z 27 UStG. Unten sehen Sie Ihre Einnahmen-Ausgaben-Übersicht.",
      GENERIC_VAT: "Für diesen Steuerstatus ist keine USt-Meldung nötig.",
    },
  },
  xmlSection: {
    SK_DPH: "Kontrollmeldung (KV DPH)",
    DE_USTVA: "ELSTER-UStVA-XML",
    DE_EUR_SMALL_BUSINESS: "XML-Export",
    AT_UVA: "FinanzOnline-UVA-XML (U30)",
    AT_EA_SMALL_BUSINESS: "XML-Export",
    GENERIC_VAT: "XML-Export",
  },
  xmlNote: {
    SK_DPH: "Laden Sie das KVDPHv25-XML im eDane-Portal hoch.",
    DE_USTVA:
      "ELSTER-Anmeldungssteuern-XML für den Import beim Steuerberater oder den ERiC-Versand. Die direkte Übermittlung an ELSTER erfordert ein ERiC-Zertifikat; die Kennzahlen können auch direkt in Mein ELSTER übertragen oder als CSV geladen werden.",
    DE_EUR_SMALL_BUSINESS:
      "Nutzen Sie den strukturierten CSV-Export oben für Ihre EÜR.",
    AT_UVA:
      "FinanzOnline-U30-XML für den Portal-Upload oder Ihre Steuerberatung. Alternativ steht der strukturierte CSV-Export oben bereit.",
    AT_EA_SMALL_BUSINESS: "Nutzen Sie den strukturierten CSV-Export oben.",
    GENERIC_VAT:
      "Nutzen Sie den strukturierten CSV-Export oben für Ihre Meldung.",
  },
  lines: {
    title: "Erklärungszeilen",
    line: "Zeile",
    meaning: "Bedeutung",
    base: "Bemessungsgrundlage",
    amount: "Betrag",
    r01: "Bemessungsgrundlage 19 %",
    r02: "Umsatzsteuer 19 %",
    r01a: "Bemessungsgrundlage 5 %",
    r02a: "Umsatzsteuer 5 %",
    r03: "Bemessungsgrundlage 23 %",
    r04: "Umsatzsteuer 23 %",
    r09: "Reverse Charge, Bemessungsgrundlage 19 % (Sie schulden die Steuer)",
    r10: "Reverse Charge, Umsatzsteuer 19 %",
    r09a: "Reverse Charge, Bemessungsgrundlage 5 %",
    r10a: "Reverse Charge, Umsatzsteuer 5 %",
    r09b: "Reverse Charge, Bemessungsgrundlage 23 %",
    r10b: "Reverse Charge, Umsatzsteuer 23 %",
    r13: "Steuerfreie Umsätze",
    r14: "davon innergemeinschaftliche Lieferungen (§ 43)",
    r15: "davon Ausfuhren (§§ 46, 47)",
    r17: "Umsatzsteuer gesamt",
    r18: "Vorsteuerabzug 19 %",
    r18a: "Vorsteuerabzug 5 %",
    r19: "Vorsteuerabzug 23 %",
    r20: "davon Inlandsrechnungen 19 %",
    r20a: "davon Inlandsrechnungen 5 %",
    r21: "davon Inlandsrechnungen 23 %",
    r24: "Berichtigung der Bemessungsgrundlage (Gutschriften, § 25)",
    r25: "Berichtigung der Steuer (Gutschriften, § 25)",
    r32: "Zahllast",
    r33: "Vorsteuerüberhang (Erstattung)",
  },
  sections: {
    title: "Kontrollmeldung",
    section: "Abschnitt",
    count: "Zeilen",
    A1: "A.1 Ausgangsrechnungen an Umsatzsteuerpflichtige",
    A2: "A.2 Ausgangsrechnungen mit inländischem Reverse Charge",
    B1: "B.1 Eingangsrechnungen, Sie schulden die Steuer",
    B2: "B.2 Inländische Eingangsrechnungen mit Vorsteuerabzug",
    B31: "B.3.1 Erhaltene vereinfachte Rechnungen (Summe)",
    C1: "C.1 Ausgestellte Gutschriften",
    D1: "D.1 Kassenumsätze",
    D2: "D.2 Sonstige Umsätze (Kunden ohne USt-IdNr.)",
  },
  warnings: {
    noVatId:
      "Das Unternehmen hat keine gültige USt-IdNr. hinterlegt. Ergänzen Sie diese vor der Einreichung.",
    noTaxId:
      "Das Unternehmen hat keine Steuernummer hinterlegt. Ergänzen Sie diese in den Unternehmensdaten vor dem ELSTER-Export.",
    customerVatIds:
      "{{count}} Rechnungen an Kunden ohne USt-IdNr. werden in D.2 gemeldet.",
    unmappedRates:
      "{{count}} Zeilen haben abweichende Steuersätze und fehlen in den zugeordneten Zeilen. Prüfen Sie diese.",
    b32Required:
      "Die Vorsteuer aus vereinfachten Rechnungen hat 3.000 EUR erreicht. Melden Sie diese vor der Einreichung je Lieferant in B.3.2.",
  },
  actions: {
    downloadXml: "XML herunterladen",
    downloadCsv: "CSV herunterladen",
    showXml: "XML anzeigen",
    hideXml: "XML ausblenden",
    copy: "Kopieren",
    copied: "Kopiert",
    copyError:
      "Kopieren fehlgeschlagen. Markieren Sie den Text und kopieren Sie ihn manuell.",
  },
  pickCompany:
    "Wählen Sie ein Unternehmen, um seine Umsatzsteuer-Voranmeldung vorzubereiten.",
  empty: "Keine relevanten Belege in diesem Zeitraum.",
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description:
        "Wählen Sie ein Unternehmen und einen gültigen Monat oder ein gültiges Quartal.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description:
        "Melden Sie sich an, um Umsatzsteuer-Voranmeldungen vorzubereiten.",
    },
    forbidden: {
      title: "Kein Zugriff",
      description: "Sie sind kein Mitglied dieses Unternehmens.",
    },
    notFound: {
      title: "Unternehmen nicht gefunden",
      description: "Das Unternehmen existiert nicht oder ist inaktiv.",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Die Daten wurden während der Vorbereitung geändert. Versuchen Sie es erneut.",
    },
    server: {
      title: "Meldung nicht vorbereitet",
      description:
        "Die Umsatzsteuer-Voranmeldung konnte nicht vorbereitet werden. Versuchen Sie es erneut.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description: "Etwas ist schiefgelaufen. Versuchen Sie es erneut.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichern oder verwerfen Sie zuerst Ihre Änderungen.",
    },
  },
  success: {
    title: "Umsatzsteuer-Voranmeldung vorbereitet",
    description:
      "Zeilen und Exportdateien entsprechen den gespeicherten Belegen.",
  },
};

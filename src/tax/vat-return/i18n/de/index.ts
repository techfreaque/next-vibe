import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Steuern", vatReturn: "Umsatzsteuererklärung" },
  title: "Slowakische Umsatzsteuererklärung und Kontrollmeldung",
  titleShort: "USt-Erklärung (SK)",
  description:
    "Bereiten Sie die Zeilen der DPH-Erklärung und das XML der Kontrollmeldung (kontrolný výkaz) für einen Monat oder ein Quartal vor.",
  company: {
    label: "Unternehmen",
    description: "Das umsatzsteuerpflichtige Unternehmen",
  },
  period: {
    label: "Zeitraum",
    description: "Monat oder Quartal der Erklärung",
    month: "{{month}} {{year}}",
    quarter: "Q{{quarter}} {{year}}",
  },
  unsupportedCountry:
    "Die Umsatzsteuererklärung gibt es nur für slowakische Unternehmen. Stellen Sie das Land des Unternehmens auf Slowakei um.",
  disclaimer:
    "Wir liefern Werkzeuge, keine Steuerberatung. Lassen Sie Meldungen von Ihrer Steuerberatung prüfen, bevor Sie sie in eDane einreichen.",
  summary: "{{company}}, {{from}} bis {{to}}",
  due: "Fällig am 25. des Folgemonats, elektronisch.",
  lines: {
    title: "Zeilen der DPH-Erklärung (DPHv25)",
    line: "Zeile",
    meaning: "Bedeutung",
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
    title: "Kontrollmeldung (KV DPH)",
    section: "Abschnitt",
    count: "Zeilen",
    A1: "A.1 Ausgangsrechnungen an Umsatzsteuerpflichtige",
    A2: "A.2 Ausgangsrechnungen mit inländischem Reverse Charge",
    B1: "B.1 Eingangsrechnungen, Sie schulden die Steuer",
    B2: "B.2 Inländische Eingangsrechnungen mit Vorsteuerabzug",
    B31: "B.3.1 Erhaltene vereinfachte Rechnungen (Summe)",
    C1: "C.1 Ausgestellte Gutschriften",
    D1: "D.1 eKasa-Umsätze",
    D2: "D.2 Sonstige Umsätze (Kunden ohne IČ DPH)",
  },
  warnings: {
    noVatId:
      "Das Unternehmen hat keine gültige USt-IdNr. (IČ DPH). Das KV-XML braucht sie vor der Einreichung.",
    customerVatIds:
      "{{count}} Rechnungen an Kunden ohne IČ DPH werden in D.2 gemeldet.",
    unmappedRates:
      "{{count}} Zeilen haben Steuersätze außerhalb von 23 / 19 / 5 % und fehlen in der Erklärung. Prüfen Sie diese.",
    b32Required:
      "Die Vorsteuer aus vereinfachten Rechnungen hat 3.000 EUR erreicht. Melden Sie diese vor der Einreichung je Lieferant in B.3.2.",
  },
  actions: {
    downloadKv: "KV-DPH-XML herunterladen",
    downloadCsv: "Erklärungszeilen herunterladen (CSV)",
    showXml: "XML anzeigen",
    hideXml: "XML ausblenden",
    copy: "Kopieren",
    copied: "Kopiert",
    copyError:
      "Kopieren fehlgeschlagen. Markieren Sie den Text und kopieren Sie ihn manuell.",
  },
  pickCompany:
    "Wählen Sie ein Unternehmen, um seine Umsatzsteuererklärung vorzubereiten.",
  empty: "Keine umsatzsteuerrelevanten Belege in diesem Zeitraum.",
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description:
        "Wählen Sie ein Unternehmen und einen gültigen Monat oder ein gültiges Quartal.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description:
        "Melden Sie sich an, um Umsatzsteuererklärungen vorzubereiten.",
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
      title: "Erklärung nicht vorbereitet",
      description:
        "Die Umsatzsteuererklärung konnte nicht vorbereitet werden. Versuchen Sie es erneut.",
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
    title: "Umsatzsteuererklärung vorbereitet",
    description:
      "Zeilen und Kontrollmeldung entsprechen den gespeicherten Belegen.",
  },
};

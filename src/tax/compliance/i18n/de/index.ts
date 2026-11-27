import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { compliance: "Compliance", tax: "Steuern" },
  enums: {
    vatTreatment: {
      domestic: "Inlandsumsatz mit Umsatzsteuer",
      reverseChargeDomestic: "Inländisches Reverse-Charge-Verfahren",
      euServices: "Dienstleistung an EU-Unternehmen (Reverse Charge)",
      euGoods: "Innergemeinschaftliche Lieferung (steuerfrei)",
      export: "Ausfuhr in Drittländer (steuerfrei)",
      exempt: "Steuerfreier Umsatz",
    },
    severity: {
      error: "Blockiert die Ausstellung",
      warning: "Prüfen",
      info: "Hinweis",
    },
  },
  issues: {
    issuerAddressMissing:
      "Ergänzen Sie Straße, Ort und Postleitzahl des Unternehmens. Rechnungen müssen die vollständige Anschrift enthalten.",
    issuerRegistrationMissing:
      "Ergänzen Sie die Handelsregisternummer (IČO). Sie gehört auf jede Rechnung.",
    issuerRegistrationInvalid:
      "Die Registernummer (IČO) ist ungültig. Sie hat 8 Ziffern inklusive Prüfziffer.",
    issuerTaxIdMissing:
      "Ergänzen Sie die Steuernummer (DIČ). Sie gehört auf jede Rechnung.",
    issuerTaxIdInvalid:
      "Die Steuernummer (DIČ) ist ungültig. Sie hat 10 Ziffern.",
    issuerVatIdMissing:
      "Ergänzen Sie die USt-IdNr. (IČ DPH). Umsatzsteuerpflichtige Unternehmen müssen sie auf Rechnungen angeben.",
    issuerVatIdInvalid:
      "Die USt-IdNr. (IČ DPH) ist ungültig. Sie besteht aus SK und 10 Ziffern.",
    customerVatIdMissing:
      "Ergänzen Sie die USt-IdNr. des Kunden in der Rechnungsadresse. Reverse Charge und EU-Umsätze setzen sie voraus.",
    customerVatIdInvalid: "Die USt-IdNr. des Kunden ist ungültig.",
    customerNotForeignEu:
      "EU-Umsätze erfordern eine USt-IdNr. des Kunden aus einem anderen EU-Land.",
    customerNotDomestic:
      "Das inländische Reverse-Charge-Verfahren erfordert eine USt-IdNr. des Kunden aus Ihrem Land.",
    treatmentNotAllowed:
      "Diese steuerliche Behandlung passt nicht zur Umsatzsteuerregelung des Unternehmens. Wählen Sie eine andere Behandlung oder passen Sie die Regelung an.",
    treatmentRequiresZeroRate:
      "Reverse Charge und steuerfreie Umsätze enthalten keine Umsatzsteuer. Setzen Sie alle Positionen auf 0 %.",
    rateNotValidOnDate:
      "{{rate}} % Umsatzsteuer gilt nicht am {{date}}. Verwenden Sie einen Steuersatz, der am Leistungsdatum gilt.",
    zeroRateWithoutReason:
      "Eine Position hat 0 % Umsatzsteuer bei einem Inlandsumsatz. Wählen Sie die zutreffende Steuerbefreiung oder Reverse Charge.",
    issueDeadlinePassed:
      "{{days}} Tage nach der Leistung ausgestellt. Die gesetzliche Frist beträgt {{limit}} Tage.",
    regimeNotElected:
      "Keine Umsatzsteuerregelung hinterlegt. Bis Sie eine wählen, behandelt das ERP das Unternehmen als umsatzsteuerpflichtig.",
    chartTemplateMismatch:
      "Der Kontenrahmen stammt nicht aus der Vorlage für dieses Land.",
    taxRatesMissing:
      "Für dieses Land fehlen Steuersätze. Legen Sie sie an, damit Belege sie verwenden können.",
    taxRatesOutdated:
      "Einige aktive Steuersätze gelten heute nicht mehr. Deaktivieren Sie sie oder setzen Sie ein Enddatum.",
    fiscalProviderMissing:
      "Bar- und Kartenumsätze erfordern eine zertifizierte eKasa-Registrierkasse. Kassenumsätze bleiben gesperrt, bis eine angebunden ist.",
    eInvoicingUpcoming:
      "Strukturierte E-Rechnungen sind ab {{date}} Pflicht. Der Peppol-UBL-Export ist bereit.",
    vatThresholdNear:
      "Der Umsatz in diesem Kalenderjahr beträgt {{turnover}}. Ab {{threshold}} ist die Registrierung zur Umsatzsteuer Pflicht.",
    vatThresholdExceeded:
      "Der Umsatz in diesem Kalenderjahr beträgt {{turnover}} und liegt über der Umsatzgrenze von {{threshold}}. Registrieren Sie sich zur Umsatzsteuer.",
  },
  review: {
    title: "Länderspezifische Compliance-Prüfung",
    titleShort: "Compliance-Prüfung",
    description:
      "Sehen Sie, welche gesetzlichen Anforderungen im Land des Unternehmens erfüllt sind und was Sie zuerst beheben sollten.",
    company: {
      label: "Unternehmen",
      description: "Das zu prüfende Unternehmen",
    },
    disclaimer:
      "Wir liefern Werkzeuge, keine Steuerberatung. Lassen Sie Meldungen von Ihrer Steuerberatung prüfen.",
    country: "Länderregeln",
    regime: "Umsatzsteuerregelung",
    findings: "Befunde",
    findingCode: "Befund",
    findingSeverity: "Schweregrad",
    allClear: "Alle Anforderungen für dieses Land sind erfüllt.",
    countries: {
      SK: "Slowakei",
      DE: "Deutschland",
      AT: "Österreich",
      XX: "Allgemein (keine Länderregeln)",
    },
    facts: {
      title: "Was das ERP vorbereitet",
      vatReturn: "Umsatzsteuererklärung und Kontrollmeldung",
      statements: "Gesetzlicher Jahresabschluss",
      fiscal: "Fiskalbelege",
      eInvoicing: "E-Rechnungspflicht ab",
      yes: "Verfügbar",
      no: "Für dieses Land nicht verfügbar",
      notRequired: "Nicht erforderlich",
      required: "Erforderlich, über eine zertifizierte eKasa-Registrierkasse",
    },
    actions: {
      company: "Unternehmensdaten bearbeiten",
      regime: "Umsatzsteuerregelung wählen",
      rates: "Steuersätze prüfen",
      chart: "Kontenrahmen einrichten",
      vatReturn: "Umsatzsteuererklärung öffnen",
      fiscal: "Kassen-Fiskalisierung öffnen",
    },
    pickCompany: "Wählen Sie ein Unternehmen zur Prüfung.",
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Wählen Sie ein Unternehmen, dem Sie angehören.",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Melden Sie sich an, um die Compliance zu prüfen.",
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
          "Das Unternehmen wurde während der Prüfung geändert. Versuchen Sie es erneut.",
      },
      server: {
        title: "Prüfung fehlgeschlagen",
        description:
          "Die Compliance-Prüfung konnte nicht ausgeführt werden. Versuchen Sie es erneut.",
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
      title: "Compliance geprüft",
      description:
        "Die Befunde zeigen den aktuellen Stand der Unternehmensdaten.",
    },
  },
};

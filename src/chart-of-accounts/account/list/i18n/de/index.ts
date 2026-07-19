import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Kontenplan",
    titleShort: "Konten",
    description:
      "Vollständiger Kontenbaum eines Unternehmens mit Hierarchiestruktur",
    companyId: {
      label: "Unternehmens-ID",
      description: "Unternehmen, dessen Kontenplan abgerufen werden soll",
      placeholder: "Unternehmens-UUID eingeben",
    },
    page: {
      label: "Seite",
      description: "Seitennummer (beginnt bei 1)",
    },
    pageSize: {
      label: "Pro Seite",
      description: "Konten pro Seite (max. 200)",
    },
    response: {
      total: "Gesamt",
      accounts: "Konten",
      id: "ID",
      code: "Nr.",
      name: "Bezeichnung",
      type: "Typ",
      subtype: "Untertyp",
      parentId: "Übergeordnetes Konto",
      isPostable: "Buchbar",
      isActive: "Aktiv",
      isSystem: "Systemkonto",
      description: "Beschreibung",
      sortOrder: "Reihenfolge",
      companyId: "Unternehmens-ID",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Konten anzuzeigen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Unternehmens-ID",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Sie haben keinen Zugriff auf die Konten dieses Unternehmens",
      },
      server: {
        title: "Serverfehler",
        description: "Konten konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Konten für dieses Unternehmen gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Konten geladen",
      description: "Kontenplan erfolgreich abgerufen",
    },
    widget: {
      loading: "Konten werden geladen...",
      empty:
        "Noch keine Konten. Einrichtung ausführen, um aus einer Vorlage zu laden.",
      createButton: "Neues Konto",
      inactive: "Inaktiv",
      setupButton: "Einrichtung starten",
      selectCompany: "Unternehmens-ID eingeben, um Konten anzuzeigen",
      back: "Zurück",
    },
  },
  enums: {
    accountType: {
      ASSET: "Aktiva",
      LIABILITY: "Passiva",
      EQUITY: "Eigenkapital",
      REVENUE: "Ertrag",
      EXPENSE: "Aufwand",
    },
    accountSubtype: {
      CURRENT_ASSET: "Umlaufvermögen",
      FIXED_ASSET: "Anlagevermögen",
      BANK: "Bankkonto",
      CASH: "Kasse",
      ACCOUNTS_RECEIVABLE: "Forderungen aus L&L",
      INVENTORY: "Vorräte",
      PREPAID: "Vorauszahlungen",
      ACCOUNTS_PAYABLE: "Verbindlichkeiten aus L&L",
      VAT_PAYABLE: "Umsatzsteuer",
      VAT_RECEIVABLE: "Vorsteuer",
      ACCRUED_LIABILITY: "Rückstellungen",
      SHORT_TERM_DEBT: "Kurzfristige Verbindlichkeiten",
      LONG_TERM_DEBT: "Langfristige Verbindlichkeiten",
      SHARE_CAPITAL: "Stammkapital",
      RETAINED_EARNINGS: "Gewinnvortrag",
      REVENUE_SALES: "Umsatzerlöse",
      REVENUE_SERVICE: "Dienstleistungserlöse",
      COGS: "Wareneinsatz",
      PAYROLL: "Personalaufwand",
      RENT: "Mietaufwand",
      UTILITIES: "Energieaufwand",
      OPEX: "Betriebliche Aufwendungen",
      FINANCIAL_INCOME: "Finanzerträge",
      FINANCIAL_EXPENSE: "Finanzaufwendungen",
      TAX_EXPENSE: "Steueraufwand",
      OTHER: "Sonstige",
    },
  },
  title: "Kontenliste",
  description: "Alle Konten im Kontenplan auflisten",
  category: "Kontenplan",
  tag: "Konto",
};

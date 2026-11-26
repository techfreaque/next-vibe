import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Steuer",
  endpointCategories: {
    tax: "Steuer",
    taxRates: "Steuersätze",
    taxReports: "Steuerberichte",
  },

  rate: {
    details: "Angaben zum Steuersatz",
    create: {
      title: "Steuersatz anlegen",
      titleShort: "Steuersatz erstellen",
      description: "Einen Steuersatz für Ihr Unternehmen hinzufügen",
      widget: {
        save: "Steuersatz anlegen",
        backToList: "Zurück zu Steuersätzen",
      },
      companyId: {
        label: "Unternehmen",
        description: "Das Unternehmen, dem dieser Steuersatz zugeordnet wird",
        placeholder: "Unternehmens-ID",
      },
      name: {
        label: "Name",
        description: "Beschreibender Name des Steuersatzes",
        placeholder: "z.B. MwSt. 20%",
      },
      code: {
        label: "Kürzel",
        description: "Kurzbezeichnung für diesen Steuersatz",
        placeholder: "z.B. AT-USt20",
      },
      type: {
        label: "Steuerart",
        description: "Die Kategorie der Steuer",
        placeholder: "Steuerart auswählen",
      },
      rate: {
        label: "Satz",
        description: "Steuersatz als Dezimalzahl (0,2 = 20%)",
        placeholder: "0.2000",
      },
      country: {
        label: "Land",
        description: "Land, in dem dieser Steuersatz gilt (optional)",
        placeholder: "z.B. AT",
      },
      region: {
        label: "Region",
        description: "Bundesland oder Region (optional)",
        placeholder: "z.B. Wien",
      },
      isDefault: {
        label: "Standardsatz",
        description: "Diesen Satz als Standard für neue Positionen verwenden",
      },
      response: {
        id: "Steuersatz-ID",
        code: "Steuersatz-Kürzel",
        name: "Steuersatz-Name",
      },
      success: {
        title: "Steuersatz angelegt",
        description: "Der Steuersatz wurde Ihrem Unternehmen hinzugefügt",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Bitte prüfen Sie Ihre Eingaben",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Anmeldung erforderlich",
        },
        forbidden: {
          title: "Keine Berechtigung",
          description: "Sie dürfen keine Steuersätze verwalten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Unternehmen nicht gefunden",
        },
        conflict: {
          title: "Kürzel bereits vergeben",
          description: "Ein Steuersatz mit diesem Kürzel existiert bereits",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
    },
    list: {
      title: "Steuersätze",
      titleShort: "Steuersätze",
      description: "Alle konfigurierten Steuersätze Ihres Unternehmens",
      widget: {
        actions: "Aktionen",
        retry: "Erneut versuchen",
        previous: "Zurück",
        next: "Weiter",
        addRate: "Satz hinzufügen",
        labelDefault: "Standard",
        labelActive: "Aktiv",
        labelInactive: "Inaktiv",
        labelEdit: "Bearbeiten",
        labelDelete: "Deaktivieren",
        labelCompound: "Zusammengesetzt",
        empty:
          "Keine Steuersätze konfiguriert. Legen Sie Ihren ersten Satz an.",
        emptySetup:
          "Legen Sie die Steuersätze an, die Ihr Unternehmen für Rechnungen verwendet.",
        columnRate: "Steuersatz",
        columnTypeRateActions: "Typ / Satz / Status",
        backToCatalog: "← Produkte",
      },
      companyId: {
        label: "Unternehmen",
        description: "Unternehmen, dessen Steuersätze angezeigt werden",
        placeholder: "Unternehmens-ID",
      },
      country: {
        label: "Länderfilter",
        description: "Nach Ländercode filtern (optional)",
        placeholder: "z.B. AT",
      },
      type: {
        label: "Typfilter",
        description: "Nach Steuerart filtern (optional)",
        placeholder: "Steuerart auswählen",
      },
      page: {
        label: "Seite",
        description: "Seitennummer (beginnt bei 1)",
      },
      pageSize: {
        label: "Pro Seite",
        description: "Ergebnisse pro Seite (max. 100)",
      },
      response: {
        total: "Gesamt",
        rates: "Steuersätze",
        rate: {
          id: "ID",
          company: "Unternehmen",
          name: "Name",
          code: "Kürzel",
          type: "Typ",
          rate: "Satz",
          country: "Land",
          region: "Region",
          isDefault: "Standard",
          isActive: "Aktiv",
          isCompound: "Zusammengesetzt",
          createdAt: "Erstellt",
          updatedAt: "Geändert",
          validFrom: "Gültig ab",
          validTo: "Gültig bis",
        },
      },
      success: {
        title: "Steuersätze geladen",
        description: "Steuersätze erfolgreich abgerufen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Bitte prüfen Sie Ihre Eingaben",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Anmeldung erforderlich",
        },
        forbidden: {
          title: "Keine Berechtigung",
          description: "Sie dürfen keine Steuersätze einsehen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Unternehmen nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      validOn: {
        label: "Gültig am",
        description: "Nur Sätze zeigen, die an diesem Tag gesetzlich gelten",
      },
    },
    update: {
      title: "Steuersatz bearbeiten",
      titleShort: "Steuersatz ändern",
      description: "Einen bestehenden Steuersatz anpassen",
      widget: {
        save: "Steuersatz speichern",
        backToList: "Zurück zu Steuersätzen",
        failed: "Steuersatz nicht gespeichert",
        subtitle: "{{company}} · {{code}}",
        notFoundTitle: "Diesen Steuersatz gibt es nicht mehr",
        notFoundMessage:
          "Er wurde gelöscht oder gehört zu einem Unternehmen, auf das Sie keinen Zugriff haben. Wählen Sie einen Satz aus der Liste.",
        loadErrorTitle: "Steuersatz konnte nicht geladen werden",
      },
      rateId: {
        label: "Steuersatz-ID",
        description: "ID des zu ändernden Steuersatzes",
        placeholder: "Steuersatz-UUID",
      },
      name: {
        label: "Name",
        description: "Aktualisierter Name des Steuersatzes",
        placeholder: "z.B. MwSt. 20%",
      },
      rate: {
        label: "Satz",
        description: "Aktualisierter Steuersatz als Dezimalzahl (0,2 = 20%)",
        placeholder: "0.2000",
      },
      isDefault: {
        label: "Standardsatz",
        description: "Diesen Satz als Standard für neue Positionen verwenden",
      },
      isActive: {
        label: "Aktiv",
        description: "Ob dieser Steuersatz aktuell aktiv ist",
      },
      response: {
        updated: "Aktualisiert",
      },
      success: {
        title: "Steuersatz aktualisiert",
        description: "Der Steuersatz wurde erfolgreich geändert",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Bitte prüfen Sie Ihre Eingaben",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Anmeldung erforderlich",
        },
        forbidden: {
          title: "Keine Berechtigung",
          description: "Sie dürfen keine Steuersätze verwalten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Steuersatz nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
    },
    delete: {
      title: "Steuersatz deaktivieren",
      titleShort: "Steuersatz löschen",
      description: "Einen Steuersatz deaktivieren",
      widget: {
        backToList: "Zurück zu Steuersätzen",
        warning:
          "Der Steuersatz wird deaktiviert. Diese Aktion kann nicht rückgängig gemacht werden.",
        confirmTitle: "Diesen Steuersatz deaktivieren?",
        confirmDescription:
          "Deaktivierte Sätze können nicht mehr auf Rechnungen angewendet werden. Bestehende Rechnungspositionen bleiben unverändert.",
        confirmButton: "Ja, deaktivieren",
        cancelButton: "Abbrechen",
      },
      rateId: {
        label: "Steuersatz-ID",
        description: "ID des zu deaktivierenden Steuersatzes",
        placeholder: "Steuersatz-UUID",
      },
      response: {
        deleted: "Deaktiviert",
      },
      success: {
        title: "Steuersatz deaktiviert",
        description: "Der Steuersatz wurde erfolgreich deaktiviert",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Bitte prüfen Sie Ihre Eingaben",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Anmeldung erforderlich",
        },
        forbidden: {
          title: "Keine Berechtigung",
          description: "Sie dürfen keine Steuersätze verwalten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Steuersatz nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
    },
  },

  report: {
    title: "Steuern nach Satz",
    titleShort: "Steuern nach Satz",
    description:
      "Prüfen Sie die erfasste Steuer auf Ausgangsrechnungen, Gutschriften, Eingangsrechnungen und Kassenverkäufen.",
    widget: {
      retry: "Bericht erneut laden",
      scope:
        "Für Ausgangsrechnungen gilt das verknüpfte Buchungsdatum oder das Erstellungsdatum. Für Eingangsrechnungen gilt das Belegdatum. Kassenverkäufe zählen am Abschlusstag (UTC), wenn die Position einen positiven Steuersatz oder einen Steuerbetrag hat. Bei einem gemeinsamen Buchungssatz zählt die ausgestellte Rechnung.",
      empty:
        "Hier erscheinen ausgestellte Rechnungen, Gutschriften, Eingangsrechnungen und Kassenverkäufe mit Steuer, gruppiert nach Steuersatz.",
      range: "{{from}} bis {{to}}",
      total: "Summe",
      previousMonth: "Vormonat anzeigen",
      unknownRate: "Steuersatz nicht ermittelbar",
      run: "Bericht erstellen",
      running: "Bericht wird erstellt…",
      scopeHint:
        "Vergleichen Sie die Steuer auf Verkäufe und Einkäufe nach Steuersatz für ein Unternehmen und einen Zeitraum.",
      selectCompany: "Wählen Sie das Unternehmen für diesen Bericht.",
      subtitle: "{{company}} · {{from}} bis {{to}}",
      errorTitle: "Steuerbericht konnte nicht geladen werden",
      emptyTitle: "Keine besteuerten Belege in diesem Zeitraum",
      period: {
        label: "Zeitraum",
        thisMonth: "Dieser Monat",
        lastMonth: "Letzter Monat",
        thisQuarter: "Dieses Quartal",
        thisYear: "Dieses Jahr",
        custom: "Eigener",
      },
      kpi: {
        salesTax: "Steuer auf Verkäufe",
        salesBase: "Steuerpflichtige Umsätze",
        purchaseTax: "Vorsteuer",
        purchaseBase: "Steuerpflichtige Einkäufe",
      },
    },
    currency: {
      label: "Währung",
      placeholder: "Unternehmenswährung",
      description: "Standardmäßig gilt die Unternehmenswährung.",
    },
    currencies: { EUR: "EUR", PLN: "PLN", USD: "USD" },
    companyId: {
      label: "Unternehmen",
      description: "Unternehmen, für das der Bericht erstellt wird",
      placeholder: "Unternehmens-ID",
    },
    dateFrom: {
      label: "Von",
      description: "Startdatum des Berichtszeitraums",
      placeholder: "Anfang dieses Monats",
    },
    dateTo: {
      label: "Bis",
      description: "Enddatum des Berichtszeitraums",
      placeholder: "Heute",
    },
    response: {
      rows: "Berichtszeilen",
      row: {
        direction: "Belegart",
        rate: "Steuersatz",
        taxableAmount: "Steuerbasis",
        taxAmount: "Steuerbetrag",
      },
    },
    success: {
      title: "Steuerbericht erstellt",
      description: "Steuerbericht erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Das Enddatum darf nicht vor dem Startdatum liegen.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Zugriff auf Steuerbericht erforderlich",
        description:
          "Sie haben keine Berechtigung, den Steuerbericht dieses Unternehmens einzusehen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Unternehmen nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
  },

  enums: {
    reportDirection: {
      nonDeductible: "Nicht abzugsfähige Vorsteuer",
      reverseCharge: "Geschuldete Umsatzsteuer nach § 13b",
      posSales: "Kassenverkäufe",
      sales: "Ausgangsrechnungen",
      creditNotes: "Ausgangsgutschriften",
      purchases: "Eingangsrechnungen",
    },
    taxType: {
      vat: "MwSt.",
      gst: "GST",
      sales: "Umsatzsteuer",
      withholding: "Quellensteuer",
      none: "Steuerfrei / Befreit",
    },
  },

  tags: {
    tax: "steuer",
    rate: "steuersatz",
    create: "anlegen",
    list: "liste",
    update: "bearbeiten",
    delete: "deaktivieren",
    report: "bericht",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Steuer",
  endpointCategories: {
    tax: "Steuer",
    taxRates: "Steuersätze",
    taxReports: "Steuerberichte",
  },

  rate: {
    create: {
      title: "Steuersatz anlegen",
      description: "Einen Steuersatz für Ihr Unternehmen hinzufügen",
      widget: {
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
      description: "Alle konfigurierten Steuersätze Ihres Unternehmens",
      widget: {
        addRate: "Satz hinzufügen",
        labelDefault: "Standard",
        labelActive: "Aktiv",
        labelInactive: "Inaktiv",
        labelEdit: "Bearbeiten",
        labelDelete: "Löschen",
        labelCompound: "Zusammengesetzt",
        empty:
          "Keine Steuersätze konfiguriert. Legen Sie Ihren ersten Satz an.",
        emptySetup:
          "Keine Steuersätze angelegt. Jede Rechnung braucht einen Steuersatz — jetzt konfigurieren.",
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
    },
    update: {
      title: "Steuersatz bearbeiten",
      description: "Einen bestehenden Steuersatz anpassen",
      widget: {
        backToList: "Zurück zu Steuersätzen",
        failed: "Fehlgeschlagen",
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
    title: "Steuerbericht",
    description: "Erhobene Steuern nach Satz und Zeitraum",
    widget: {
      columnRate: "Satz",
      total: "Gesamt",
      empty: "Keine Steuerdaten für diesen Zeitraum gefunden.",
    },
    companyId: {
      label: "Unternehmen",
      description: "Unternehmen, für das der Bericht erstellt wird",
      placeholder: "Unternehmens-ID",
    },
    dateFrom: {
      label: "Von",
      description: "Startdatum des Berichtszeitraums",
      placeholder: "2024-01-01",
    },
    dateTo: {
      label: "Bis",
      description: "Enddatum des Berichtszeitraums",
      placeholder: "2024-12-31",
    },
    response: {
      rows: "Berichtszeilen",
      row: {
        taxRateCode: "Steuersatz-Kürzel",
        taxRateName: "Steuersatz-Name",
        taxableAmount: "Steuerbasis",
        taxAmount: "Steuerbetrag",
        period: "Zeitraum",
      },
    },
    success: {
      title: "Steuerbericht erstellt",
      description: "Steuerbericht erfolgreich abgerufen",
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
        description: "Sie dürfen keine Steuerberichte einsehen",
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

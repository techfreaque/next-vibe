export const translations = {
  title: "Journey-Varianten",
  description: "E-Mail-Journey-Varianten-Registrierungen verwalten",
  get: {
    title: "Journey-Varianten",
    description: "Alle registrierten E-Mail-Journey-Varianten anzeigen",
    response: {
      id: "ID",
      variantKey: "Variantenschlüssel",
      displayName: "Anzeigename",
      description: "Beschreibung",
      weight: "Gewichtung",
      active: "Aktiv",
      campaignType: "Kampagnentyp",
      sourceFilePath: "Quelldateipfad",
      checkErrors: "Prüffehler",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      items: "Varianten",
      total: "Gesamte Varianten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin erforderlich",
      },
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      server: {
        title: "Serverfehler",
        description: "Journey-Varianten konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Varianten geladen",
      description: "Journey-Varianten erfolgreich geladen",
    },
  },
  post: {
    title: "Journey-Variante registrieren",
    description: "Neue E-Mail-Journey-Variante registrieren",
    fields: {
      variantKey: {
        label: "Variantenschlüssel",
        description:
          "Eindeutige Kennung (z.B. MY_VARIANT). Muss einem Schlüssel im EmailJourneyVariant-Enum entsprechen.",
      },
      displayName: {
        label: "Anzeigename",
        description: "Menschenlesbarer Name für diese Variante",
      },
      description: {
        label: "Beschreibung",
        description: "Worum es bei dieser Journey geht",
      },
      weight: {
        label: "Gewichtung",
        description:
          "A/B-Test-Gewichtung (1-100). Nur für Cold-Lead-Kampagnen.",
      },
      campaignType: {
        label: "Kampagnentyp",
        description: "Für welchen Kampagnentyp diese Variante ist (optional)",
      },
      sourceFilePath: {
        label: "Quelldateipfad",
        description: "Relativer Pfad zur .email.tsx-Datei",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin erforderlich",
      },
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      server: {
        title: "Serverfehler",
        description: "Journey-Variante konnte nicht registriert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültiger Variantenschlüssel oder Daten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Variantenschlüssel nicht im Enum",
      },
      conflict: {
        title: "Konflikt",
        description: "Variantenschlüssel bereits registriert",
      },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Variante registriert",
      description: "Journey-Variante erfolgreich registriert",
    },
  },
  patch: {
    title: "Journey-Variante aktualisieren",
    description: "Registrierte E-Mail-Journey-Variante aktualisieren",
    fields: {
      id: {
        label: "Varianten-ID",
        description: "ID der zu aktualisierenden Variante",
      },
      active: {
        label: "Aktiv",
        description: "Diese Variante aktivieren oder deaktivieren",
      },
      weight: {
        label: "Gewichtung",
        description: "A/B-Test-Gewichtung (1-100)",
      },
      displayName: {
        label: "Anzeigename",
        description: "Menschenlesbarer Name für diese Variante",
      },
      description: {
        label: "Beschreibung",
        description: "Worum es bei dieser Journey geht",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin erforderlich",
      },
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      server: {
        title: "Serverfehler",
        description: "Journey-Variante konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Aktualisierungsdaten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Variante nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Variante aktualisiert",
      description: "Journey-Variante erfolgreich aktualisiert",
    },
  },
  widget: {
    title: "Journey-Varianten",
    refresh: "Aktualisieren",
    register: "Variante registrieren",
    noVariants: "Noch keine Varianten registriert",
    activeLabel: "Aktiv",
    inactiveLabel: "Inaktiv",
    weightLabel: "Gewichtung",
    campaignTypeLabel: "Kampagnentyp",
    sourceFileLabel: "Quelldatei",
    toggleActivate: "Aktivieren",
    toggleDeactivate: "Deaktivieren",
    checkErrorsLabel: "Prüffehler:",
    unsavedChanges: "ungespeicherte Änderungen",
    saving: "Speichern…",
    saveChanges: "Änderungen speichern",
  },
};

import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Empfehlungs-Dashboard",
    titleShort: "Admin-Referrals",
    description: "Empfehlungscodes, Einnahmen und Auszahlungen",
    form: {
      title: "Empfehlungsverwaltung",
      description: "Empfehlungsprogramm verwalten",
    },
    searchFilters: {
      title: "Suche & Filter",
      description: "Empfehlungsdaten filtern",
    },
    search: {
      label: "Suche",
      description: "Nach E-Mail suchen",
      placeholder: "Empfehlungen suchen...",
    },
    payoutStatus: {
      label: "Auszahlungsstatus",
      description: "Nach Status filtern",
      placeholder: "Beliebig",
    },
    dateFrom: { label: "Von", description: "Startdatum" },
    dateTo: { label: "Bis", description: "Enddatum" },
    sortingOptions: {
      title: "Sortierung",
      description: "Sortierung konfigurieren",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Sortierfeld",
      placeholder: "Feld wählen...",
    },
    sortOrder: {
      label: "Reihenfolge",
      description: "Sortierrichtung",
      placeholder: "Reihenfolge...",
    },
    response: {
      title: "Empfehlungen",
      description: "Empfehlungsprogramm-Daten",
      summary: {
        title: "Zusammenfassung",
        description: "Empfehlungsstatistiken",
        totalCodes: { label: "Codes gesamt" },
        totalSignups: { label: "Anmeldungen" },
        totalEarned: { label: "Verdient" },
        totalPaidOut: { label: "Ausgezahlt" },
        pendingPayouts: { label: "Ausstehend" },
      },
      codes: {
        code: "Code",
        ownerEmail: "Besitzer",
        ownerName: "Name",
        currentUses: "Klicks",
        totalSignups: "Anmeldungen",
        totalEarned: "Verdient",
        isActive: "Aktiv",
        createdAt: "Erstellt",
      },
      payoutRequests: {
        id: "ID",
        userEmail: "Nutzer",
        amountCents: "Betrag",
        currency: "Währung",
        status: "Status",
        walletAddress: "Wallet",
        adminNotes: "Notizen",
        rejectionReason: "Ablehnungsgrund",
        createdAt: "Angefragt",
        processedAt: "Bearbeitet",
      },
      totalCount: "Gesamt",
      pageCount: "Seiten",
    },
    page: { label: "Seite" },
    limit: { label: "Pro Seite" },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Admin-Zugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Empfehlungsdaten konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Empfehlungsdaten gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Empfehlungsdaten abgerufen",
    },
  },
  post: {
    title: "Auszahlungsaktion",
    titleShort: "Auszahlungsaktion",
    description: "Auszahlung genehmigen, ablehnen oder abschließen",
    form: {
      title: "Auszahlungsaktion",
      description: "Auszahlung bearbeiten",
    },
    requestId: {
      label: "Anfrage-ID",
      description: "Zu bearbeitende Auszahlung",
      placeholder: "ID eingeben...",
    },
    action: {
      label: "Aktion",
      description: "Auszuführende Aktion",
      placeholder: "Aktion wählen...",
    },
    adminNotes: {
      label: "Admin-Notizen",
      description: "Optionale Notizen",
      placeholder: "Notizen...",
    },
    rejectionReason: {
      label: "Ablehnungsgrund",
      description: "Pflicht bei Ablehnung",
      placeholder: "Grund eingeben...",
    },
    response: {
      title: "Ergebnis",
      description: "Aktionsergebnis",
      success: "Erfolg",
      message: "Nachricht",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Admin-Zugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Auszahlung konnte nicht bearbeitet werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      conflict: {
        title: "Konflikt",
        description: "Auszahlung bereits bearbeitet",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Auszahlung nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
    },
    success: { title: "Erfolg", description: "Auszahlung bearbeitet" },
  },
  widget: {
    noReferrals: "Keine Empfehlungscodes gefunden.",
    noPayouts: "Keine Auszahlungsanfragen.",
    approve: "Genehmigen",
    reject: "Ablehnen",
    complete: "Abschließen",
    sectionCodes: "Empfehlungscodes",
    sectionPayouts: "Auszahlungsanfragen",
    refresh: "Aktualisieren",
    codeActive: "Aktiv",
    codeInactive: "Inaktiv",
    clicks: "Klicks",
    signups: "Anmeldungen",
    earned: "verdient",
    confirm: {
      title: "Auszahlungsaktion bestätigen",
      description:
        "Sicher, dass du diese Auszahlungsaktion durchführen möchtest? Sie kann nicht rückgängig gemacht werden.",
      cancel: "Abbrechen",
      proceed: "Bestätigen",
    },
  },
  enums: {
    payoutStatusFilter: {
      all: "Alle",
      pending: "Ausstehend",
      approved: "Genehmigt",
      rejected: "Abgelehnt",
      processing: "In Bearbeitung",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
    },
    referralSortField: {
      createdAt: "Erstellt am",
      earnings: "Gesamtverdienst",
      signups: "Anmeldungen",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    payoutAction: {
      approve: "Genehmigen",
      reject: "Ablehnen",
      complete: "Abschließen",
    },
  },
};

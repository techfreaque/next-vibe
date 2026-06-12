import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kassensystem",
  tags: {
    pos: "Kasse",
    terminal: "Terminal",
    session: "Sitzung",
    order: "Bestellung",
    payment: "Zahlung",
    create: "Erstellen",
    list: "Liste",
    get: "Abrufen",
    open: "Öffnen",
    close: "Schließen",
    complete: "Abschließen",
    void: "Stornieren",
    addItem: "Artikel hinzufügen",
    removeItem: "Artikel entfernen",
    addPayment: "Zahlung hinzufügen",
  },
  endpointCategories: {
    pos: "Kassensystem",
    terminals: "Terminals",
    sessions: "Sitzungen",
    orders: "Bestellungen",
  },
  enums: {
    sessionStatus: {
      open: "Offen",
      closed: "Geschlossen",
    },
    orderStatus: {
      open: "Offen",
      completed: "Abgeschlossen",
      voided: "Storniert",
    },
    paymentMethod: {
      cash: "Bargeld",
      card: "Karte",
      transfer: "Überweisung",
      other: "Sonstiges",
    },
  },

  dashboard: {
    get: {
      title: "Kassenübersicht",
      titleShort: "POS-Übersicht",
      description:
        "Überblick über Terminals, offene Sitzungen und Tagesumsatz.",
      widget: {
        loading: "Dashboard wird geladen...",
        loadingHint: "Kassendaten werden abgerufen.",
        kpiTerminals: "Terminals (aktiv / gesamt)",
        kpiOpenSessions: "Offene Sitzungen",
        kpiTodayOrders: "Heutige Bestellungen",
        kpiTodaySales: "Tagesumsatz",
        terminalsHeading: "Terminals",
        refresh: "Aktualisieren",
        openSession: "Sitzung öffnen",
        viewOrders: "Bestellungen",
        viewSession: "Sitzung ansehen",
        allTerminals: "Alle Terminals",
        statusActive: "Aktiv",
        statusInactive: "Inaktiv",
        statusSessionOpen: "Sitzung offen",
        emptyTerminals: "Keine Terminals konfiguriert.",
        emptyTerminalsHint:
          "Wenden Sie sich an Ihren Administrator, um Kasseterminals einzurichten.",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um das Kassendashboard zu öffnen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf Kassendaten",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Dashboard konnte nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Kassendaten gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Dashboard geladen",
        description: "Kassenübersicht abgerufen",
      },
      response: {
        terminalsTotal: "Terminals gesamt",
        terminalsActive: "Aktive Terminals",
        openSessionsCount: "Offene Sitzungen",
        todayOrderCount: "Heutige Bestellungen",
        todaySalesTotal: "Tagesumsatz",
        currency: "Währung",
        terminalId: "Terminal-ID",
        terminalName: "Terminalname",
        terminalLocation: "Standort",
        terminalCurrency: "Währung",
        terminalIsActive: "Aktiv",
        terminalHasOpenSession: "Sitzung offen",
        terminalOpenSessionId: "Offene Sitzungs-ID",
      },
    },
  },

  terminalCreate: {
    post: {
      title: "Terminal erstellen",
      titleShort: "Terminal erstellen",
      description: "Neues Kasseterminal für ein Unternehmen anlegen.",
      widget: {
        backToList: "Zurück zur Terminalliste",
        active: "Aktiv",
        inactive: "Inaktiv",
        openSession: "Sitzung öffnen",
      },
      companyId: {
        label: "Unternehmens-ID",
        description: "Zugehöriges Unternehmen",
      },
      name: {
        label: "Terminalname",
        description: "Name des Terminals",
        placeholder: "Hauptkasse",
      },
      location: {
        label: "Standort",
        description: "Physischer Standort des Terminals",
        placeholder: "Empfang",
      },
      currency: {
        label: "Währung",
        description: "Standardwährung (ISO 4217)",
        placeholder: "EUR",
      },
      cashAccountNodeId: {
        label: "Bargeld-Konto",
        description: "Kontoknotenreferenz für die Kasse",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Terminals zu erstellen",
        },
        forbidden: {
          title: "Adminrechte erforderlich",
          description: "Nur Admins können Terminals erstellen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Terminal mit diesem Namen existiert bereits",
        },
        server: {
          title: "Serverfehler",
          description:
            "Terminal konnte nicht erstellt werden — erneut versuchen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Terminal erstellt",
        description: "Terminal erfolgreich angelegt",
      },
      response: {
        id: "Terminal-ID",
        name: "Terminalname",
        companyId: "Unternehmens-ID",
        currency: "Währung",
        isActive: "Aktiv",
      },
    },
  },

  terminalList: {
    get: {
      title: "Terminals",
      titleShort: "Terminals",
      description: "Alle Terminals eines Unternehmens auflisten.",
      widget: {
        active: "Aktiv",
        inactive: "Inaktiv",
        total: "Terminals",
        createTerminal: "Neues Terminal",
        empty: "Keine Terminals konfiguriert.",
        emptyHint:
          "Terminals sind die Registrierkassen in Ihrem Geschäft. Wenden Sie sich an Ihren Administrator.",
        emptyContact: "Administrator kontaktieren",
        openSession: "Sitzung öffnen",
        selectCompany: "Terminals werden geladen...",
        selectCompanyHint: "Deine Terminals werden abgerufen.",
        loading: "Terminals werden geladen...",
        loadingHint: "Deine Terminals werden abgerufen.",
        refresh: "Aktualisieren",
        back: "Zurück",
      },
      companyId: {
        label: "Unternehmens-ID",
        description: "Unternehmen, dessen Terminals aufgelistet werden",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Terminals anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Terminals konnten nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Unternehmen nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Terminals geladen",
        description: "Terminalliste abgerufen",
      },
      response: {
        id: "Terminal-ID",
        name: "Terminalname",
        location: "Standort",
        currency: "Währung",
        isActive: "Aktiv",
        createdAt: "Erstellt am",
      },
    },
  },

  sessionOpen: {
    post: {
      title: "Sitzung öffnen",
      titleShort: "Sitzung öffnen",
      description: "Kassensitzung an einem Terminal starten.",
      widget: {
        viewOrders: "Bestellungen anzeigen",
        backToTerminals: "Zurück zu Terminals",
        selectTerminal: "Terminal bereit",
        selectTerminalHint: "Startbetrag festlegen und Sitzung öffnen.",
        terminal: "Terminal",
        readyToOpen: "Bereit",
        floatHint: "Bargeld in der Kasse vor dem Öffnen zählen.",
        startOrders: "Bestellungen aufnehmen",
      },
      terminalId: {
        label: "Terminal-ID",
        description: "Terminal, an dem die Sitzung geöffnet wird",
      },
      openingFloat: {
        label: "Öffnungsbestand",
        description: "Bargeld in der Kasse zu Sitzungsbeginn",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um eine Sitzung zu öffnen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Terminal",
        },
        conflict: {
          title: "Sitzung bereits offen",
          description: "Dieses Terminal hat bereits eine offene Sitzung",
        },
        server: {
          title: "Serverfehler",
          description: "Sitzung konnte nicht geöffnet werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Terminal nicht gefunden",
          description: "Terminal existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Sitzung geöffnet",
        description: "Sitzung erfolgreich gestartet",
      },
      response: {
        id: "Sitzungs-ID",
        terminalId: "Terminal-ID",
        openedAt: "Geöffnet am",
        status: "Status",
        openingFloat: "Öffnungsbestand",
      },
    },
  },

  sessionClose: {
    post: {
      title: "Sitzung schließen",
      titleShort: "Sitzung schließen",
      description: "Kassensitzung schließen und Abschlussbestand erfassen.",
      widget: {
        backToTerminals: "Zurück zu Terminals",
        sessionSummary: "Sitzungsübersicht",
        terminal: "Terminal",
        openedAt: "Geöffnet um",
        orderCount: "Bestellungen",
        sessionRevenue: "Umsatz",
        floatHint: "Bargeld in der Kasse vor dem Schließen zählen.",
        reconciliation: "Tagesabschluss",
        sessionReady: "Sitzung",
        active: "Aktiv",
        openingFloat: "Öffnungsbestand",
        cashSales: "Barverkäufe",
        expectedClosingFloat: "Erwarteter Abschlussbestand",
        actualClosingFloat: "Tatsächlicher Abschlussbestand",
        variance: "Differenz",
        reconciliationTitle: "Kassenabschluss",
      },
      sessionId: {
        label: "Sitzungs-ID",
        description: "Zu schließende Sitzung",
      },
      closingFloat: {
        label: "Abschlussbestand",
        description: "Gezähltes Bargeld beim Abschluss",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um eine Sitzung zu schließen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Sie können nur Ihre eigene Sitzung schließen",
        },
        conflict: {
          title: "Sitzung bereits geschlossen",
          description: "Diese Sitzung ist bereits geschlossen",
        },
        server: {
          title: "Serverfehler",
          description: "Sitzung konnte nicht geschlossen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Sitzung nicht gefunden",
          description: "Sitzung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Sitzung geschlossen",
        description: "Sitzung erfolgreich geschlossen",
      },
      response: {
        id: "Sitzungs-ID",
        status: "Status",
        closedAt: "Geschlossen am",
        closingFloat: "Abschlussbestand",
        expectedFloat: "Erwarteter Bestand",
        cashSalesTotal: "Barverkäufe",
        variance: "Differenz",
        orderCount: "Bestellanzahl",
      },
    },
  },

  sessionGet: {
    get: {
      title: "Sitzung abrufen",
      titleShort: "Sitzungsdetails",
      description: "Details einer bestimmten Sitzung abrufen.",
      widget: {
        viewOrders: "Bestellungen anzeigen",
        closeSession: "Sitzung schließen",
        newOrder: "Neue Bestellung",
        sessionDetails: "Sitzungsdetails",
        loading: "Sitzung wird geladen...",
        back: "Zurück",
      },
      sessionId: { label: "Sitzungs-ID", description: "Abzurufende Sitzung" },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Sitzungs-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Sitzungen anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Sitzung",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Sitzung konnte nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Sitzung nicht gefunden",
          description: "Sitzung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Sitzung geladen",
        description: "Sitzungsdetails abgerufen",
      },
      response: {
        id: "Sitzungs-ID",
        terminalId: "Terminal-ID",
        cashierUserId: "Kassierer",
        status: "Status",
        openedAt: "Geöffnet am",
        closedAt: "Geschlossen am",
        openingFloat: "Öffnungsbestand",
        closingFloat: "Abschlussbestand",
      },
    },
  },

  orderCreate: {
    post: {
      title: "Bestellung erstellen",
      titleShort: "Auftrag erstellen",
      description: "Neue Bestellung in einer offenen Sitzung erstellen.",
      widget: {
        addItem: "Artikel hinzufügen",
        viewOrder: "Bestellung anzeigen",
        creating: "Bestellung wird geöffnet...",
        back: "Zurück",
      },
      sessionId: {
        label: "Sitzungs-ID",
        description: "Sitzung, in der die Bestellung erstellt wird",
      },
      customerId: {
        label: "Kunden-ID",
        description: "Optionale Kundenreferenz",
      },
      currency: {
        label: "Währung",
        description: "Bestellungswährung",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Bestellungen zu erstellen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Sitzung",
        },
        conflict: {
          title: "Sitzung geschlossen",
          description:
            "In geschlossener Sitzung können keine Bestellungen erstellt werden",
        },
        server: {
          title: "Serverfehler",
          description: "Bestellung konnte nicht erstellt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Sitzung nicht gefunden",
          description: "Sitzung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung erstellt",
        description: "Bestellung erfolgreich erstellt",
      },
      response: {
        id: "Bestellungs-ID",
        orderNumber: "Bestellnummer",
        sessionId: "Sitzungs-ID",
        status: "Status",
        currency: "Währung",
        total: "Gesamt",
      },
    },
  },

  orderAddItem: {
    post: {
      title: "Artikel hinzufügen",
      titleShort: "Artikel hinzufügen",
      description: "Artikel zu einer offenen Bestellung hinzufügen.",
      widget: {
        backToOrder: "Zurück zur Bestellung",
        linePreview: "Zeilensumme",
        taxNote: "inkl. Steuer",
        multiplier: "×",
        addAnother: "Weiteren Artikel hinzufügen",
        searchProduct: "Produktkatalog durchsuchen",
        searchPlaceholder: "Name oder Artikel-Nr…",
        orManual: "Oder manuell eingeben",
        selectedProduct: "Ausgewähltes Produkt",
        clearProduct: "Löschen",
        searchButton: "Suchen",
        noProductResults: "Keine Treffer — unten manuell eingeben.",
      },
      orderId: {
        label: "Bestellungs-ID",
        description: "Bestellung, zu der der Artikel hinzugefügt wird",
      },
      productId: {
        label: "Produkt-ID",
        description: "Optionale Produktreferenz",
      },
      itemDescription: {
        label: "Beschreibung",
        description: "Artikelbeschreibung",
        placeholder: "Kaffee",
      },
      quantity: { label: "Menge", description: "Menge", placeholder: "1" },
      unitPrice: {
        label: "Einzelpreis",
        description: "Preis pro Einheit",
        placeholder: "3,50",
      },
      taxRate: {
        label: "Steuersatz",
        description: "Steuersatz als Dezimalzahl (z. B. 0,2 für 20 %)",
        placeholder: "0,20",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Artikel hinzuzufügen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Bestellung nicht offen",
          description:
            "Artikel können nur zu offenen Bestellungen hinzugefügt werden",
        },
        server: {
          title: "Serverfehler",
          description: "Artikel konnte nicht hinzugefügt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Bestellung nicht gefunden",
          description: "Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Artikel hinzugefügt",
        description: "Artikel zur Bestellung hinzugefügt",
      },
      response: {
        id: "Artikel-ID",
        description: "Beschreibung",
        quantity: "Menge",
        unitPrice: "Einzelpreis",
        taxAmount: "Steuerbetrag",
        lineTotal: "Zeilensumme",
        orderTotal: "Bestellsumme",
      },
    },
  },

  orderRemoveItem: {
    post: {
      title: "Artikel entfernen",
      titleShort: "Artikel entfernen",
      description: "Artikel aus einer offenen Bestellung entfernen.",
      widget: {
        backToOrder: "Zurück zur Bestellung",
      },
      orderId: {
        label: "Bestellungs-ID",
        description: "Bestellung, aus der der Artikel entfernt wird",
      },
      itemId: { label: "Artikel-ID", description: "Zu entfernender Artikel" },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Artikel zu entfernen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Bestellung nicht offen",
          description:
            "Artikel können nur aus offenen Bestellungen entfernt werden",
        },
        server: {
          title: "Serverfehler",
          description: "Artikel konnte nicht entfernt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Bestellung oder Artikel nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Artikel entfernt",
        description: "Artikel aus der Bestellung entfernt",
      },
      response: {
        orderId: "Bestellungs-ID",
        orderTotal: "Aktualisierte Summe",
      },
    },
  },

  orderComplete: {
    post: {
      title: "Bestellung abschließen",
      titleShort: "Auftrag abschließen",
      description:
        "Bestellung abschließen. Prüft Vollzahlung und bucht Buchungssatz.",
      widget: {
        backToList: "Zurück zur Bestellliste",
        confirmTitle: "Bestellung abschließen?",
        confirmHint:
          "Nicht rückgängig machbar. Alle Zahlungen müssen eingegangen sein.",
        orderNumber: "Bestellung",
        cancel: "Abbrechen",
      },
      orderId: {
        label: "Bestellungs-ID",
        description: "Abzuschließende Bestellung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bestellungs-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Bestellungen abzuschließen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Offener Betrag",
          description: "Zahlungen decken den Gesamtbetrag nicht",
        },
        server: {
          title: "Serverfehler",
          description: "Bestellung konnte nicht abgeschlossen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Bestellung nicht gefunden",
          description: "Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung abgeschlossen",
        description: "Bestellung abgeschlossen und Buchungssatz gebucht",
      },
      response: {
        id: "Bestellungs-ID",
        status: "Status",
        total: "Gesamt",
        journalEntryId: "Buchungssatz-ID",
      },
    },
  },

  orderVoid: {
    post: {
      title: "Bestellung stornieren",
      titleShort: "Auftrag stornieren",
      description: "Offene Bestellung stornieren. Nicht rückgängig zu machen.",
      widget: {
        backToList: "Zurück zur Bestellliste",
      },
      orderId: {
        label: "Bestellungs-ID",
        description: "Zu stornierende Bestellung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bestellungs-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Bestellungen zu stornieren",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Bestellung nicht offen",
          description: "Nur offene Bestellungen können storniert werden",
        },
        server: {
          title: "Serverfehler",
          description: "Bestellung konnte nicht storniert werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Bestellung nicht gefunden",
          description: "Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung storniert",
        description: "Bestellung wurde storniert",
      },
      response: {
        id: "Bestellungs-ID",
        status: "Status",
      },
    },
  },

  orderGet: {
    get: {
      title: "Auftrag abrufen",
      titleShort: "Auftragsdetails",
      description: "Einen Auftrag mit Positionen und Zahlungen abrufen.",
      widget: {
        addItem: "Artikel hinzufügen",
        addPayment: "Zahlung hinzufügen",
        complete: "Bestellung abschließen",
        void: "Bestellung stornieren",
        back: "Zurück",
        outstanding: "Offen",
        fullyPaid: "Vollständig bezahlt",
        qtyTimesPrice: "×",
        loading: "Auftrag wird geladen...",
        noItems: "Noch keine Artikel — ersten Artikel hinzufügen.",
        viewJournalEntry: "Buchungssatz ansehen",
        voidedStamp: "STORNIERT",
        completedReadOnly:
          "Diese Bestellung ist abgeschlossen und kann nicht geändert werden.",
        select: "Bestellung auswählen",
      },
      orderId: { label: "Auftrags-ID", description: "Abzurufender Auftrag" },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Auftrags-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Aufträge anzuzeigen",
        },
        forbidden: {
          title: "Kein Zugriff",
          description: "Kein Zugriff auf diesen Auftrag",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Auftrag konnte nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Auftrag nicht gefunden",
          description: "Auftrag existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Auftrag geladen",
        description: "Auftragsdetails abgerufen",
      },
      response: {
        id: "Auftrags-ID",
        orderNumber: "Auftragsnummer",
        sessionId: "Sitzungs-ID",
        customerId: "Kunden-ID",
        status: "Status",
        currency: "Währung",
        subtotal: "Zwischensumme",
        taxAmount: "Steuer",
        total: "Gesamtbetrag",
        journalEntryId: "Buchungssatz-ID",
        createdAt: "Erstellt am",
        items: "Positionen",
        itemId: "Positions-ID",
        productId: "Produkt-ID",
        description: "Beschreibung",
        quantity: "Menge",
        unitPrice: "Einzelpreis",
        taxRate: "Steuersatz",
        taxAmountItem: "Steuer",
        lineTotal: "Zeilensumme",
        payments: "Zahlungen",
        paymentId: "Zahlungs-ID",
        method: "Methode",
        amount: "Betrag",
        change: "Wechselgeld",
        reference: "Referenz",
      },
    },
  },

  orderList: {
    get: {
      title: "Aufträge",
      titleShort: "Aufträge",
      description:
        "Aufträge einer Sitzung mit optionalem Statusfilter auflisten.",
      widget: {
        newOrder: "Neue Bestellung",
        empty: "Noch keine Bestellungen in dieser Sitzung.",
        emptyHint: "Neue Bestellung starten, um zu verkaufen.",
        back: "Zurück",
        backToTerminals: "Zurück zu Terminals",
        selectSession: "Sitzung auswählen",
        selectSessionHint: "Sitzungs-ID eingeben, um Bestellungen anzuzeigen.",
        sessionTotal: "Sitzungsgesamtbetrag",
        filterAll: "Alle",
        loading: "Bestellungen werden geladen...",
        ordersTotal: "Bestellungen",
        tapToView: "antippen zum Öffnen",
      },
      sessionId: {
        label: "Sitzungs-ID",
        description: "Sitzung, deren Aufträge aufgelistet werden",
      },
      status: {
        label: "Status",
        description: "Nach Auftragsstatus filtern",
        placeholder: "Alle Status",
      },
      page: { label: "Seite", description: "Seitennummer (beginnt bei 1)" },
      pageSize: {
        label: "Pro Seite",
        description: "Ergebnisse pro Seite (max. 100)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Aufträge aufzulisten",
        },
        forbidden: {
          title: "Kein Zugriff",
          description: "Kein Zugriff auf diese Sitzung",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Aufträge konnten nicht aufgelistet werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Sitzung nicht gefunden",
          description: "Sitzung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Aufträge geladen",
        description: "Auftragsliste abgerufen",
      },
      response: {
        count: "Gesamt",
        id: "Auftrags-ID",
        orderNumber: "Auftragsnummer",
        sessionId: "Sitzungs-ID",
        status: "Status",
        currency: "Währung",
        total: "Gesamtbetrag",
        createdAt: "Erstellt am",
      },
    },
  },

  productLookup: {
    get: {
      title: "Produktsuche",
      titleShort: "Produktsuche",
      description:
        "Katalogprodukte nach Name oder Artikel-Nr. für die Kasse suchen.",
      widget: {
        noResults: "Keine Produkte gefunden — andere Suche versuchen.",
        tax: "Steuer",
        back: "Zurück",
      },
      companyId: {
        label: "Unternehmens-ID",
        description: "Suche auf ein bestimmtes Unternehmen beschränken",
      },
      query: {
        label: "Suche",
        description: "Nach Produktname oder Artikel-Nr. suchen",
        placeholder: "Kaffee, BEV-001…",
      },
      page: { label: "Seite", description: "Seitennummer (beginnt bei 1)" },
      pageSize: {
        label: "Pro Seite",
        description: "Ergebnisse pro Seite (max. 50)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Mindestens ein Zeichen für die Suche eingeben",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Produkte zu suchen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Produktsuche fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Produkte gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Produkte gefunden",
        description: "Passende Produkte abgerufen",
      },
      response: {
        id: "Produkt-ID",
        name: "Name",
        sku: "Artikel-Nr.",
        type: "Typ",
        basePrice: "Preis",
        currency: "Währung",
        defaultTaxRate: "Steuersatz",
        unit: "Einheit",
      },
    },
  },

  orderAddPayment: {
    post: {
      title: "Zahlung hinzufügen",
      titleShort: "Zahlung hinzufügen",
      description: "Zahlung für eine offene Bestellung erfassen.",
      widget: {
        fullyPaid: "Vollständig bezahlt",
        backToOrder: "Zurück zur Bestellung",
        amountDue: "Fälliger Betrag",
        changeLabel: "Wechselgeld",
        changeHint: "An Kunden zurückgeben",
        addAnotherPayment: "Weitere Zahlung hinzufügen",
      },
      orderId: {
        label: "Bestellungs-ID",
        description: "Zu zahlende Bestellung",
      },
      method: {
        label: "Zahlungsmethode",
        description: "Wie der Kunde zahlt",
        placeholder: "Methode auswählen",
      },
      amount: {
        label: "Betrag",
        description: "Geleisteter Betrag",
        placeholder: "0,00",
      },
      change: {
        label: "Rückgeld",
        description: "Rückgeld an den Kunden",
        placeholder: "0,00",
      },
      reference: {
        label: "Referenz",
        description: "Kartenautorisierungscode oder Überweisungsreferenz",
      },
      accountNodeId: {
        label: "Kontoknotenreferenz",
        description: "Empfangskonto (überschreibt Terminalstandard)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Zahlungen hinzuzufügen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Bestellung nicht offen",
          description:
            "Zahlungen können nur offenen Bestellungen hinzugefügt werden",
        },
        server: {
          title: "Serverfehler",
          description: "Zahlung konnte nicht erfasst werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
        },
        notFound: {
          title: "Bestellung nicht gefunden",
          description: "Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Zahlung erfasst",
        description: "Zahlung für Bestellung erfasst",
      },
      response: {
        id: "Zahlungs-ID",
        method: "Methode",
        amount: "Betrag",
        change: "Rückgeld",
        totalPaid: "Gesamt bezahlt",
        outstanding: "Offen",
      },
    },
  },
};

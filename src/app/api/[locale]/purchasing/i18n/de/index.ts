import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Einkauf",
  tags: {
    purchasing: "Einkauf",
    vendor: "Lieferant",
    order: "Bestellung",
    receipt: "Wareneingang",
    create: "Erstellen",
    list: "Liste",
    get: "Abrufen",
    update: "Aktualisieren",
    deactivate: "Deaktivieren",
    send: "Senden",
    confirm: "Bestätigen",
    receive: "Annehmen",
    cancel: "Stornieren",
    convertToBill: "In Rechnung umwandeln",
    addLine: "Position hinzufügen",
    removeLine: "Position entfernen",
  },
  endpointCategories: {
    purchasing: "Einkauf",
    vendors: "Lieferanten",
    purchaseOrders: "Bestellungen",
    purchasingOrders: "Bestellungen",
    purchasingVendors: "Lieferanten",
  },
  enums: {
    poStatus: {
      draft: "Entwurf",
      sent: "Gesendet",
      confirmed: "Bestätigt",
      partiallyReceived: "Teilweise eingegangen",
      received: "Vollständig eingegangen",
      billed: "Abgerechnet",
      cancelled: "Storniert",
    },
  },

  vendorCreate: {
    post: {
      title: "Lieferant anlegen",
      description: "Neuen Lieferanten für Ihr Unternehmen registrieren.",
      widget: {
        back: "Zurück",
        viewVendor: "Lieferant öffnen",
        createAnother: "Weiteren anlegen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Alle Felder prüfen und erneut versuchen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Lieferanten anzulegen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Mitglieder-Rolle oder höher erforderlich",
        },
        conflict: {
          title: "Code bereits vergeben",
          description: "Ein Lieferant mit diesem Code existiert bereits",
        },
        server: {
          title: "Serverfehler",
          description:
            "Lieferant konnte nicht erstellt werden — erneut versuchen",
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
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Lieferant angelegt",
        description: "Lieferant erfolgreich registriert",
      },
      response: {
        id: "Lieferanten-ID",
        name: "Name",
        code: "Code",
        email: "E-Mail",
        isActive: "Aktiv",
        createdAt: "Erstellt",
      },
    },
    companyId: {
      label: "Unternehmen",
      description: "Unternehmen, dem dieser Lieferant zugeordnet ist",
      placeholder: "Unternehmens-UUID",
    },
    name: {
      label: "Lieferantenname",
      description: "Offizieller Name des Lieferanten",
      placeholder: "Acme GmbH",
    },
    code: {
      label: "Code",
      description: "Kurzes internes Kürzel (optional)",
      placeholder: "ACM-001",
    },
    email: {
      label: "E-Mail",
      description: "Kontakt-E-Mail des Lieferanten",
      placeholder: "bestellungen@acme.de",
    },
    phone: {
      label: "Telefon",
      description: "Telefonnummer des Lieferanten",
      placeholder: "+49 30 12345678",
    },
    website: {
      label: "Webseite",
      description: "Webseite des Lieferanten",
      placeholder: "https://acme.de",
    },
    vatNumber: {
      label: "USt-IdNr.",
      description: "Umsatzsteuer-Identifikationsnummer",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "Steuernummer",
      description: "Steuernummer des Lieferanten",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "Adresszeile 1",
      description: "Straße und Hausnummer",
      placeholder: "Musterstraße 1",
    },
    addressLine2: {
      label: "Adresszeile 2",
      description: "Etage, Büro usw.",
      placeholder: "2. OG",
    },
    city: { label: "Stadt", description: "Stadt", placeholder: "Berlin" },
    region: {
      label: "Bundesland",
      description: "Bundesland oder Region",
      placeholder: "Berlin",
    },
    postalCode: {
      label: "PLZ",
      description: "Postleitzahl",
      placeholder: "10115",
    },
    country: {
      label: "Land",
      description: "Länderkürzel (ISO 3166-1 alpha-2)",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "Standardwährung",
      description: "Währung für Bestellungen bei diesem Lieferanten",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "Zahlungsziel (Tage)",
      description: "Standard-Zahlungsziel in Tagen",
      placeholder: "30",
    },
    notes: {
      label: "Notizen",
      description: "Interne Notizen zu diesem Lieferanten",
      placeholder: "Bevorzugter Elektronikhändler",
    },
  },

  vendorList: {
    get: {
      title: "Lieferanten auflisten",
      description: "Alle Lieferanten eines Unternehmens anzeigen.",
      widget: {
        back: "Zurück",
        active: "Aktiv",
        inactive: "Inaktiv",
        total: "gesamt",
        createVendor: "Neuer Lieferant",
        empty: "Keine Lieferanten vorhanden. Jetzt einen hinzufügen.",
        vatLabel: "USt-IdNr.",
        vatPrefix: "USt:",
        paymentTerms: "Zahlungsziel {{days}} Tage",
        paymentTermsPrefix: "Netto",
        paymentTermsSuffix: "T",
        loading: "Wird geladen…",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Lieferanten anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lieferanten konnten nicht geladen werden",
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
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Lieferanten geladen",
        description: "Lieferantenliste abgerufen",
      },
      response: {
        id: "Lieferanten-ID",
        name: "Name",
        code: "Code",
        email: "E-Mail",
        vatNumber: "USt-IdNr.",
        defaultCurrency: "Währung",
        defaultPaymentTermsDays: "Zahlungsziel",
        isActive: "Aktiv",
        createdAt: "Erstellt",
      },
    },
    companyId: {
      label: "Unternehmen",
      description: "Unternehmen, dessen Lieferanten angezeigt werden sollen",
    },
  },

  vendorGet: {
    get: {
      title: "Lieferant abrufen",
      description: "Vollständige Details eines Lieferanten abrufen.",
      widget: {
        back: "Zurück",
        edit: "Lieferant bearbeiten",
        createOrder: "Neue Bestellung",
        viewOrders: "Bestellungen anzeigen",
        deactivate: "Deaktivieren",
        select: "Lieferant auswählen",
      },
      vendorId: {
        label: "Lieferanten-ID",
        description: "Abzurufender Lieferant",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Lieferanten-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Lieferanten anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diesen Lieferanten",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lieferant konnte nicht geladen werden",
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
          title: "Lieferant nicht gefunden",
          description: "Dieser Lieferant existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Lieferant geladen",
        description: "Lieferantendaten abgerufen",
      },
      response: {
        id: "Lieferanten-ID",
        companyId: "Unternehmens-ID",
        name: "Name",
        code: "Code",
        email: "E-Mail",
        phone: "Telefon",
        website: "Webseite",
        vatNumber: "USt-IdNr.",
        taxId: "Steuernummer",
        addressLine1: "Adresse",
        addressLine2: "Adresszeile 2",
        city: "Stadt",
        region: "Bundesland",
        postalCode: "PLZ",
        country: "Land",
        defaultCurrency: "Standardwährung",
        defaultPaymentTermsDays: "Zahlungsziel (Tage)",
        isActive: "Aktiv",
        notes: "Notizen",
        createdAt: "Erstellt",
        updatedAt: "Aktualisiert",
      },
    },
  },

  vendorUpdate: {
    patch: {
      title: "Lieferant aktualisieren",
      description: "Lieferantendaten bearbeiten.",
      widget: {
        backToVendor: "Zurück zum Lieferanten",
        viewVendor: "Lieferant anzeigen",
      },
      vendorId: {
        label: "Lieferanten-ID",
        description: "Zu bearbeitender Lieferant",
      },
      name: {
        label: "Lieferantenname",
        description: "Offizieller Name des Lieferanten",
        placeholder: "Acme GmbH",
      },
      code: {
        label: "Code",
        description: "Kurzes internes Kürzel",
        placeholder: "ACM-001",
      },
      email: {
        label: "E-Mail",
        description: "Kontakt-E-Mail",
        placeholder: "bestellungen@acme.de",
      },
      phone: {
        label: "Telefon",
        description: "Telefonnummer",
        placeholder: "+49 30 12345678",
      },
      website: {
        label: "Webseite",
        description: "Webseite des Lieferanten",
        placeholder: "https://acme.de",
      },
      vatNumber: {
        label: "USt-IdNr.",
        description: "Umsatzsteuer-Identifikationsnummer",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Steuernummer",
        description: "Steuernummer",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "Adresszeile 1",
        description: "Straße und Hausnummer",
        placeholder: "Musterstraße 1",
      },
      addressLine2: {
        label: "Adresszeile 2",
        description: "Etage, Büro usw.",
        placeholder: "2. OG",
      },
      city: { label: "Stadt", description: "Stadt", placeholder: "Berlin" },
      region: {
        label: "Bundesland",
        description: "Bundesland oder Region",
        placeholder: "Berlin",
      },
      postalCode: {
        label: "PLZ",
        description: "Postleitzahl",
        placeholder: "10115",
      },
      country: {
        label: "Land",
        description: "Länderkürzel",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "Standardwährung",
        description: "Währung für Bestellungen",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "Zahlungsziel (Tage)",
        description: "Standard-Zahlungsziel",
        placeholder: "30",
      },
      notes: {
        label: "Notizen",
        description: "Interne Notizen",
        placeholder: "Bevorzugter Lieferant",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Lieferanten zu bearbeiten",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diesen Lieferanten",
        },
        conflict: {
          title: "Code-Konflikt",
          description: "Dieser Lieferantencode ist bereits vergeben",
        },
        server: {
          title: "Serverfehler",
          description: "Lieferant konnte nicht aktualisiert werden",
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
          title: "Lieferant nicht gefunden",
          description: "Dieser Lieferant existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Lieferant aktualisiert",
        description: "Lieferant erfolgreich gespeichert",
      },
      response: {
        id: "Lieferanten-ID",
        name: "Name",
        isActive: "Aktiv",
        updatedAt: "Aktualisiert",
      },
    },
  },

  vendorDeactivate: {
    post: {
      title: "Lieferant deaktivieren",
      description:
        "Lieferant als inaktiv markieren. Bestehende Bestellungen bleiben unverändert.",
      vendorId: {
        label: "Lieferanten-ID",
        description: "Zu deaktivierender Lieferant",
      },
      widget: {
        warning:
          "Lieferant wird deaktiviert. Bestehende Bestellungen bleiben unverändert.",
        backToList: "Zurück zu Lieferanten",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Lieferanten-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Lieferanten zu deaktivieren",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diesen Lieferanten",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lieferant konnte nicht deaktiviert werden",
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
          title: "Lieferant nicht gefunden",
          description: "Dieser Lieferant existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Lieferant deaktiviert",
        description: "Lieferant ist jetzt inaktiv",
      },
      response: {
        id: "Lieferanten-ID",
        isActive: "Aktiv",
      },
    },
  },

  orderCreate: {
    post: {
      title: "Bestellung erstellen",
      description: "Neue Bestellung im Entwurfsstatus anlegen.",
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Alle Felder prüfen und erneut versuchen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Bestellungen anzulegen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Mitglieder-Rolle oder höher erforderlich",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description:
            "Bestellung konnte nicht erstellt werden — erneut versuchen",
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
          description: "Lieferant oder Unternehmen nicht gefunden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung erstellt",
        description: "Bestellung im Entwurfsstatus angelegt",
      },
      widget: {
        browseVendors: "Lieferanten durchsuchen",
        browseWarehouses: "Lager durchsuchen",
        viewOrder: "Bestellung öffnen",
        backToList: "Zurück zur Liste",
      },
      response: {
        id: "Bestell-ID",
        poNumber: "Bestellnummer",
        status: "Status",
        subtotal: "Zwischensumme",
        taxAmount: "MwSt.",
        total: "Gesamt",
        createdAt: "Erstellt",
      },
    },
    companyId: {
      label: "Unternehmen",
      description: "Bestellendes Unternehmen",
      placeholder: "Unternehmens-UUID",
    },
    vendorId: {
      label: "Lieferant",
      description: "Empfangender Lieferant",
      placeholder: "Lieferanten-UUID",
    },
    currency: {
      label: "Währung",
      description: "Bestellwährung",
      placeholder: "EUR",
    },
    expectedDeliveryDate: {
      label: "Geplante Lieferung",
      description: "Geplantes Lieferdatum (optional)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Ziellager",
      description: "Lager für den Wareneingang (optional)",
      placeholder: "Lager-UUID",
    },
    notes: {
      label: "Notizen",
      description: "Interne Notizen zur Bestellung",
      placeholder: "Eilauftrag",
    },
    lines: { label: "Positionen", description: "Bestellte Artikel und Mengen" },
    lineDescription: {
      label: "Beschreibung",
      description: "Artikelbeschreibung",
      placeholder: "Bürostühle",
    },
    lineProductId: {
      label: "Produkt-ID",
      description: "Katalogartikel (optional)",
      placeholder: "Produkt-UUID",
    },
    lineQuantity: {
      label: "Menge",
      description: "Anzahl der Einheiten",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "Einzelpreis",
      description: "Preis pro Einheit",
      placeholder: "99,00",
    },
    lineTaxRate: {
      label: "Steuersatz",
      description: "Steuersatz als Dezimalzahl (z. B. 0,19 = 19 %)",
      placeholder: "0,19",
    },
    lineSortOrder: {
      label: "Sortierung",
      description: "Anzeigereihenfolge dieser Position",
      placeholder: "0",
    },
  },

  orderList: {
    get: {
      title: "Bestellungen auflisten",
      description:
        "Bestellungen eines Unternehmens mit optionalem Statusfilter anzeigen.",
      widget: {
        newOrder: "Neue Bestellung",
        empty: "Keine Bestellungen gefunden.",
        statusAll: "Alle",
        orders: "Bestellungen",
        order: "Bestellung",
        colPoVendor: "Bestellung / Lieferant",
        colDate: "Datum",
        colAmount: "Betrag",
        colStatus: "Status",
        deliveryArrow: "→",
        overdue: "überfällig",
        actionNeeded: "Bestellungen benötigen Aufmerksamkeit",
        back: "Zurück",
        loading: "Wird geladen…",
      },
      companyId: {
        label: "Unternehmen",
        description: "Unternehmen, dessen Bestellungen angezeigt werden sollen",
      },
      status: {
        label: "Statusfilter",
        description: "Nach Bestellstatus filtern (optional)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Bestellungen anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Bestellungen konnten nicht geladen werden",
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
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellungen geladen",
        description: "Bestellliste abgerufen",
      },
      response: {
        id: "Bestell-ID",
        poNumber: "Bestellnummer",
        vendorId: "Lieferant",
        vendorName: "Lieferant",
        status: "Status",
        currency: "Währung",
        total: "Gesamt",
        expectedDeliveryDate: "Geplante Lieferung",
        createdAt: "Erstellt",
      },
    },
  },

  orderGet: {
    get: {
      title: "Bestellung abrufen",
      description:
        "Bestellung mit allen Positionen und Wareneingangshistorie abrufen.",
      widget: {
        back: "Zurück",
        send: "An Lieferant senden",
        confirm: "Als bestätigt markieren",
        receive: "Waren annehmen",
        convertToBill: "In Rechnung umwandeln",
        viewBill: "Rechnung anzeigen",
        addLine: "+ Position hinzufügen",
        cancel: "Bestellung stornieren",
        edit: "Bearbeiten",
        select: "Bestellung auswählen",
        linesHeader: "Positionen",
        receiptsHeader: "Wareneingangshistorie",
        noLines: "Keine Positionen vorhanden.",
        noReceipts: "Noch keine Wareneingänge.",
        colDescription: "Beschreibung",
        colQtyPrice: "Menge × Preis",
        colLineTotal: "Gesamt",
        delivery: "Geplante Lieferung:",
        overdue: "(überfällig)",
        received: "eingegangen",
        billCreated: "Eingangsrechnung aus dieser Bestellung erstellt.",
        vendorLabel: "Lieferanten-ID:",
      },
      poId: { label: "Bestell-ID", description: "Abzurufende Bestellung" },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bestell-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Bestellungen anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Bestellung konnte nicht geladen werden",
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
          description: "Diese Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung geladen",
        description: "Bestelldetails abgerufen",
      },
      response: {
        id: "Bestell-ID",
        companyId: "Unternehmens-ID",
        vendorId: "Lieferanten-ID",
        poNumber: "Bestellnummer",
        status: "Status",
        currency: "Währung",
        expectedDeliveryDate: "Geplante Lieferung",
        deliveryWarehouseId: "Ziellager",
        notes: "Notizen",
        subtotal: "Zwischensumme",
        taxAmount: "MwSt.",
        total: "Gesamt",
        billId: "Rechnungs-ID",
        confirmedAt: "Bestätigt am",
        receivedAt: "Geliefert am",
        createdAt: "Erstellt",
        updatedAt: "Aktualisiert",
        lines: "Positionen",
        lineId: "Positions-ID",
        lineProductId: "Produkt-ID",
        lineDescription: "Beschreibung",
        lineQuantity: "Menge",
        lineUnitPrice: "Einzelpreis",
        lineTaxRate: "Steuersatz",
        lineTaxAmount: "MwSt.",
        lineTotal: "Gesamt",
        lineQuantityReceived: "Eingegangen",
        receipts: "Wareneingänge",
        receiptId: "Eingangs-ID",
        receiptReceivedAt: "Eingegangen am",
        receiptNotes: "Notizen",
      },
    },
  },

  orderUpdate: {
    patch: {
      title: "Bestellung aktualisieren",
      description: "Entwurfsbestellung bearbeiten — Felder und Positionen.",
      widget: { backToPO: "Zurück zur Bestellung" },
      poId: { label: "Bestell-ID", description: "Zu bearbeitende Bestellung" },
      vendorId: {
        label: "Lieferant",
        description: "Lieferant ändern (optional)",
        placeholder: "Lieferanten-UUID",
      },
      currency: {
        label: "Währung",
        description: "Bestellwährung",
        placeholder: "EUR",
      },
      expectedDeliveryDate: {
        label: "Geplante Lieferung",
        description: "Geplantes Lieferdatum",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Ziellager",
        description: "Lager für den Wareneingang",
        placeholder: "Lager-UUID",
      },
      notes: {
        label: "Notizen",
        description: "Interne Notizen zur Bestellung",
        placeholder: "Eilauftrag",
      },
      lines: {
        label: "Positionen",
        description: "Alle Positionen ersetzen (optional)",
      },
      lineDescription: {
        label: "Beschreibung",
        description: "Artikelbeschreibung",
        placeholder: "Bürostühle",
      },
      lineProductId: {
        label: "Produkt-ID",
        description: "Katalogartikel (optional)",
        placeholder: "Produkt-UUID",
      },
      lineQuantity: {
        label: "Menge",
        description: "Anzahl der Einheiten",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "Einzelpreis",
        description: "Preis pro Einheit",
        placeholder: "99,00",
      },
      lineTaxRate: {
        label: "Steuersatz",
        description: "Steuersatz als Dezimalzahl",
        placeholder: "0,19",
      },
      lineSortOrder: {
        label: "Sortierung",
        description: "Anzeigereihenfolge dieser Position",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Bestellungen zu bearbeiten",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Kein Entwurf",
          description: "Nur Entwurfsbestellungen können bearbeitet werden",
        },
        server: {
          title: "Serverfehler",
          description: "Bestellung konnte nicht aktualisiert werden",
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
          description: "Diese Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung aktualisiert",
        description: "Bestellung gespeichert",
      },
      response: {
        id: "Bestell-ID",
        status: "Status",
        subtotal: "Zwischensumme",
        taxAmount: "MwSt.",
        total: "Gesamt",
        updatedAt: "Aktualisiert",
      },
    },
  },

  orderSend: {
    post: {
      title: "Bestellung senden",
      description: "Bestellung als an Lieferant gesendet markieren.",
      poId: { label: "Bestell-ID", description: "Zu sendende Bestellung" },
      widget: {
        back: "Zurück",
        backToPO: "Zur Bestellung",
        warning:
          "Senden markiert diese Bestellung als an den Lieferanten übermittelt. Status wechselt von Entwurf zu Gesendet.",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bestell-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Bestellungen zu senden",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Kein Entwurf",
          description: "Nur Entwurfsbestellungen können gesendet werden",
        },
        server: {
          title: "Serverfehler",
          description: "Bestellung konnte nicht gesendet werden",
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
          description: "Diese Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung gesendet",
        description: "Bestellung als gesendet markiert",
      },
      response: {
        id: "Bestell-ID",
        status: "Status",
      },
    },
  },

  orderConfirm: {
    post: {
      title: "Bestellung bestätigen",
      description: "Lieferant hat bestätigt — als Bestätigt markieren.",
      poId: { label: "Bestell-ID", description: "Zu bestätigende Bestellung" },
      widget: {
        back: "Zurück",
        backToPO: "Zur Bestellung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bestell-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Bestellungen zu bestätigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Ungültiger Status",
          description: "Nur gesendete Bestellungen können bestätigt werden",
        },
        server: {
          title: "Serverfehler",
          description: "Bestellung konnte nicht bestätigt werden",
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
          description: "Diese Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung bestätigt",
        description: "Bestellung als Bestätigt markiert",
      },
      response: {
        id: "Bestell-ID",
        status: "Status",
        confirmedAt: "Bestätigt am",
      },
    },
  },

  orderReceive: {
    post: {
      title: "Waren annehmen",
      description:
        "Wareneingang für eine Bestellung erfassen. Erstellt Lagerbuchungen.",
      widget: { backToPO: "Zurück zur Bestellung" },
      poId: {
        label: "Bestell-ID",
        description: "Bestellung, gegen die gebucht wird",
      },
      warehouseId: {
        label: "Lager",
        description: "Empfangendes Lager (optional)",
        placeholder: "Lager-UUID",
      },
      notes: {
        label: "Notizen",
        description: "Notizen zu dieser Lieferung",
        placeholder: "Lieferschein #12345",
      },
      lines: {
        label: "Eingegangene Artikel",
        description: "Eingegangene Mengen je Position",
      },
      linePoLineId: { label: "Positions-ID", description: "Bestellposition" },
      lineQuantityReceived: {
        label: "Eingegangene Menge",
        description: "Eingegangene Menge für diese Position",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Alle Felder und Mengen prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Waren anzunehmen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Ungültiger Status",
          description: "Bestellung muss Bestätigt oder Gesendet sein",
        },
        server: {
          title: "Serverfehler",
          description: "Wareneingang konnte nicht gebucht werden",
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
          description: "Bestellung oder Position nicht gefunden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Waren eingegangen",
        description: "Wareneingang gebucht und Lager aktualisiert",
      },
      response: {
        receiptId: "Eingangs-ID",
        status: "Bestellstatus",
        receivedAt: "Eingegangen am",
      },
    },
  },

  orderConvertToBill: {
    post: {
      title: "In Rechnung umwandeln",
      description: "Aus dieser Bestellung eine Eingangsrechnung erstellen.",
      widget: {
        back: "Zurück",
        viewBill: "Rechnung anzeigen",
      },
      poId: { label: "Bestell-ID", description: "Umzuwandelnde Bestellung" },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bestell-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Rechnungen zu erstellen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Bereits umgewandelt",
          description:
            "Diese Bestellung wurde bereits in eine Rechnung umgewandelt",
        },
        server: {
          title: "Serverfehler",
          description: "Rechnung konnte nicht erstellt werden",
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
          description: "Diese Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Rechnung erstellt",
        description: "Eingangsrechnung aus Bestellung erstellt",
      },
      response: {
        billId: "Rechnungs-ID",
        billNumber: "Rechnungsnummer",
        poId: "Bestell-ID",
      },
    },
  },

  orderLineAdd: {
    post: {
      widget: {
        backToOrder: "Zurück zur Bestellung",
        lineAdded: "Position hinzugefügt",
      },
      title: "Position hinzufügen",
      description: "Eine Position zur Bestellung hinzufügen.",
      poId: {
        label: "Bestell-ID",
        description: "Bestellung, der eine Position hinzugefügt wird",
      },
      productId: {
        label: "Produkt",
        description: "Katalogartikel (optional)",
        placeholder: "Produkt-UUID",
      },
      itemDescription: {
        label: "Beschreibung",
        description: "Artikelbeschreibung",
        placeholder: "Bürostühle",
      },
      quantity: {
        label: "Menge",
        description: "Anzahl der Einheiten",
        placeholder: "10",
      },
      unitPrice: {
        label: "Einzelpreis",
        description: "Preis pro Einheit",
        placeholder: "99,00",
      },
      taxRate: {
        label: "Steuersatz",
        description: "Steuersatz als Dezimalzahl (z. B. 0,19 = 19 %)",
        placeholder: "0,19",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Alle Felder prüfen und erneut versuchen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Positionen hinzuzufügen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Kein Entwurf",
          description: "Nur Entwurfsbestellungen können bearbeitet werden",
        },
        server: {
          title: "Serverfehler",
          description: "Position konnte nicht hinzugefügt werden",
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
          description: "Diese Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Position hinzugefügt",
        description: "Position zur Bestellung hinzugefügt",
      },
      response: {
        lineId: "Positions-ID",
        subtotal: "Zwischensumme",
        taxAmount: "MwSt.",
        total: "Gesamt",
      },
    },
  },

  orderLineRemove: {
    post: {
      title: "Position entfernen",
      description: "Eine Position aus der Bestellung entfernen.",
      poId: {
        label: "Bestell-ID",
        description: "Bestellung, aus der eine Position entfernt wird",
      },
      lineId: { label: "Positions-ID", description: "Zu entfernende Position" },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige IDs",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Positionen zu entfernen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Kein Entwurf",
          description: "Nur Entwurfsbestellungen können bearbeitet werden",
        },
        server: {
          title: "Serverfehler",
          description: "Position konnte nicht entfernt werden",
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
          description: "Bestellung oder Position nicht gefunden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Position entfernt",
        description: "Position aus Bestellung entfernt",
      },
      response: {
        subtotal: "Zwischensumme",
        taxAmount: "MwSt.",
        total: "Gesamt",
      },
    },
  },

  dashboard: {
    get: {
      title: "Einkaufsübersicht",
      description:
        "Aktueller Stand der Bestellungen und Lieferantenaktivitäten für Ihr Unternehmen.",
      widget: {
        kpiDraft: "Entwürfe",
        kpiConfirmed: "Bestätigt",
        kpiAwaitingReceipt: "Ausstehende Lieferungen",
        kpiActiveVendors: "Aktive Lieferanten",
        warningDueThisWeek:
          "{{count}} Bestellung fällig diese Woche — Liefertermine prüfen",
        warningDueThisWeekPlural:
          "{{count}} Bestellungen fällig diese Woche — Liefertermine prüfen",
        navNewPo: "Neue Bestellung",
        navAllPos: "Alle Bestellungen",
        navVendors: "Lieferanten",
        navNewVendor: "Neuer Lieferant",
        loading: "Laden…",
      },
      companyId: {
        label: "Unternehmen",
        description:
          "Unternehmen, dessen Einkaufsstatistiken angezeigt werden sollen (optional)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um die Einkaufsübersicht zu sehen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Einkaufsübersicht konnte nicht geladen werden",
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
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Dashboard geladen",
        description: "Einkaufsübersicht abgerufen",
      },
      response: {
        draftCount: "Entwürfe",
        confirmedCount: "Bestätigte Bestellungen",
        awaitingReceiptCount: "Ausstehende Lieferungen",
        activeVendorCount: "Aktive Lieferanten",
        dueThisWeekCount: "Diese Woche fällig",
      },
    },
  },

  orderCancel: {
    post: {
      title: "Bestellung stornieren",
      description: "Entwurf- oder gesendete Bestellung stornieren.",
      poId: { label: "Bestell-ID", description: "Zu stornierende Bestellung" },
      widget: {
        back: "Zurück",
        warning:
          "Diese Bestellung wird dauerhaft storniert. Nur Entwurf- oder gesendete Bestellungen können storniert werden.",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bestell-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um Bestellungen zu stornieren",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Bestellung",
        },
        conflict: {
          title: "Stornierung nicht möglich",
          description:
            "Nur Entwurf- oder gesendete Bestellungen können storniert werden",
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
          description: "Diese Bestellung existiert nicht",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestellung storniert",
        description: "Bestellung erfolgreich storniert",
      },
      response: {
        id: "Bestell-ID",
        status: "Status",
      },
    },
  },
};

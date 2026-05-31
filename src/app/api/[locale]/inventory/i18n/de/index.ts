import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Lagerverwaltung",
  shared: {
    errors: {
      failedToRecordMovement: "Lagerbewegung konnte nicht erfasst werden",
      failedToApplyMovement: "Lagerbewegung konnte nicht angewendet werden",
    },
  },
  tags: {
    inventory: "Lager",
    warehouse: "Lagerhaus",
    stock: "Bestand",
    transfer: "Umlagerung",
    create: "Erstellen",
    list: "Liste",
    get: "Abrufen",
    update: "Aktualisieren",
    adjust: "Anpassen",
    receive: "Einbuchen",
    issue: "Ausbuchen",
    dispatch: "Versenden",
  },
  endpointCategories: {
    inventory: "Lagerverwaltung",
    warehouses: "Lagerhäuser",
    stock: "Lagerbestände",
    transfers: "Umlagerungen",
  },
  enums: {
    movementType: {
      receipt: "Wareneingang",
      issue: "Warenausgang",
      transferIn: "Umlagerung Eingang",
      transferOut: "Umlagerung Ausgang",
      adjustment: "Bestandskorrektur",
      sale: "Verkauf",
      return: "Rückgabe",
    },
    transferStatus: {
      draft: "Entwurf",
      inTransit: "Unterwegs",
      received: "Empfangen",
      cancelled: "Storniert",
    },
  },

  warehouseCreate: {
    post: {
      title: "Lagerhaus erstellen",
      description: "Neues Lagerhaus für ein Unternehmen anlegen.",
      widget: {
        backToList: "Zurück zur Lagerhausliste",
        active: "Aktiv",
        inactive: "Inaktiv",
        default: "Standard",
      },
      companyId: {
        label: "Unternehmens-ID",
        description: "Zugehöriges Unternehmen",
      },
      name: {
        label: "Lagerhausname",
        description: "Vollständiger Name des Lagerhauses",
        placeholder: "Hauptlager",
      },
      code: {
        label: "Kürzel",
        description: "Kurzbezeichnung (z. B. WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "Adresse",
        description: "Physische Adresse des Lagerhauses",
        placeholder: "Lagerstraße 1",
      },
      isActive: {
        label: "Aktiv",
        description: "Gibt an, ob das Lagerhaus in Betrieb ist",
      },
      isDefault: {
        label: "Standardlager",
        description: "Als Standardlagerhaus für dieses Unternehmen festlegen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Lagerhäuser zu erstellen",
        },
        forbidden: {
          title: "Adminrechte erforderlich",
          description: "Nur Admins können Lagerhäuser erstellen",
        },
        conflict: {
          title: "Kürzel bereits vergeben",
          description: "Ein Lagerhaus mit diesem Kürzel existiert bereits",
        },
        server: {
          title: "Serverfehler",
          description:
            "Lagerhaus konnte nicht erstellt werden — erneut versuchen",
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
        title: "Lagerhaus erstellt",
        description: "Lagerhaus erfolgreich angelegt",
      },
      response: {
        id: "Lagerhaus-ID",
        name: "Lagerhausname",
        code: "Kürzel",
        companyId: "Unternehmens-ID",
        isActive: "Aktiv",
        isDefault: "Standard",
      },
    },
  },

  warehouseList: {
    get: {
      title: "Lagerhäuser auflisten",
      description: "Alle Lagerhäuser eines Unternehmens auflisten.",
      widget: {
        active: "Aktiv",
        inactive: "Inaktiv",
        default: "Standard",
        total: "Lagerhäuser",
        createWarehouse: "Neues Lagerhaus",
        empty: "Noch keine Lagerhäuser.",
        emptyHint:
          "Erstes Lagerhaus anlegen, um mit der Bestandsverwaltung zu beginnen.",
        emptyIcon: "🏭",
        loading: "Lagerhäuser werden geladen…",
        load: "Laden",
        viewStock: "Bestand anzeigen",
        selectCompany: "Unternehmens-ID eingeben, um Lagerhäuser zu laden.",
      },
      companyId: {
        label: "Unternehmens-ID",
        description: "Unternehmen, dessen Lagerhäuser aufgelistet werden",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Lagerhäuser anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lagerhäuser konnten nicht geladen werden",
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
        title: "Lagerhäuser geladen",
        description: "Lagerhausliste abgerufen",
      },
      response: {
        id: "Lagerhaus-ID",
        name: "Name",
        code: "Kürzel",
        address: "Adresse",
        isActive: "Aktiv",
        isDefault: "Standard",
        createdAt: "Erstellt am",
      },
    },
  },

  warehouseGet: {
    get: {
      title: "Lagerhaus abrufen",
      description: "Details eines bestimmten Lagerhauses abrufen.",
      widget: {
        edit: "Lagerhaus bearbeiten",
        viewStock: "Bestand anzeigen",
      },
      warehouseId: {
        label: "Lagerhaus-ID",
        description: "Abzurufendes Lagerhaus",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Lagerhaus-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Lagerhäuser anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Lagerhaus",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lagerhaus konnte nicht geladen werden",
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
          title: "Lagerhaus nicht gefunden",
          description: "Lagerhaus existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Lagerhaus geladen",
        description: "Lagerhausdetails abgerufen",
      },
      response: {
        id: "Lagerhaus-ID",
        companyId: "Unternehmens-ID",
        name: "Name",
        code: "Kürzel",
        address: "Adresse",
        isActive: "Aktiv",
        isDefault: "Standard",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
    },
  },

  warehouseUpdate: {
    patch: {
      title: "Lagerhaus aktualisieren",
      description: "Lagerhausdetails bearbeiten.",
      widget: {
        backToWarehouse: "Zurück zum Lagerhaus",
        active: "Aktiv",
        inactive: "Inaktiv",
      },
      warehouseId: {
        label: "Lagerhaus-ID",
        description: "Zu aktualisierendes Lagerhaus",
      },
      name: {
        label: "Lagerhausname",
        description: "Vollständiger Name des Lagerhauses",
        placeholder: "Hauptlager",
      },
      code: {
        label: "Kürzel",
        description: "Kurzbezeichnung",
        placeholder: "WH-01",
      },
      address: {
        label: "Adresse",
        description: "Physische Adresse",
        placeholder: "Lagerstraße 1",
      },
      isActive: {
        label: "Aktiv",
        description: "Gibt an, ob das Lagerhaus in Betrieb ist",
      },
      isDefault: {
        label: "Standardlager",
        description: "Als Standardlagerhaus festlegen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Lagerhäuser zu aktualisieren",
        },
        forbidden: {
          title: "Adminrechte erforderlich",
          description: "Nur Admins können Lagerhäuser bearbeiten",
        },
        conflict: {
          title: "Kürzelkonflikt",
          description: "Dieses Kürzel ist bereits vergeben",
        },
        server: {
          title: "Serverfehler",
          description: "Lagerhaus konnte nicht aktualisiert werden",
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
          title: "Lagerhaus nicht gefunden",
          description: "Lagerhaus existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Lagerhaus aktualisiert",
        description: "Lagerhaus erfolgreich aktualisiert",
      },
      response: {
        id: "Lagerhaus-ID",
        name: "Name",
        code: "Kürzel",
        isActive: "Aktiv",
        isDefault: "Standard",
      },
    },
  },

  stockList: {
    get: {
      title: "Lagerbestände",
      description:
        "Lagerbestände eines Lagerhauses mit Verfügbarkeit und Mindestbestandsindikatoren anzeigen.",
      widget: {
        lowStock: "Mindestbestand unterschritten",
        available: "Verfügbar",
        onHand: "Auf Lager",
        reserved: "Reserviert",
        onOrder: "Bestellt",
        reorderPoint: "Meldebestand",
        empty: "Noch keine Bestandsdatensätze.",
        emptyHint:
          "Ware in ein Lagerhaus einbuchen, um Bestände hier zu sehen.",
        emptyIcon: "📦",
        loading: "Bestände werden geladen…",
        filterProduct: "Nach Produkt filtern",
        load: "Laden",
        selectWarehouse: "Lagerhaus-ID eingeben, um Bestände anzuzeigen.",
        total: "Einträge",
        adjust: "Anpassen",
        transfer: "Umlagern",
        outOfStock: "nicht vorrätig",
        belowReorderPoint: "unter Meldebestand",
        bulletSeparator: "·",
        statusOk: "OK",
      },
      warehouseId: {
        label: "Lagerhaus-ID",
        description: "Lagerhaus, dessen Bestand abgefragt wird",
      },
      productId: {
        label: "Produkt-ID",
        description: "Auf ein bestimmtes Produkt filtern (optional)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Bestände anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Lagerhaus",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lagerbestände konnten nicht geladen werden",
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
          title: "Lagerhaus nicht gefunden",
          description: "Lagerhaus existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestand geladen",
        description: "Lagerbestände abgerufen",
      },
      response: {
        id: "Bestandsdatensatz-ID",
        warehouseId: "Lagerhaus-ID",
        warehouseName: "Lagerhaus",
        productId: "Produkt-ID",
        productName: "Produkt",
        quantityOnHand: "Auf Lager",
        quantityReserved: "Reserviert",
        quantityOnOrder: "Bestellt",
        quantityAvailable: "Verfügbar",
        reorderPoint: "Meldebestand",
        reorderQuantity: "Bestellmenge",
        unitCost: "Stückkosten",
        isLowStock: "Mindestbestand",
        updatedAt: "Aktualisiert am",
      },
    },
  },

  stockAdjust: {
    post: {
      title: "Bestand korrigieren",
      description:
        "Lagerbestand manuell anpassen. Negative Werte für Abschreibungen.",
      widget: {
        backToStock: "Zurück zum Bestand",
        reserved: "Reserviert",
        preview: "Vorschau",
        quantityChange: "Mengenänderung",
        positiveHint: "Positive Menge fügt Bestand hinzu",
        negativeHint: "Negative Menge reduziert den Bestand",
      },
      warehouseId: {
        label: "Lagerhaus-ID",
        description: "Lagerhaus, in dem der Bestand korrigiert wird",
      },
      productId: {
        label: "Produkt-ID",
        description: "Zu korrigierendes Produkt",
      },
      quantity: {
        label: "Menge",
        description:
          "Vorzeichenbehaftete Mengenänderung (positiv = hinzufügen, negativ = abziehen)",
        placeholder: "10",
      },
      reason: {
        label: "Grund",
        description: "Begründung für die Korrektur",
        placeholder: "Inventurkorrektur",
      },
      unitCost: {
        label: "Stückkosten",
        description: "Kosten pro Einheit (optional)",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Bestand zu korrigieren",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Lagerhaus",
        },
        conflict: {
          title: "Unzureichender Bestand",
          description: "Nicht genug Bestand für diese Korrektur",
        },
        server: {
          title: "Serverfehler",
          description: "Bestandskorrektur fehlgeschlagen",
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
          description: "Lagerhaus oder Produkt nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Bestand korrigiert",
        description: "Bestandskorrektur erfasst",
      },
      response: {
        movementId: "Bewegungs-ID",
        productId: "Produkt-ID",
        warehouseId: "Lagerhaus-ID",
        quantityOnHand: "Neuer Lagerbestand",
        quantityAvailable: "Verfügbar",
      },
    },
  },

  stockReceive: {
    post: {
      title: "Wareneingang buchen",
      description:
        "Eingehende Ware erfassen — aktualisiert Lagerbestand und gewichteten Durchschnittspreis.",
      widget: {
        backToStock: "Zurück zum Bestand",
      },
      warehouseId: {
        label: "Lagerhaus-ID",
        description: "Empfangendes Lagerhaus",
      },
      productId: { label: "Produkt-ID", description: "Empfangenes Produkt" },
      quantity: {
        label: "Menge",
        description: "Anzahl empfangener Einheiten",
        placeholder: "100",
      },
      unitCost: {
        label: "Stückkosten",
        description: "Kosten pro empfangener Einheit",
        placeholder: "0,00",
      },
      reference: {
        label: "Referenz",
        description: "Bestellnummer oder Lieferschein",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Wareneingang zu buchen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Lagerhaus",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
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
          title: "Nicht gefunden",
          description: "Lagerhaus oder Produkt nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Wareneingang gebucht",
        description: "Wareneingangsbuchung erfasst",
      },
      response: {
        movementId: "Bewegungs-ID",
        productId: "Produkt-ID",
        warehouseId: "Lagerhaus-ID",
        quantityOnHand: "Neuer Lagerbestand",
        unitCost: "Neue Stückkosten",
      },
    },
  },

  stockIssue: {
    post: {
      title: "Warenausgang buchen",
      description:
        "Ware aus einem Lagerhaus ausbuchen. Prüft ausreichende Verfügbarkeit.",
      widget: {
        backToStock: "Zurück zum Bestand",
      },
      warehouseId: {
        label: "Lagerhaus-ID",
        description: "Auslagerndes Lagerhaus",
      },
      productId: { label: "Produkt-ID", description: "Auszulagendes Produkt" },
      quantity: {
        label: "Menge",
        description: "Anzahl auszulagernder Einheiten",
        placeholder: "10",
      },
      reference: {
        label: "Referenz",
        description: "Fertigungsauftrag, Jobnummer oder andere Referenz",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "Stückkosten",
        description:
          "Kosten pro Einheit (Standard: aktueller gewichteter Durchschnitt)",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Warenausgang zu buchen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Lagerhaus",
        },
        conflict: {
          title: "Unzureichender Bestand",
          description: "Nicht genug Bestand zum Auslagern",
        },
        server: {
          title: "Serverfehler",
          description: "Warenausgang konnte nicht gebucht werden",
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
          description: "Lagerhaus oder Produkt nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Warenausgang gebucht",
        description: "Ware erfolgreich ausgelagert",
      },
      response: {
        movementId: "Bewegungs-ID",
        productId: "Produkt-ID",
        warehouseId: "Lagerhaus-ID",
        quantityOnHand: "Neuer Lagerbestand",
        quantityAvailable: "Verfügbar",
      },
    },
  },

  transferCreate: {
    post: {
      title: "Umlagerung erstellen",
      description: "Umlagerungsauftrag erstellen. Startet im Status Entwurf.",
      widget: {
        backToList: "Zurück zu Umlagerungen",
        viewTransfer: "Umlagerung ansehen",
        browseWarehouses: "Lager durchsuchen",
      },
      companyId: {
        label: "Unternehmens-ID",
        description: "Zugehöriges Unternehmen",
      },
      fromWarehouseId: {
        label: "Ausgangslager",
        description: "Lagerhaus, das Ware sendet",
      },
      toWarehouseId: {
        label: "Ziellager",
        description: "Lagerhaus, das Ware empfängt",
      },
      reference: {
        label: "Referenz",
        description: "Referenznummer der Umlagerung",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "Hinweise",
        description: "Zusätzliche Informationen zur Umlagerung",
        placeholder: "Saisonale Auffüllung",
      },
      items: {
        label: "Positionen",
        description: "Produkte und Mengen für die Umlagerung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Umlagerungen zu erstellen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: {
          title: "Gleiches Lagerhaus",
          description: "Ausgangs- und Ziellager müssen verschieden sein",
        },
        server: {
          title: "Serverfehler",
          description: "Umlagerung konnte nicht erstellt werden",
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
          description: "Lagerhaus nicht gefunden",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Umlagerung erstellt",
        description: "Umlagerungsentwurf erstellt",
      },
      response: {
        id: "Umlagerungs-ID",
        status: "Status",
        reference: "Referenz",
        fromWarehouseId: "Ausgangslager",
        toWarehouseId: "Ziellager",
      },
    },
  },

  transferList: {
    get: {
      title: "Umlagerungen auflisten",
      description: "Umlagerungen eines Unternehmens auflisten.",
      widget: {
        newTransfer: "Neue Umlagerung",
        empty: "Noch keine Umlagerungen.",
        emptyHint:
          "Umlagerung erstellen, um Bestände zwischen Lagerhäusern zu verschieben.",
        emptyIcon: "🔄",
        loading: "Umlagerungen werden geladen…",
        load: "Laden",
        selectCompany: "Unternehmens-ID eingeben, um Umlagerungen zu laden.",
        total: "Umlagerungen",
        view: "Ansehen",
        draft: "Entwurf",
        inTransit: "In Transit",
        viewTransfer: "Umlagerung ansehen",
        tabAll: "Alle",
        tabDraft: "Ausstehend",
        tabInTransit: "In Transit",
        tabReceived: "Abgeschlossen",
        tabCancelled: "Storniert",
        arrowSeparator: "→",
      },
      companyId: {
        label: "Unternehmens-ID",
        description: "Unternehmen, dessen Umlagerungen aufgelistet werden",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Umlagerungen anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Umlagerungen konnten nicht geladen werden",
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
        title: "Umlagerungen geladen",
        description: "Umlagerungsliste abgerufen",
      },
      response: {
        id: "Umlagerungs-ID",
        fromWarehouseId: "Von Lagerhaus-ID",
        fromWarehouseName: "Von",
        toWarehouseId: "Nach Lagerhaus-ID",
        toWarehouseName: "Nach",
        status: "Status",
        reference: "Referenz",
        createdAt: "Erstellt am",
        completedAt: "Abgeschlossen am",
      },
    },
  },

  transferGet: {
    get: {
      title: "Umlagerung abrufen",
      description: "Umlagerung mit allen Positionen abrufen.",
      widget: {
        dispatch: "Umlagerung versenden",
        receive: "Als empfangen markieren",
        status: "Status",
      },
      transferId: {
        label: "Umlagerungs-ID",
        description: "Abzurufende Umlagerung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Umlagerungs-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Umlagerungen anzuzeigen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Umlagerung",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Umlagerung konnte nicht geladen werden",
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
          title: "Umlagerung nicht gefunden",
          description: "Umlagerung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Umlagerung geladen",
        description: "Umlagerungsdetails abgerufen",
      },
      response: {
        id: "Umlagerungs-ID",
        companyId: "Unternehmens-ID",
        fromWarehouseId: "Ausgangslager",
        toWarehouseId: "Ziellager",
        status: "Status",
        reference: "Referenz",
        notes: "Hinweise",
        createdAt: "Erstellt am",
        completedAt: "Abgeschlossen am",
        items: "Positionen",
        itemId: "Positions-ID",
        productId: "Produkt-ID",
        quantityRequested: "Angefordert",
        quantityReceived: "Empfangen",
      },
    },
  },

  transferDispatch: {
    post: {
      title: "Umlagerung versenden",
      description:
        "Umlagerung als unterwegs markieren. Ware verlässt das Ausgangslager.",
      widget: {
        backToTransfer: "Zurück zur Umlagerung",
      },
      transferId: {
        label: "Umlagerungs-ID",
        description: "Zu versendende Umlagerung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Umlagerungs-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Umlagerungen zu versenden",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Umlagerung",
        },
        conflict: {
          title: "Kein Entwurf",
          description: "Nur Entwürfe können versendet werden",
        },
        server: {
          title: "Serverfehler",
          description: "Umlagerung konnte nicht versendet werden",
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
          title: "Umlagerung nicht gefunden",
          description: "Umlagerung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Umlagerung versendet",
        description: "Umlagerung ist jetzt unterwegs",
      },
      response: {
        id: "Umlagerungs-ID",
        status: "Status",
      },
    },
  },

  transferReceive: {
    post: {
      title: "Umlagerung empfangen",
      description:
        "Umlagerung als empfangen markieren. Erstellt Lagerbewegungen und aktualisiert Bestände.",
      widget: {
        backToTransfer: "Zurück zur Umlagerung",
      },
      transferId: {
        label: "Umlagerungs-ID",
        description: "Zu empfangende Umlagerung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Umlagerungs-ID",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden, um Umlagerungen zu empfangen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf diese Umlagerung",
        },
        conflict: {
          title: "Nicht unterwegs",
          description: "Nur Sendungen in Zustellung können empfangen werden",
        },
        server: {
          title: "Serverfehler",
          description: "Umlagerung konnte nicht empfangen werden",
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
          title: "Umlagerung nicht gefunden",
          description: "Umlagerung existiert nicht",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Umlagerung empfangen",
        description: "Lagerbewegungen erstellt und Bestände aktualisiert",
      },
      response: {
        id: "Umlagerungs-ID",
        status: "Status",
        completedAt: "Abgeschlossen am",
      },
    },
  },

  dashboard: {
    get: {
      title: "Lagerübersicht",
      description:
        "Aktueller Stand des Lagerbestands, ausstehende Transfers und Lageranzahl.",
      widget: {
        kpiInStock: "Auf Lager",
        kpiOutOfStock: "Nicht vorrätig",
        kpiLowStock: "Niedriger Bestand",
        kpiWarehouses: "Lagerhäuser",
        alertOutOfStock: "{{count}} Produkt nicht vorrätig",
        alertOutOfStockPlural: "{{count}} Produkte nicht vorrätig",
        navStockLevels: "Lagerbestände",
        navTransfers: "Transfers",
        navWarehouses: "Lagerhäuser",
        loading: "Laden…",
        pendingTransfers: "{{count}} Transfer unterwegs",
        pendingTransfersPlural: "{{count}} Transfers unterwegs",
      },
      companyId: {
        label: "Unternehmen",
        description:
          "Unternehmen, dessen Lagerstatistiken angezeigt werden sollen (optional)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um die Lagerübersicht zu sehen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lagerübersicht konnte nicht geladen werden",
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
        description: "Lagerübersicht abgerufen",
      },
      response: {
        inStockCount: "Auf Lager",
        outOfStockCount: "Nicht vorrätig",
        lowStockCount: "Niedriger Bestand",
        pendingTransferCount: "Ausstehende Transfers",
        warehouseCount: "Lagerhäuser",
      },
    },
  },
};

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

  workflow: {
    backToSessionOrders: "Zurück zu den Kassenbestellungen",
    receiptTitle: "Beleg",
    amountDue: "Offener Betrag",
    ledgerCurrencyMismatch:
      "Diese Bestellung verwendet eine andere Währung als die Buchhaltung. Verwenden Sie vor der Zahlung ein Terminal oder eine Bestellung in der Buchhaltungswährung.",
    postingUnavailable:
      "Der Verkauf konnte nicht gebucht werden. Prüfen Sie Firmenwährung, offene Buchungsperiode und Konten.",
    cashCurrencyMismatch:
      "Barzahlungen müssen in der Kassenwährung erfolgen. Wählen Sie für diese Bestellung eine andere Zahlungsart.",
    tenderMinorUnits: "Geben Sie Bargeld und Zahlungen in ganzen Cent an.",
    legacyTenderReview:
      "Für diese Bestellung wurde bereits eine Zahlung mit Bruchteilen eines Cents erfasst. Prüfen Sie die Zahlung vor dem nächsten Einzug.",
    legacyTenderRecorded:
      "Die ursprünglichen Beträge dieser Bestellung haben vier Nachkommastellen.",
    legacyPostingReview:
      "Die erfassten Beträge mit Bruchteilen eines Cents können nicht gebucht werden. Prüfen Sie die ursprüngliche Zahlung vor dem Verkaufsabschluss.",
    viewReceipt: "Beleg anzeigen",
    openDrawer: "Kasse öffnen",
    warehouse: "Verkaufslager",
    noWarehouse: "Kein Lager zugewiesen",
    chooseCompanyFirst: "Wählen Sie zuerst eine Firma.",
    warehouseInstruction:
      "Wählen Sie ein aktives Lager der ausgewählten Firma.",
    stockUnavailable:
      "Im Kassenlager fehlt verfügbarer Bestand. Prüfen Sie die Mengen vor dem Verkaufsabschluss.",
  },
  dashboard: {
    get: {
      title: "Kassenübersicht",
      titleShort: "POS-Übersicht",
      description:
        "Überblick über Terminals, offene Sitzungen und Tagesumsatz.",
      widget: {
        title: "Kasse",
        subtitle:
          "Kasse öffnen, Verkäufe erfassen, Schicht mit Kassensturz abschließen.",
        salesHistory: "Verkaufshistorie",
        newTill: "Neue Kasse",
        kpiSalesToday: "Umsatz heute",
        kpiSalesCount: "Verkäufe: {{count}}",
        kpiOpenTills: "Offene Kassen",
        kpiTillsTotal: "{{active}} von {{total}} aktiv",
        kpiAverage: "Durchschnittlicher Bon",
        kpiRefunds: "Erstattungen heute",
        kpiRefundsCount: "Erstattungen: {{count}}",
        tillsTitle: "Kassen",
        manageTills: "Kassen verwalten",
        emptyTitle: "Noch keine Kasse",
        emptyMessage: "Legen Sie eine Kasse an, um am Tresen zu verkaufen.",
        createTill: "Kasse anlegen",
        tillSelling: "Verkauft",
        tillReady: "Bereit",
        tillInactive: "Inaktiv",
        openRegister: "Zur Kasse",
        openTill: "Kasse öffnen",
        closeTill: "Kasse schließen",
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
        refundsToday: "Erstattungen heute",
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
      title: "Neue Kasse",
      titleShort: "Neue Kasse",
      description:
        "Kasse für ein Unternehmen anlegen: Name, Währung, Kassenkonto und Lager.",
      widget: {
        title: "Neue Kasse",
        subtitle:
          "Eine Kasse verkauft in einer Währung, bucht Bargeld auf ein Konto und entnimmt Ware aus einem Lager.",
        subtitleCompany:
          "Neue Kasse für {{company}}. Sie verkauft in einer Währung und bucht Bargeld auf ein Konto.",
        back: "Zurück",
        backToList: "Alle Kassen",
        openTill: "Kasse öffnen",
        cancel: "Abbrechen",
        submit: "Kasse anlegen",
        none: "Keines",
        sectionTill: "Kasse",
        sectionMoney: "Geld",
        sectionMoneyHint: "Verkaufswährung und Buchungskonto für das Bargeld.",
        sectionStock: "Lagerbestand",
        sectionStockHint:
          "Abgeschlossene Verkäufe buchen Ware aus diesem Lager aus. Für reine Dienstleistungen leer lassen.",
        defaultCashAccount: "Standard-Kassenkonto des Unternehmens",
        noWarehouse: "Ohne Lagerführung",
        chooseCompanyFirst: "Zuerst ein Unternehmen wählen.",
      },
      companyId: {
        label: "Unternehmen",
        description: "Unternehmen, dem die Kasse gehört",
      },
      name: {
        label: "Name",
        description: "Erscheint auf der Kassenkarte und auf Belegen",
        placeholder: "Vordere Theke",
      },
      location: {
        label: "Standort",
        description: "Wo die Kasse steht. Optional.",
        placeholder: "Erdgeschoss",
      },
      currency: {
        label: "Währung",
        description: "Jeder Verkauf an dieser Kasse läuft in dieser Währung",
        placeholder: "Währung wählen",
      },
      cashAccountNodeId: {
        label: "Kassenkonto",
        description: "Bargeld dieser Kasse wird auf dieses Konto gebucht.",
        invalid:
          "Wähle ein bebuchbares Kassen- oder Bankkonto dieses Unternehmens.",
      },
      warehouseId: {
        label: "Lager",
        description:
          "Beim Verkaufsabschluss wird Ware aus diesem Lager ausgebucht.",
      },
      errors: {
        validation: {
          title: "Kasse prüfen",
          description: "Name eingeben und Währung wählen.",
        },
        unauthorized: {
          title: "Anmeldung erforderlich",
          description: "Melde dich an, um Kassen anzulegen.",
        },
        forbidden: {
          title: "Nur für Admins",
          description: "Nur Unternehmensadmins legen Kassen an.",
        },
        conflict: {
          title: "Name vergeben",
          description: "Es gibt bereits eine Kasse mit diesem Namen.",
        },
        server: {
          title: "Kasse nicht angelegt",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        unknown: {
          title: "Kasse nicht angelegt",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        network: {
          title: "Keine Verbindung",
          description: "Verbindung prüfen und erneut versuchen.",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Unternehmen oder Lager existiert nicht.",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen erst abschließen oder verwerfen.",
        },
      },
      success: {
        title: "Kasse angelegt",
        description:
          "Kassenbestand zählen und öffnen, dann kann verkauft werden.",
      },
      response: {
        id: "Kasse",
        name: "Name",
        companyId: "Unternehmen",
        currency: "Währung",
        isActive: "Aktiv",
      },
    },
  },

  terminalList: {
    get: {
      title: "Kassen",
      titleShort: "Kassen",
      description:
        "Alle Kassen deiner Unternehmen und ob sie gerade verkaufen.",
      widget: {
        title: "Kassen",
        pickTitle: "Kasse wählen",
        subtitle: "Jede Kasse an deiner Theke und ob sie gerade verkauft.",
        summary: "Kassen: {{total}} · Im Verkauf: {{selling}}",
        newTill: "Neue Kasse",
        createTill: "Kasse anlegen",
        emptyTitle: "Noch keine Kassen",
        emptyMessage: "Lege eine Kasse an, um an der Theke zu verkaufen.",
        selling: "Verkauft",
        ready: "Bereit",
        inactive: "Inaktiv",
        openRegister: "Zur Kasse",
        openTill: "Kasse öffnen",
        loading: "Kassen werden geladen",
        back: "Zurück",
      },
      companyId: {
        label: "Unternehmen",
        description: "Nur Kassen dieses Unternehmens",
      },
      terminalId: {
        label: "Kasse",
        description: "Nur diese Kasse",
      },
      errors: {
        validation: {
          title: "Filter prüfen",
          description: "Unternehmen oder Kasse ist ungültig.",
        },
        unauthorized: {
          title: "Anmeldung erforderlich",
          description: "Melde dich an, um Kassen zu sehen.",
        },
        forbidden: {
          title: "Kein Zugriff",
          description: "Du bist kein Mitglied dieses Unternehmens.",
        },
        conflict: {
          title: "Konflikt",
          description:
            "Die Daten haben sich geändert. Neu laden und erneut versuchen.",
        },
        server: {
          title: "Kassen nicht geladen",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        unknown: {
          title: "Kassen nicht geladen",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        network: {
          title: "Keine Verbindung",
          description: "Verbindung prüfen und erneut versuchen.",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Dieses Unternehmen existiert nicht.",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen erst abschließen oder verwerfen.",
        },
      },
      success: {
        title: "Kassen geladen",
        description: "Deine Kassen sind aktuell.",
      },
      response: {
        id: "Kasse",
        name: "Name",
        location: "Standort",
        currency: "Währung",
        isActive: "Aktiv",
        companyName: "Unternehmen",
        openSessionId: "Offene Schicht",
        createdAt: "Angelegt",
      },
    },
  },

  sessionOpen: {
    post: {
      title: "Kasse öffnen",
      titleShort: "Kasse öffnen",
      description:
        "Schicht an einer Kasse mit dem gezählten Wechselgeld starten.",
      widget: {
        title: "Kasse öffnen",
        subtitle: "Bargeld in der Schublade zählen, dann die Schicht starten.",
        back: "Zurück",
        cancel: "Abbrechen",
        loadingTill: "Kasse wird geladen",
        selling: "Verkauft",
        ready: "Bereit",
        inactive: "Inaktiv",
        alreadyOpen:
          "Diese Kasse ist bereits geöffnet. Einfach weiterverkaufen.",
        openRegister: "Zur Kasse",
        floatHint:
          "Der Anfangsbestand ist dein Wechselgeld. Beim Schließen wird die Zählung damit abgeglichen.",
      },
      terminalId: {
        label: "Kasse",
        description: "Die zu öffnende Kasse",
      },
      openingFloat: {
        label: "Anfangsbestand",
        description: "Bargeld in der Schublade bei Schichtbeginn",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Anfangsbestand prüfen",
          description: "Bargeld in der Schublade eingeben, null oder mehr.",
        },
        unauthorized: {
          title: "Anmeldung erforderlich",
          description: "Melde dich an, um eine Kasse zu öffnen.",
        },
        forbidden: {
          title: "Kein Zugriff",
          description: "Du bist kein Mitglied des Unternehmens dieser Kasse.",
        },
        conflict: {
          title: "Kasse bereits offen",
          description: "Diese Kasse hat schon eine offene Schicht.",
        },
        server: {
          title: "Kasse nicht geöffnet",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        unknown: {
          title: "Kasse nicht geöffnet",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        network: {
          title: "Keine Verbindung",
          description: "Verbindung prüfen und erneut versuchen.",
        },
        notFound: {
          title: "Kasse nicht gefunden",
          description: "Diese Kasse existiert nicht.",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen erst abschließen oder verwerfen.",
        },
      },
      success: {
        title: "Kasse geöffnet",
        description: "Die Schicht läuft. Ersten Verkauf erfassen.",
      },
      response: {
        id: "Schicht",
        terminalId: "Kasse",
        openedAt: "Geöffnet",
        status: "Status",
        openingFloat: "Anfangsbestand",
      },
    },
  },

  sessionClose: {
    post: {
      mixedCash:
        "Barzahlungen in einer anderen Währung müssen vor dem Kassenabschluss abgestimmt werden.",
      title: "Sitzung schließen",
      titleShort: "Sitzung schließen",
      description: "Kassensitzung schließen und Abschlussbestand erfassen.",
      widget: {
        backToTerminals: "Zurück",
        sessionSummary: "Sitzungsübersicht",
        terminal: "Terminal",
        openedAt: "Geöffnet um",
        orderCount: "Bestellungen: {{count}}",
        sessionRevenue: "Umsatz",
        floatHint: "Zählen Sie alle Scheine und Münzen in der Kasse.",
        reconciliation: "Tagesabschluss",
        sessionReady: "Sitzung",
        active: "Aktiv",
        openingFloat: "Anfangsbestand",
        cashSales: "Barverkäufe",
        expectedClosingFloat: "Soll in der Kasse",
        actualClosingFloat: "Gezählt",
        variance: "Differenz",
        reconciliationTitle: "Kassensturz",
        title: "Kasse schließen",
        subtitle: "{{terminal}} · geöffnet seit {{time}}",
        cashRefunds: "Bar-Erstattungen",
        balanced: "Kasse stimmt",
        over: "{{amount}} zu viel",
        short: "{{amount}} zu wenig",
        openSaleBlocks:
          "An dieser Kasse ist noch ein Verkauf offen. Schließen Sie ihn in der Kasse ab oder stornieren Sie ihn, dann die Kasse schließen.",
        backToPos: "Zurück zur Kasse",
      },
      sessionId: {
        label: "Sitzungs-ID",
        description: "Zu schließende Sitzung",
      },
      closingFloat: {
        label: "Gezähltes Bargeld",
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
        cashRefundsTotal: "Bar-Erstattungen",
        openingFloat: "Öffnungsbestand",
        variance: "Differenz",
        orderCount: "Bestellanzahl",
      },
    },
  },

  sessionGet: {
    get: {
      title: "Schichtübersicht",
      titleShort: "Schicht",
      description:
        "Eine Schicht an einer Kasse: Beginn, Kassierer und Sollbestand der Schublade.",
      widget: {
        title: "Schicht",
        back: "Zurück",
        loading: "Schicht wird geladen",
        selling: "Verkauft",
        closed: "Geschlossen",
        subtitleOpen: "Offen seit {{time}}",
        subtitleClosed: "Geschlossen am {{time}}",
        sales: "Verkäufe",
        closeTill: "Kasse schließen",
        openRegister: "Zur Kasse",
        drawerTitle: "Kassenschublade",
        variance: "Differenz",
        closeSession: "Kasse schließen",
        newOrder: "Neue Bestellung",
      },
      sessionId: {
        label: "Schicht",
        description: "Die anzuzeigende Schicht",
      },
      errors: {
        validation: {
          title: "Schicht prüfen",
          description: "Dieser Schicht-Link ist ungültig.",
        },
        unauthorized: {
          title: "Anmeldung erforderlich",
          description: "Melde dich an, um Schichten zu sehen.",
        },
        forbidden: {
          title: "Kein Zugriff",
          description: "Du bist kein Mitglied des Unternehmens dieser Kasse.",
        },
        conflict: {
          title: "Konflikt",
          description:
            "Die Daten haben sich geändert. Neu laden und erneut versuchen.",
        },
        server: {
          title: "Schicht nicht geladen",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        unknown: {
          title: "Schicht nicht geladen",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        network: {
          title: "Keine Verbindung",
          description: "Verbindung prüfen und erneut versuchen.",
        },
        notFound: {
          title: "Schicht nicht gefunden",
          description: "Diese Schicht existiert nicht.",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen erst abschließen oder verwerfen.",
        },
      },
      success: {
        title: "Schicht geladen",
        description: "Die Kassenzahlen sind aktuell.",
      },
      response: {
        id: "Schicht",
        terminalId: "Kasse",
        terminalName: "Kasse",
        companyName: "Unternehmen",
        cashierUserId: "Kassierer",
        cashierName: "Kassierer",
        status: "Status",
        openedAt: "Geöffnet",
        closedAt: "Geschlossen",
        openingFloat: "Anfangsbestand",
        closingFloat: "Gezählt beim Schließen",
        cashSalesTotal: "Barverkäufe",
        cashRefundsTotal: "Barerstattungen",
        expectedCash: "Sollbestand",
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
        noProductResults:
          "Keine Treffer. Geben Sie die Artikeldaten unten ein.",
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
      mergeWithLine: {
        label: "Zur passenden Zeile hinzufügen",
        description:
          "Erhöht die Menge einer vorhandenen Zeile für dieses Produkt",
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
        chooseLine: "Position auswählen",
        backToOrder: "Zurück zur Bestellung",
      },
      orderId: {
        label: "Bestellung",
        description: "Bestellung, aus der der Artikel entfernt wird",
      },
      quantity: {
        label: "Zu entfernende Menge",
        description: "Leer lassen, um die ganze Zeile zu entfernen",
      },
      itemId: { label: "Position", description: "Zu entfernender Artikel" },
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
        tendered:
          "Die Zahlung wurde bereits erfasst. Bestellung und Positionen sind für Änderungen gesperrt.",
        closed: "Diese Bestellung ist abgeschlossen.",
        backToList: "Zurück zur Bestellliste",
      },
      orderId: {
        label: "Bestellung",
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
        refund: "Erstatten",
        addItem: "Artikel hinzufügen",
        addPayment: "Zahlung hinzufügen",
        complete: "Bestellung abschließen",
        void: "Bestellung stornieren",
        back: "Zurück",
        outstanding: "Offen",
        fullyPaid: "Vollständig bezahlt",
        qtyTimesPrice: "×",
        loading: "Auftrag wird geladen...",
        noItems: "Fügen Sie den ersten Artikel hinzu.",
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
        title: "Verkäufe",
        subtitleAll: "Alle Kassenverkäufe, neueste zuerst.",
        subtitleSession: "Verkäufe dieser Kassenschicht, neueste zuerst.",
        openRegister: "Zur Kasse",
        colSale: "Verkauf",
        colTime: "Zeit",
        colStatus: "Status",
        colTotal: "Summe",
        count: "Verkäufe: {{count}}",
        newOrder: "Neue Bestellung",
        empty: "Noch keine Verkäufe",
        emptyHint:
          "An der Kasse erfasste Verkäufe erscheinen hier mit ihrem Beleg.",
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
      companyId: {
        label: "Unternehmen",
        description: "Unternehmen, dessen Kassenverkäufe angezeigt werden",
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
        terminalName: "Kasse",
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
      titleShort: "Produkte",
      description:
        "Katalogprodukte nach Name oder Artikelnummer finden, mit Preis und MwSt.",
      widget: {
        title: "Produkte",
        pickTitle: "Produkt wählen",
        subtitle:
          "Nach Name oder Artikelnummer suchen. Gescannte Barcodes treffen exakt.",
        back: "Zurück",
        loading: "Produkte werden geladen",
        emptyTitle: "Noch keine Produkte",
        emptyMessage: "Produkte aus deinem Katalog erscheinen hier mit Preis.",
        noMatchTitle: "Kein Treffer für „{{query}}“",
        noMatchMessage: "Schreibweise prüfen oder nach Artikelnummer suchen.",
        vat: "MwSt. {{rate}}",
        noVat: "Ohne MwSt.",
        perUnit: "pro {{unit}}",
      },
      companyId: {
        label: "Unternehmen",
        description: "Nur Produkte dieses Unternehmens",
      },
      query: {
        label: "Produkte suchen",
        description: "Produktname oder Artikelnummer. Leer lassen zum Stöbern.",
        placeholder: "Name oder Artikelnummer",
      },
      currency: {
        label: "Währung",
        description: "Nur Produkte mit Preis in dieser Währung",
      },
      page: {
        label: "Seite",
        description: "Seitennummer, ab 1",
      },
      pageSize: {
        label: "Pro Seite",
        description: "Treffer pro Seite, höchstens 50",
      },
      errors: {
        validation: {
          title: "Suche prüfen",
          description: "Höchstens 120 Zeichen.",
        },
        unauthorized: {
          title: "Anmeldung erforderlich",
          description: "Melde dich an, um Produkte zu suchen.",
        },
        forbidden: {
          title: "Kein Zugriff",
          description: "Du bist kein Mitglied dieses Unternehmens.",
        },
        conflict: {
          title: "Konflikt",
          description:
            "Die Daten haben sich geändert. Neu laden und erneut versuchen.",
        },
        server: {
          title: "Suche fehlgeschlagen",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        unknown: {
          title: "Suche fehlgeschlagen",
          description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        },
        network: {
          title: "Keine Verbindung",
          description: "Verbindung prüfen und erneut versuchen.",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Produkte gefunden.",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Änderungen erst abschließen oder verwerfen.",
        },
      },
      success: {
        title: "Produkte gefunden",
        description: "Die Treffer sind aktuell.",
      },
      response: {
        id: "Produkt",
        name: "Name",
        sku: "Artikelnummer",
        type: "Typ",
        basePrice: "Preis",
        currency: "Währung",
        defaultTaxRate: "MwSt.-Satz",
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

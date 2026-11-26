import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Kasse",
    register: "Kassenansicht",
  },
  enums: {
    sessionStatus: {
      open: "Geöffnet",
      closed: "Geschlossen",
    },
  },
  get: {
    title: "Kasse",
    titleShort: "Kasse",
    description:
      "Verkäufe an einer geöffneten Kasse erfassen: Produkte scannen oder antippen, kassieren, Beleg übergeben.",
    sessionId: {
      label: "Kassenschicht",
      description: "Die geöffnete Schicht, auf der verkauft wird",
    },
    response: {
      status: "Kassenstatus",
      terminalName: "Kasse",
      companyName: "Unternehmen",
      currency: "Währung",
      openedAt: "Geöffnet",
      openingFloat: "Anfangsbestand",
      salesCount: "Verkäufe",
      salesTotal: "Umsatz",
      openOrders: "Geparkte Verkäufe",
      orderNumber: "Verkauf",
      itemCount: "Artikel",
      total: "Summe",
      createdAt: "Begonnen",
    },
    errors: {
      validation: {
        title: "Ungültige Kassenschicht",
        description: "Öffnen Sie die Kasse über das POS-Dashboard.",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Melden Sie sich an, um die Kasse zu nutzen.",
      },
      forbidden: {
        title: "Kein Zugriff auf diese Kasse",
        description:
          "Sie sind kein Mitglied des Unternehmens, dem diese Kasse gehört.",
      },
      conflict: {
        title: "Kasse wurde geändert",
        description:
          "Die Kasse wurde an anderer Stelle geändert. Neu laden und erneut versuchen.",
      },
      server: {
        title: "Kasse konnte nicht geladen werden",
        description:
          "Auf unserer Seite ist etwas schiefgelaufen. Versuchen Sie es gleich noch einmal.",
      },
      unknown: {
        title: "Kasse konnte nicht geladen werden",
        description:
          "Ein unerwarteter Fehler ist aufgetreten. Bitte erneut versuchen.",
      },
      network: {
        title: "Keine Verbindung",
        description: "Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
      },
      notFound: {
        title: "Kassenschicht nicht gefunden",
        description: "Diese Schicht existiert nicht mehr.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Schließen Sie den aktuellen Verkauf zuerst ab oder verwerfen Sie ihn.",
      },
    },
    success: {
      title: "Kasse bereit",
      description: "Die Kasse ist geladen.",
    },
  },
  widget: {
    back: "Zurück",
    subtitle: "{{company}} · geöffnet seit {{time}}",
    takings: "Schichtumsatz: {{total}} · Verkäufe: {{count}}",
    sales: "Verkäufe",
    closeTill: "Kasse schließen",
    search: {
      label: "Produkte suchen",
      placeholder: "Barcode scannen oder Produkt suchen",
      hint: "zum Suchen, Enter fügt den Artikel hinzu",
      clear: "Suche leeren",
    },
    products: {
      title: "Produkte",
      none: "Keine Treffer für „{{query}}“.",
      emptyCatalog: "Keine aktiven Produkte mit Preis in {{currency}}.",
      addProducts: "Produkte anlegen",
      inCart: "Im Verkauf: {{count}}",
      loading: "Produkte werden geladen",
    },
    custom: {
      tile: "Freier Artikel",
      tileHint: "Beliebiger Betrag",
      title: "Freier Artikel",
      description: "Bezeichnung",
      descriptionPlaceholder: "Geschenkverpackung",
      price: "Preis",
      vat: "MwSt. %",
      add: "Zum Verkauf hinzufügen",
      cancel: "Abbrechen",
    },
    cart: {
      title: "Verkauf {{number}}",
      newTitle: "Neuer Verkauf",
      empty: "Produkt scannen oder antippen, um einen Verkauf zu starten.",
      items: "Artikel: {{count}}",
      increase: "Ein {{name}} mehr",
      decrease: "Ein {{name}} weniger",
      remove: "{{name}} entfernen",
      each: "je {{price}}",
      locked: "Zahlung erfasst. Artikel sind gesperrt.",
      subtotal: "Netto",
      vat: "MwSt.",
      total: "Summe",
      paid: "Bezahlt",
      due: "Offen",
      change: "Rückgeld",
      removePayment: "{{method}}-Zahlung entfernen",
      parked: "Geparkte Verkäufe",
      park: "Parken",
      resume: "{{number}} fortsetzen",
    },
    tender: {
      title: "Zahlung",
      cash: "Bar",
      card: "Karte",
      transfer: "Überweisung",
      other: "Sonstige",
      amount: "Erhaltener Betrag",
      reference: "Referenz (optional)",
      referencePlaceholder: "Kartenbeleg oder Überweisungs-ID",
      exact: "Passend",
      take: "{{amount}} kassieren",
      takeShort: "Kassieren",
      changeHint: "Rückgeld: {{amount}}",
      complete: "Verkauf abschließen",
      retryComplete: "Verkauf abschließen",
      pay: "{{amount}} kassieren",
      shortcut: "Strg+Enter",
    },
    void: {
      action: "Stornieren",
      title: "Diesen Verkauf stornieren?",
      message:
        "Der Warenkorb wird geleert. Der Verkauf bleibt als storniert in der Historie.",
      confirm: "Verkauf stornieren",
      cancel: "Verkauf behalten",
      blocked: "Zahlung erfasst. Entfernen Sie die Zahlung vor dem Storno.",
    },
    receipt: {
      title: "Verkauf abgeschlossen",
      number: "Beleg {{number}}",
      giveChange: "Rückgeld geben",
      newSale: "Neuer Verkauf",
      refund: "Erstatten",
      open: "Beleg öffnen",
      paidWith: "Bezahlt mit {{method}}",
    },
    closed: {
      title: "Diese Kasse ist geschlossen",
      message:
        "Öffnen Sie im POS-Dashboard eine neue Schicht, um wieder zu verkaufen.",
      backToPos: "Zurück zur Kasse",
      sales: "Verkäufe dieser Schicht",
    },
    error: {
      title: "Das hat nicht geklappt",
      dismiss: "Schließen",
    },
  },
};

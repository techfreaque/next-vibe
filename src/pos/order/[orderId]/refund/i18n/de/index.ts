import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Kasse",
    order: "Bestellung",
    refund: "Erstattung",
  },
  enums: {
    paymentMethod: {
      cash: "Bar",
      card: "Karte",
      transfer: "Überweisung",
      other: "Sonstige",
    },
  },
  get: {
    title: "Verkaufserstattungen",
    titleShort: "Erstattungen",
    description:
      "Was verkauft wurde, was zurückging und was noch erstattet werden kann.",
    orderId: {
      label: "Verkauf",
      description: "Der abgeschlossene Verkauf",
    },
    response: {
      orderId: "Verkauf",
      orderNumber: "Verkaufsnummer",
      status: "Status",
      currency: "Währung",
      total: "Verkaufssumme",
      refundedTotal: "Erstattet",
      refundableTotal: "Noch erstattbar",
      journalPosted: "In der Buchhaltung gebucht",
      lines: "Artikel",
      orderItemId: "Position",
      description: "Artikel",
      quantity: "Verkauft",
      refundedQuantity: "Erstattet",
      refundableQuantity: "Erstattbar",
      unitPrice: "Einzelpreis",
      lineTotal: "Positionssumme",
      taxRate: "MwSt.-Satz",
      refunds: "Erstattungen",
      refundId: "Erstattung",
      refundNumber: "Erstattungsnummer",
      method: "Erstattet per",
      reason: "Grund",
      createdAt: "Datum",
      cashSession: "Kassenlade",
      sessionId: "Sitzung",
      terminalName: "Kasse",
      available: "Bargeld in der Lade",
    },
    widget: {
      back: "Zurück",
      startRefund: "Artikel erstatten",
      fullyRefunded: "Alles aus diesem Verkauf wurde erstattet.",
      notCompleted: "Nur abgeschlossene Verkäufe können erstattet werden.",
      history: "Erstattungsverlauf",
      noRefunds: "Zu diesem Verkauf gibt es noch keine Erstattungen.",
      loading: "Verkauf wird geladen",
    },
    success: {
      title: "Erstattungen geladen",
      description: "Verkauf und Erstattungsverlauf sind aktuell.",
    },
  },
  post: {
    title: "Verkauf erstatten",
    titleShort: "Erstatten",
    description:
      "Gib das Geld für einen abgeschlossenen Verkauf zurück, komplett oder Position für Position. Der Bestand geht zurück ins Regal, die Buchhaltung zieht nach.",
    orderId: {
      label: "Verkauf",
      description: "Der abgeschlossene Verkauf, der erstattet wird",
    },
    lines: {
      label: "Zu erstattende Artikel",
      description:
        "Position und Menge pro Artikel. Leer lassen, um alles Verbleibende zu erstatten.",
    },
    method: {
      label: "Erstatten per",
      description:
        "Wie das Geld zurückgeht. Bargeld kommt aus einer offenen Kassenlade.",
      placeholder: "Erstattungsart wählen",
    },
    sessionId: {
      label: "Kassenlade",
      description:
        "Offene Sitzung, aus der das Bargeld ausgezahlt wird. Standard ist deine offene Sitzung an einer Kasse in der Währung des Verkaufs.",
    },
    reason: {
      label: "Grund",
      description:
        "Warum das Geld zurückgeht. Wird bei der Erstattung gespeichert.",
      placeholder: "Zum Beispiel: beschädigten Artikel zurückgegeben",
    },
    response: {
      refundId: "Erstattung",
      refundNumber: "Erstattungsnummer",
      orderId: "Verkauf",
      sessionId: "Sitzung",
      method: "Erstattet per",
      currency: "Währung",
      subtotal: "Netto",
      taxAmount: "MwSt.",
      total: "Jetzt erstattet",
      refundedTotal: "Insgesamt erstattet",
      fullyRefunded: "Vollständig erstattet",
      journalEntryId: "Buchungssatz",
      stockReturned: "Produkte zurück im Bestand",
    },
    widget: {
      back: "Zurück zum Verkauf",
      items: "Was zurückgeht",
      selectAll: "Alles erstatten",
      clear: "Leeren",
      decrease: "{{item}}: eins weniger",
      increase: "{{item}}: eins mehr",
      all: "Alle",
      sold: "{{quantity}} verkauft",
      alreadyRefunded: "{{quantity}} bereits erstattet",
      nothingLeft: "Vollständig erstattet",
      summary: "Erstattung",
      net: "Netto",
      vat: "MwSt.",
      total: "Erstattungssumme",
      cashFrom: "Ausgezahlt aus der Lade an {{terminal}}",
      drawerAvailable: "In der Lade: {{amount}}",
      noCashSession:
        "Öffne eine Sitzung an einer Kasse in {{currency}}, um bar zu erstatten.",
      drawerShort:
        "In der Lade ist weniger Bargeld als für diese Erstattung nötig.",
      confirmTitle: "{{amount}} erstatten?",
      confirmDescription:
        "Das Geld geht per {{method}} zurück. Bestand und Buchhaltung werden aktualisiert. Eine Erstattung lässt sich nicht rückgängig machen.",
      confirm: "Erstatten",
      cancel: "Abbrechen",
      pickItems: "Wähle mindestens einen Artikel.",
      reasonMissing: "Gib einen Grund an.",
      loading: "Verkauf wird geladen",
      viewRefunds: "Erstattungen ansehen",
      newSale: "Zurück zum Verkauf",
    },
    success: {
      title: "Erstattung erledigt",
      description: "Das Geld ist auf dem Weg zurück zum Kunden.",
    },
  },
  messages: {
    notCompleted: "Nur abgeschlossene Verkäufe können erstattet werden.",
    invalidLine: "Wähle Artikel aus diesem Verkauf mit einer Menge über null.",
    nothingLeft: "Bei diesem Verkauf gibt es nichts mehr zu erstatten.",
    overRefund:
      "Das ist mehr als verkauft wurde, abzüglich früherer Erstattungen.",
    rounding:
      "Diese Erstattung ist zu klein zum Auszahlen. Füge mehr Artikel hinzu.",
    cashSessionRequired:
      "Bar-Erstattungen brauchen eine offene Sitzung an einer Kasse in der Währung des Verkaufs.",
    sessionInvalid: "Wähle eine offene Sitzung dieses Unternehmens.",
    cashCurrencyMismatch:
      "Diese Kasse arbeitet in einer anderen Währung als der Verkauf.",
    drawerShort:
      "In der Lade ist weniger Bargeld als für diese Erstattung nötig.",
    postingUnavailable:
      "Die Erstattung konnte nicht gebucht werden. Prüfe, ob eine Buchungsperiode offen ist.",
    stockUnavailable:
      "Der Bestand konnte nicht zurückgebucht werden. Prüfe, ob das Lager aktiv ist.",
  },
  errors: {
    validation: {
      title: "Erstattung prüfen",
      description: "Wähle Artikel, eine Erstattungsart und einen Grund.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melde dich an, um Verkäufe zu erstatten.",
    },
    forbidden: {
      title: "Kein Zugriff",
      description: "Du darfst für dieses Unternehmen keine Verkäufe erstatten.",
    },
    notFound: {
      title: "Verkauf nicht gefunden",
      description:
        "Dieser Verkauf existiert nicht oder gehört zu einem anderen Unternehmen.",
    },
    conflict: {
      title: "Erstattung nicht möglich",
      description: "Der Verkauf oder die Lade lässt diese Erstattung nicht zu.",
    },
    server: {
      title: "Erstattung fehlgeschlagen",
      description: "Es wurde nichts erstattet. Versuch es noch einmal.",
    },
    unknown: {
      title: "Erstattung fehlgeschlagen",
      description: "Es wurde nichts erstattet. Versuch es noch einmal.",
    },
    network: {
      title: "Keine Verbindung",
      description: "Prüfe deine Verbindung und versuch es noch einmal.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Schließe deine Änderungen ab oder verwirf sie zuerst.",
    },
  },
};

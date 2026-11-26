import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Kasse",
    order: "Verkauf",
    removePayment: "Zahlung entfernen",
  },
  enums: {
    paymentMethod: {
      cash: "Bar",
      card: "Karte",
      transfer: "Überweisung",
      other: "Sonstige",
    },
  },
  post: {
    title: "Zahlung entfernen",
    titleShort: "Zahlung entfernen",
    description:
      "Eine Zahlung von einem offenen Verkauf zurücknehmen. Für falsch eingegebene Zahlungen.",
    orderId: {
      label: "Verkauf",
      description: "Der offene Verkauf mit der Zahlung",
    },
    paymentId: {
      label: "Zahlung",
      description: "Die Zahlung, die vom Verkauf entfernt wird",
    },
    response: {
      orderId: "Verkauf",
      paymentId: "Entfernte Zahlung",
      sessionId: "Kassensitzung",
      currency: "Währung",
      totalPaid: "Bisher bezahlt",
      outstanding: "Noch offen",
      remainingPayments: "Verbleibende Zahlungen",
    },
    widget: {
      back: "Zurück zum Verkauf",
      pickPayment: "Zu entfernende Zahlung wählen",
      noPayments: "Dieser Verkauf hat keine Zahlungen.",
      notOpen: "Zahlungen lassen sich nur bei offenen Verkäufen entfernen.",
      loading: "Verkauf wird geladen",
      change: "Wechselgeld {{amount}}",
      selected: "Ausgewählt",
      amount: "Betrag",
      confirmTitle: "Diese Zahlung entfernen?",
      confirmDescription:
        "Der Verkauf bleibt offen. Danach die richtige Zahlung erfassen.",
      confirm: "Zahlung entfernen",
      cancel: "Abbrechen",
      stillDue: "Noch offen",
      paidSoFar: "Bisher bezahlt",
      nothingPaid: "Auf diesem Verkauf ist keine Zahlung mehr.",
    },
    success: {
      title: "Zahlung entfernt",
      description: "Der Verkauf ist bereit für eine neue Zahlung.",
    },
  },
  errors: {
    validation: {
      title: "Zahlung prüfen",
      description: "Eine Zahlung dieses Verkaufs wählen.",
    },
    unauthorized: {
      title: "Anmeldung nötig",
      description: "Melde dich an, um Verkäufe zu ändern.",
    },
    forbidden: {
      title: "Kein Zugriff",
      description: "Du darfst Verkäufe dieses Unternehmens nicht ändern.",
    },
    notFound: {
      title: "Zahlung nicht gefunden",
      description: "Diese Zahlung ist nicht mehr auf dem Verkauf.",
    },
    conflict: {
      title: "Verkauf nicht offen",
      description:
        "Zahlungen lassen sich nur entfernen, solange Verkauf und Kassensitzung offen sind.",
    },
    server: {
      title: "Zahlung nicht entfernt",
      description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    },
    unknown: {
      title: "Zahlung nicht entfernt",
      description: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    },
    network: {
      title: "Keine Verbindung",
      description: "Verbindung prüfen und erneut versuchen.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Änderungen zuerst abschließen oder verwerfen.",
    },
  },
};

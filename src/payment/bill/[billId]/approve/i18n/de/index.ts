import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  receiveBill: "Als eingegangen markieren",
  supplierDocument: {
    confirmMissing: "Bestätigen, dass kein Lieferantenbeleg vorliegt",
    confirmSeparate:
      "Bestätigen, dass es sich um eine separate Belastung handelt",
    missingHelp:
      "Prüfen Sie den Bankbeleg. Bei Freigabe wird der Bruttobetrag ohne Vorsteuerabzug gebucht.",
    required:
      "Verknüpfen Sie den Lieferantenbeleg oder bestätigen Sie, dass er fehlt. Für die Freigabe auf Bankbelegbasis sind der belegte Bruttobetrag und keine Umsatzsteuerbuchung erforderlich.",
    possibleDuplicate:
      "Ein Bankentwurf oder Lieferantenbeleg weist ähnliche Daten auf. Verknüpfen Sie den Beleg oder bestätigen Sie die separate Belastung.",
  },
  reverseCharge: {
    title: "Reverse Charge (optional)",
    base: "Bemessungsgrundlage in Belegwährung",
    rate: "Umsatzsteuersatz (%)",
    help: "Geben Sie bei einer empfangenen Rechnung beide Werte nur an, wenn die Steuerschuldnerschaft des deutschen Kleinunternehmers geklärt ist. Der Betrag wird als Aufwand und Umsatzsteuerverbindlichkeit gebucht.",
    invalid:
      "Geben Sie bei einer empfangenen Rechnung eines deutschen Kleinunternehmers die bestätigte Bemessungsgrundlage und den Steuersatz an.",
    cost: "Nicht abzugsfähige Umsatzsteuer nach § 13b",
  },
  tags: { payment: "zahlung", bill: "rechnung", ap: "kreditorenbuchhaltung" },
  enums: {
    billStatus: {
      DRAFT: "Entwurf",
      RECEIVED: "Eingegangen",
      APPROVED: "Genehmigt",
      PAID: "Bezahlt",
      DISPUTED: "Strittig",
    },
  },
  post: {
    title: "Rechnungsstatus prüfen",
    titleShort: "Rechnungsstatus prüfen",
    description:
      "Ändert den Status einer Eingangsrechnung im Entwurf oder mit Status Erhalten.",
    billId: {
      label: "Rechnungs-ID",
      description: "Die zu genehmigende Rechnung",
    },
    errors: {
      existingPosting:
        "Klären Sie die bestehende Buchung für diese Rechnung vor der Freigabe.",
      lineTotalsReview:
        "Die Positionssummen weichen vom erfassten Netto-, Steuer- oder Bruttobetrag ab. Prüfen Sie vor der Freigabe den Originalbeleg.",
      billLines:
        "Fügen Sie Rechnungspositionen mit einem positiven Gesamtbetrag hinzu und verwenden Sie aktive Aufwandskonten dieses Unternehmens.",
      posting:
        "Prüfen Sie Rechnungsbeträge, Unternehmenswährung, Buchungsperiode und Buchungskonten.",
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Rechnungs-ID",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Rechnungen zu genehmigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Buchhaltungs- oder Adminrolle erforderlich",
      },
      conflict: {
        title: "Bereits genehmigt",
        description: "Rechnung ist bereits genehmigt oder bezahlt",
      },
      server: {
        title: "Serverfehler",
        description: "Rechnung konnte nicht genehmigt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: { title: "Netzwerkfehler", description: "Verbindung prüfen" },
      notFound: {
        title: "Rechnung nicht gefunden",
        description: "Diese Rechnung existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Rechnung genehmigt",
      description: "Rechnungsstatus erfolgreich aktualisiert",
    },
    response: {
      status: "Neuer Status",
      journalEntryId: "Buchungssatz-ID",
    },
    widget: {
      back: "Zurück",
      submit: "Statusänderung bestätigen",
      confirmTitle: "Rechnung genehmigen?",
      confirmDescription:
        "Ein Entwurf wechselt auf Eingegangen. Bei der Freigabe einer eingegangenen Rechnung wird die Buchung erstellt.",
      confirmButton: "Ja, genehmigen",
      cancelButton: "Abbrechen",
      approved: "Rechnungsstatus aktualisiert",
    },
  },
};

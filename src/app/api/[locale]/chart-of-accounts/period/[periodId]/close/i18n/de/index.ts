import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Periode abschließen",
    titleShort: "Periode schließen",
    description:
      "Buchhaltungsperiode abschließen. Es dürfen keine Buchungen im Entwurfsstatus vorhanden sein.",
    periodId: {
      label: "Perioden-ID",
      description: "Die abzuschließende Periode",
      placeholder: "Perioden-UUID",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Perioden-ID",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Buchhalter-Rolle erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Periode konnte nicht abgeschlossen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Entwürfe vorhanden",
        description: "Alle Buchungen müssen gebucht sein vor Periodenabschluss",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Periode nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Periode abgeschlossen",
      description: "Die Buchhaltungsperiode wurde abgeschlossen",
    },
    widget: {
      closedLabel: "Abgeschlossen",
      failedLabel: "Fehlgeschlagen",
      confirmTitle: "Buchungsperiode abschließen?",
      confirmDescription:
        "Das Abschließen dieser Periode ist unwiderruflich. Keine neuen Buchungen können in eine geschlossene Periode eingetragen werden.",
      confirmButton: "Ja, Periode abschließen",
      cancelButton: "Abbrechen",
    },
  },
  title: "Periode abschließen",
  description: "Buchhaltungsperiode abschließen",
  category: "Kontenplan",
  tag: "Periode",
};

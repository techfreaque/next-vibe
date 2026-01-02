import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Leistungs-Insight analysieren",
  description:
    "Bietet detailliertere Informationen zu einem spezifischen Leistungs-Insight eines Insight-Sets, das in den Ergebnissen einer Trace-Aufzeichnung hervorgehoben wurde",
  form: {
    label: "Leistungs-Insight analysieren",
    description: "Detaillierte Informationen über einen spezifischen Leistungs-Insight abrufen",
    fields: {
      insightSetId: {
        label: "Insight-Set-ID",
        description:
          "Die ID für das spezifische Insight-Set (nur IDs aus der Liste Verfügbare Insight-Sets verwenden)",
        placeholder: "Insight-Set-ID eingeben",
      },
      insightName: {
        label: "Insight-Name",
        description:
          "Der Name des Insights, über den Sie mehr Informationen wünschen (z.B. DocumentLatency oder LCPBreakdown)",
        placeholder: "Insight-Namen eingeben",
      },
    },
  },
  response: {
    success: "Leistungs-Insight erfolgreich analysiert",
    result: "Ergebnis der Leistungs-Insight-Analyse",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist bei der Analyse des Leistungs-Insights aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Leistungs-Insights zu analysieren",
    },
    forbidden: {
      title: "Verboten",
      description: "Analysieren von Leistungs-Insights ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist bei der Analyse des Leistungs-Insights aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist bei der Analyse des Leistungs-Insights aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist bei der Analyse des Leistungs-Insights aufgetreten",
    },
  },
  success: {
    title: "Leistungs-Insight erfolgreich analysiert",
    description: "Der Leistungs-Insight wurde erfolgreich analysiert",
  },
};

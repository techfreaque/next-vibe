import { translations as engagementTranslations } from "../../engagement/i18n/de";
import { translations as pixelTranslations } from "../../pixel/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  engagement: engagementTranslations,
  pixel: pixelTranslations,
  existing: {
    found: "Vorhandenes Lead-Tracking gefunden",
  },
  component: {
    initialized: "Lead-Tracking-Komponente initialisiert",
  },
  error: "Fehler beim Lead-Tracking",
  data: {
    captured: "Lead-Tracking-Daten erfasst",
    capture: {
      error: "Fehler beim Erfassen der Lead-Tracking-Daten",
    },
    retrieve: {
      error: "Fehler beim Abrufen der Lead-Tracking-Daten",
    },
    loaded: {
      signup: "Lead-Tracking-Daten für Anmeldung geladen",
    },
    load: {
      error: {
        noncritical: "Fehler beim Laden der Lead-Tracking-Daten (unkritisch)",
      },
    },
    stored: "Lead-Tracking-Daten gespeichert",
    store: {
      error: "Fehler beim Speichern der Lead-Tracking-Daten",
    },
    cleared: "Lead-Tracking-Daten gelöscht",
    clear: {
      error: "Fehler beim Löschen der Lead-Tracking-Daten",
    },
    format: {
      error: "Fehler beim Formatieren der Tracking-Daten",
    },
  },
  params: {
    validate: {
      error: "Fehler beim Validieren der Tracking-Parameter",
    },
  },
};

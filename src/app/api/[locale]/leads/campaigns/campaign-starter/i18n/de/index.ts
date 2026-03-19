import { translations as campaignStarterConfigTranslations } from "../../campaign-starter-config/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kampagnen-Verwaltung",

  campaignStarterConfig: campaignStarterConfigTranslations,
  tag: "Kampagnenstarter",
  task: {
    description:
      "Kampagnen für neue Leads starten, indem sie in den PENDING-Status versetzt werden",
  },
  post: {
    title: "Kampagnenstarter",
    description: "Kampagnen für neue Leads starten",
    container: {
      title: "Kampagnenstarter-Konfiguration",
      description: "Kampagnenstarter-Parameter konfigurieren",
    },
    fields: {
      dryRun: {
        label: "Testlauf",
        description: "Ausführen ohne Änderungen vorzunehmen",
      },
      force: {
        label: "Erzwingen",
        description: "Tages-/Stunden-Zeitplaneinschränkungen umgehen",
      },
    },
    response: {
      leadsProcessed: "Verarbeitete Leads",
      leadsStarted: "Gestartete Leads",
      leadsSkipped: "Übersprungene Leads",
      executionTimeMs: "Ausführungszeit (ms)",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      server: {
        title: "Serverfehler",
        description:
          "Bei der Verarbeitung der Kampagnenstarter-Anfrage ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
    },
    success: {
      title: "Kampagnenstarter abgeschlossen",
      description: "Kampagnenstarter wurde erfolgreich ausgeführt",
    },
  },
  widget: {
    title: "Kampagnenstarter ausführen",
    description:
      "Manuell den Kampagnenstarter auslösen, um berechtigte Leads zu verarbeiten und E-Mail-Sequenzen zu starten.",
    runButton: "Kampagnen starten",
    running: "Läuft...",
    done: "Fertig",
  },
  errors: {
    server: {
      title: "Serverfehler",
      description:
        "Bei der Verarbeitung der Kampagnenstarter-Anfrage ist ein Fehler aufgetreten",
    },
    invalidTransition: "Ungültiger Statusübergang für den Kampagnenstart",
  },
};

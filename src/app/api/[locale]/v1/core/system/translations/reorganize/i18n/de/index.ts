import { translations as repositoryTranslations } from "../../repository/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Übersetzungen reorganisieren",
    description:
      "Übersetzungsdateien reorganisieren und ungenutzte Schlüssel entfernen",
    form: {
      title: "Reorganisationsoptionen",
      description: "Übersetzungsreorganisationsparameter konfigurieren",
    },
    container: {
      title: "Übersetzungsreorganisation",
      description: "Übersetzungsdateien reorganisieren und optimieren",
    },
    fields: {
      removeUnused: {
        title: "Ungenutzte Schlüssel entfernen",
        description:
          "Übersetzungsschlüssel entfernen, die im Code nicht verwendet werden",
      },
      dryRun: {
        title: "Probelauf",
        description: "Änderungen vorher anzeigen ohne Dateien zu ändern",
      },
      backup: {
        title: "Sicherung erstellen",
        description: "Sicherung vor Änderungen erstellen",
      },
      regenerateStructure: {
        title: "Struktur regenerieren",
        description:
          "Übersetzungsdateistruktur basierend auf Verwendung regenerieren",
      },
      regenerateKeys: {
        title: "Schlüssel regenerieren",
        description:
          "Übersetzungsschlüssel basierend auf Dateipfaden regenerieren",
      },
      success: {
        title: "Operation erfolgreich",
      },
      summary: {
        title: "Zusammenfassung",
      },
      output: {
        title: "Ausgabe",
      },
      duration: {
        title: "Dauer",
      },
      backupPath: {
        title: "Sicherungspfad",
      },
      changes: {
        title: "Änderungen",
      },
    },
    messages: {
      foundKeys: "Gefundene Schlüssel",
      removingKeys: "Schlüssel entfernen",
      regeneratedStructure: "Struktur regeneriert",
      backupCreated: "Sicherung erstellt",
      starting: "Reorganisation starten",
      scanningUsage: "Verwendung scannen",
      loadingFiles: "Dateien laden",
      dryRunCompleted: "Probelauf abgeschlossen",
      removedKeysFromLanguage: "Schlüssel aus Sprache entfernt",
      unusedKeysLabel: "Ungenutzte Schlüssel",
      regeneratingStructure: "Struktur regenerieren",
      analyzingFrequency: "Häufigkeit analysieren",
      groupingByLocation: "Nach Standort gruppieren",
      generatingFiles: "Dateien generieren",
      completed: "Abgeschlossen",
      noKeysInUse: "Keine Schlüssel in Verwendung",
      writingFilteredTranslations: "Gefilterte Übersetzungen schreiben",
      removeUnusedRequiresRegenerate: "removeUnused erfordert, dass regenerateStructure aktiviert ist",
    },
    response: {
      title: "Reorganisationsergebnis",
      description: "Ergebnisse der Übersetzungsreorganisation",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Reorganisationsparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Übersetzungsreorganisation erfolgreich abgeschlossen",
    },
  },
  repository: repositoryTranslations,
};

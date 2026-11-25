import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Skills",
  },
  get: {
    title: "Charakterkarte exportieren",
    titleShort: "Karte exportieren",
    description:
      "Exportiert einen Skill als Charakterkarte im Format V2 (JSON). Importierbar in SillyTavern, RisuAI, Chub und jeder Tavern-kompatiblen App, oder als Backup. Funktioniert für deine eigenen Skills, öffentliche Community-Skills und öffentliche eingebaute Skills. Die Karte nennt den Ersteller und verlinkt die Skill-Seite.",
    dynamicTitle: "Export: {{name}}",
    id: {
      label: "Skill",
      description: "Der Skill, der exportiert wird",
    },
    widget: {
      intro:
        "Dein Charakter als Datei, die dir gehört. Charakterkarte V2, das Format, das SillyTavern, RisuAI und Chub importieren.",
      included:
        "Enthalten: Name, kompletter Charakter-Prompt, Tagline, Beschreibung, Ersteller und ein Link hierher.",
      download: "Karte herunterladen",
      copy: "JSON kopieren",
      copied: "Kopiert",
    },
    card: {
      skillPage: "Skill-Seite: {{url}}",
    },
    response: {
      name: { content: "Name" },
      fileName: { content: "Dateiname" },
      card: { content: "Karten-JSON" },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Prüfe die Skill-ID.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Der Server ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Anmeldung nötig",
        description: "Melde dich an, um diesen Skill zu exportieren.",
      },
      forbidden: {
        title: "Nicht erlaubt",
        description: "Du darfst diesen Skill nicht exportieren.",
      },
      notFound: {
        title: "Skill nicht gefunden",
        description:
          "Diesen Skill gibt es nicht oder er ist für dich nicht sichtbar.",
      },
      server: {
        title: "Export fehlgeschlagen",
        description:
          "Beim Erstellen der Karte ist etwas schiefgelaufen. Versuch es erneut.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Der Skill hat sich während des Exports geändert. Versuch es erneut.",
      },
    },
    success: {
      title: "Karte bereit",
      description: "Lade sie herunter oder kopiere das JSON.",
    },
  },
};

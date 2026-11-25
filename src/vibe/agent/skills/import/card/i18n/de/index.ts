import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Skills",
  },
  enums: {
    visibility: {
      private: "Privat",
      unlisted: "Nicht gelistet",
      public: "Öffentlich",
    },
  },
  post: {
    title: "Charakterkarte importieren",
    titleShort: "Karte importieren",
    description:
      "Importiert eine Charakterkarte (V1, V2 oder V3) aus SillyTavern, Chub, RisuAI oder jeder Tavern-kompatiblen App. Akzeptiert die .json-Datei, eine .png-Karte mit eingebetteten Daten oder das Karten-JSON als Text. Name, Beschreibung, Persönlichkeit, Szenario, erste Nachricht, Beispieldialog, Kartenanweisungen und Tags werden zu einem neuen Charakter in deinem Besitz. Das Bild einer PNG-Karte wird zum Avatar. Nichts aus der Karte wird ausgeführt. Dieselbe Karte ein zweites Mal liefert den vorhandenen Charakter.",
    intro:
      "Nimm deine Charaktere mit. Lade die Kartendatei hoch, die du aus SillyTavern, Chub oder RisuAI exportiert hast.",
    supported: "Karten V1, V2 und V3. JSON oder PNG, bis 10 MB.",
    mapping: {
      title: "Was übernommen wird",
      fields:
        "Name, Beschreibung, Persönlichkeit, Szenario, erste Nachricht, Beispieldialog, Kartenanweisungen, Tags, Ersteller.",
      avatar: "PNG-Karten: Das Bild wird zum Avatar.",
      safe: "Lorebooks und Skripte bleiben draußen. Nichts aus der Karte wird ausgeführt.",
    },
    card: {
      label: "Kartendatei",
      description: "Charakterkarte als .json oder .png",
      validation: {
        required: "Wähle eine Kartendatei.",
        tooLarge: "Die Kartendatei ist größer als 10 MB.",
      },
    },
    visibility: {
      label: "Sichtbarkeit",
      description:
        "Privat: nur für dich. Nicht gelistet: nicht in der öffentlichen Liste. Öffentlich: für alle gelistet.",
    },
    response: {
      id: { content: "Charakter-ID" },
      name: { content: "Name" },
      platform: { content: "Quelle" },
      creatorName: { content: "Ersteller der Karte" },
      sourceUrl: { content: "Quell-Link" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Bereits importiert" },
      importedFields: { content: "Importiert" },
    },
    fields: {
      name: "Name",
      avatar: "Avatar",
      greeting: "erste Nachricht",
      description: "Beschreibung",
      definition: "Persönlichkeit und Szenario",
      tags: "Tags",
    },
    result: {
      imported: "{{name}} ist bereit.",
      alreadyImported:
        "Du hast {{name}} schon importiert. Deine Kopie wird geöffnet.",
      fieldsList: "Importiert: {{fields}}",
      openSkill: "Charakter öffnen",
      importAnother: "Weitere Karte importieren",
    },
    errors: {
      validation: {
        title: "Ungültige Karte",
        description: "Wähle eine Charakterkarte (.json oder .png).",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Der Server ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Anmeldung nötig",
        description: "Melde dich an, um Charaktere zu importieren.",
      },
      forbidden: {
        title: "Nicht erlaubt",
        description: "Dein Konto darf keine Charaktere importieren.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die Karte wurde nicht gefunden.",
      },
      server: {
        title: "Import fehlgeschlagen",
        description: "Beim Import ist etwas schiefgelaufen. Versuch es erneut.",
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
        title: "Import läuft",
        description: "Diese Karte wird gerade importiert.",
      },
      invalidCard:
        "Keine Charakterkarte. Nutze die .json- oder .png-Datei, die SillyTavern, Chub oder RisuAI exportiert.",
      noCardInPng:
        "Dieses PNG enthält keine Kartendaten. Exportiere es erneut als Charakterkarte oder nutze die .json-Datei.",
      rateLimited:
        "Zu viele Importe. Warte {{seconds}} Sekunden und versuch es erneut.",
    },
    success: {
      title: "Charakter importiert",
      description: "Deine Kopie ist bereit zum Chatten.",
    },
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      label: "Karte importieren",
      loadingText: "Importiere...",
    },
  },
};

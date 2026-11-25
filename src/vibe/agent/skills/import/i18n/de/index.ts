import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Skills",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
      characterCard: "Charakterkarte",
    },
    visibility: {
      private: "Privat",
      unlisted: "Nicht gelistet",
      public: "Öffentlich",
    },
  },
  post: {
    title: "Charakter per Link importieren",
    titleShort: "Per Link importieren",
    description:
      "Importiert einen Charakter über einen öffentlichen Link von Character.AI (character.ai, c.ai) oder Talkie (talkie-ai.com). Übernimmt Name, Avatar, Begrüßung, Beschreibung, Definition und Tags in einen neuen Charakter in deinem Besitz, nennt den ursprünglichen Ersteller und verlinkt die Quelle. Derselbe Link ein zweites Mal liefert den vorhandenen Charakter.",
    dynamicTitle: "Import: {{url}}",
    intro:
      "Füge einen öffentlichen Charakter-Link ein. Wir übernehmen, was die Seite öffentlich zeigt, und nennen den ursprünglichen Ersteller.",
    supported: "Funktioniert mit Character.AI und Talkie.",
    url: {
      label: "Charakter-Link",
      description: "Öffentlicher Link zur Charakterseite",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "Füge einen vollständigen Link mit https:// ein",
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
      creatorName: { content: "Ursprünglicher Ersteller" },
      sourceUrl: { content: "Quell-Link" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Bereits importiert" },
      importedFields: { content: "Übernommen" },
    },
    fields: {
      name: "Name",
      avatar: "Avatar",
      greeting: "Begrüßung",
      description: "Beschreibung",
      definition: "Definition",
      tags: "Tags",
    },
    result: {
      imported: "{{name}} ist bereit.",
      alreadyImported:
        "Du hast {{name}} bereits importiert. Deine Kopie wird geöffnet.",
      credit: "Ursprünglich von {{creator}} auf {{platform}}",
      creditUnknown: "Importiert von {{platform}}",
      cardCredit: "Karte von {{creator}}",
      cardCreditUnknown: "Aus einer Charakterkarte importiert",
      fieldsList: "Übernommen: {{fields}}",
      openSkill: "Charakter öffnen",
      importAnother: "Weiteren importieren",
    },
    errors: {
      validation: {
        title: "Ungültiger Link",
        description:
          "Füge einen vollständigen öffentlichen Charakter-Link ein.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Melde dich an, um Charaktere zu importieren.",
      },
      forbidden: {
        title: "Nicht erlaubt",
        description: "Dein Konto kann keine Charaktere importieren.",
      },
      notFound: {
        title: "Charakter nicht gefunden",
        description:
          "Die Seite zeigt keine öffentlichen Charakterdaten. Er ist vielleicht privat, gelöscht oder nur mit Login sichtbar.",
      },
      server: {
        title: "Import fehlgeschlagen",
        description:
          "Beim Import ist etwas schiefgelaufen. Versuche es erneut.",
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
        title: "Bereits importiert",
        description: "Diesen Charakter hast du bereits importiert.",
      },
      unsupported:
        "Link wird nicht unterstützt. Füge einen Charakter-Link von Character.AI (character.ai, c.ai) oder Talkie (talkie-ai.com) ein.",
      blocked:
        "{{platform}} hat die Anfrage blockiert. Versuche es in ein paar Minuten erneut oder erstelle den Charakter selbst.",
      noPublicData:
        "{{platform}} zeigt für diesen Charakter keine öffentlichen Daten. Er ist vielleicht privat, gelöscht oder nur mit Login sichtbar.",
      rateLimited:
        "Zu viele Importe. Warte {{seconds}} Sekunden und versuche es erneut.",
      notConfigured:
        "{{platform}}-Seiten brauchen den Seitenabruf, der auf diesem Server nicht eingerichtet ist.",
    },
    success: {
      title: "Charakter importiert",
      description: "Deine Kopie ist bereit zum Chatten.",
    },
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      label: "Importieren",
      loadingText: "Wird importiert...",
    },
  },
};

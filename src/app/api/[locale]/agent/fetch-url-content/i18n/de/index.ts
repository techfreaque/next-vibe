export const translations = {
  category: "Information",
  get: {
    title: "URL-Inhalt Abrufen",
    description:
      "Rufen Sie Inhalte von einer beliebigen URL ab und konvertieren Sie sie in lesbares Markdown-Format. Verwenden Sie dies, wenn Sie Webseiteninhalte lesen oder analysieren müssen.",
    form: {
      title: "URL-Abruf-Parameter",
      description: "Konfigurieren Sie die URL, von der Inhalte abgerufen werden sollen",
    },
    fields: {
      url: {
        title: "URL",
        description: "Die vollständige URL zum Abrufen (muss http:// oder https:// enthalten)",
        placeholder: "https://beispiel.de",
      },
    },
    response: {
      message: {
        title: "Nachricht",
        description: "Statusmeldung über den Abrufvorgang",
      },
      content: {
        title: "Inhalt",
        description: "Der extrahierte Inhalt im Markdown-Format",
      },
      url: {
        title: "Original ansehen",
        description: "Die abgerufene URL",
      },
      statusCode: {
        title: "Statuscode",
        description: "HTTP-Statuscode der Antwort",
      },
      timeElapsed: {
        title: "Verstrichene Zeit (ms)",
        description: "Zeit zum Abrufen des Inhalts in Millisekunden",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die URL ist ungültig oder fehlt",
      },
      internal: {
        title: "Abruffehler",
        description: "Beim Abrufen der URL ist ein Fehler aufgetreten",
      },
    },
    success: {
      title: "Abruf Erfolgreich",
      description: "Der URL-Inhalt wurde erfolgreich abgerufen",
    },
  },
  tags: {
    scraping: "Scraping",
    web: "Web",
    content: "Inhalt",
  },
};

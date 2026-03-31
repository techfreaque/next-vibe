export const translations = {
  category: "Information",
  get: {
    title: "URL-Inhalt Abrufen",
    description:
      "Rufen Sie Inhalte von einer beliebigen URL ab und konvertieren Sie sie in lesbares Markdown-Format. Verwenden Sie dies, wenn Sie Webseiteninhalte lesen oder analysieren müssen.",
    form: {
      title: "URL-Abruf-Parameter",
      description:
        "Konfigurieren Sie die URL, von der Inhalte abgerufen werden sollen",
    },
    fields: {
      url: {
        title: "URL",
        description:
          "Die vollständige URL zum Abrufen (muss http:// oder https:// enthalten)",
        placeholder: "https://beispiel.de",
      },
      query: {
        title: "Suchanfrage (optional)",
        description:
          "Regex-Filter nach dem Abrufen. Nur Absätze die das Muster treffen werden zurückgegeben, nach Trefferzahl gewichtet, bis zum Zeichenlimit. Ohne Angabe erhält man die vollständige Seite (bei großen Seiten mittig gekürzt). Syntax: JS-Regex — 'Authentifizierung', '(login|signup)', 'class\\s+\\w+'. Ungültiger Regex fällt auf wörtliche Übereinstimmung zurück.",
        placeholder: "Authentifizierung",
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
      truncated: {
        title: "Gekürzt",
        description: "Ob der Inhalt aufgrund der Größe gekürzt wurde",
      },
      truncatedNote: {
        title: "Kürzungshinweis",
        description: "Details zur Kürzung und wie man mehr Inhalt erhält",
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
  cleanup: {
    post: {
      title: "URL-Cache Bereinigung",
      description: "Veraltete URL-Cache-Dateien älter als 7 Tage löschen",
      container: {
        title: "Bereinigungsergebnisse",
        description: "Zusammenfassung der gelöschten Cache-Dateien",
      },
      response: {
        deletedCount: "Gelöschte Dateien",
        totalScanned: "Gesamt gescannt",
        retentionDays: "Aufbewahrungstage",
      },
      success: {
        title: "Cache bereinigt",
        description: "Veraltete URL-Cache-Dateien wurden entfernt",
      },
    },
    errors: {
      server: {
        title: "Bereinigungsfehler",
        description:
          "Beim Bereinigen des URL-Caches ist ein Fehler aufgetreten",
      },
    },
    name: "URL-Cache Bereinigung",
    description: "Wöchentliche Bereinigung veralteter URL-Cache-Dateien",
  },
};

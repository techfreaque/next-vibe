export default {
  post: {
    summary: "Interaktiven Modus starten",
    description: "Interaktive Befehlszeilenschnittstelle zum Erkunden verfügbarer Befehle starten",
    response: {
      success: {
        title: "Interaktiver Modus gestartet",
        description: "Der interaktive Modus ist jetzt aktiv",
      },
    },
    errors: {
      unauthorized: {
        title: "Authentifizierung erforderlich",
        description: "Sie müssen authentifiziert sein, um den interaktiven Modus zu verwenden",
      },
      server_error: {
        title: "Start fehlgeschlagen",
        description: "Der interaktive Modus konnte nicht gestartet werden",
      },
    },
  },
};

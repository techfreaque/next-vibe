export const translations = {
  post: {
    title: "Bild anzeigen",
    description:
      "Ruft ein zuvor aufgenommenes Bild über seine Speicher-URL ab. Verwende dies, um einen Screenshot oder ein Bild aus einem früheren Gesprächsschritt erneut zu untersuchen.",
    dynamicTitle: "Anzeigen: {{url}}",
    url: {
      label: "Bild-URL",
      description: "Speicher-URL des anzuzeigenden Bildes",
      placeholder: "https://...",
    },
    response: {
      url: "Bild-URL",
    },
    errors: {
      validation_failed: {
        title: "Validierungsfehler",
        description: "Die angegebene URL ist ungültig",
      },
      network_error: {
        title: "Netzwerkfehler",
        description: "Das Bild konnte nicht abgerufen werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Du bist nicht berechtigt, dieses Bild anzuzeigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Der Zugriff auf dieses Bild ist nicht erlaubt",
      },
      not_found: {
        title: "Bild nicht gefunden",
        description: "Unter der angegebenen URL wurde kein Bild gefunden",
      },
      server_error: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      unknown_error: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsaved_changes: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Bild geladen",
      description: "Das Bild wurde erfolgreich abgerufen",
    },
  },
  tags: {
    vision: "Bildverarbeitung",
    ai: "KI",
  },
};

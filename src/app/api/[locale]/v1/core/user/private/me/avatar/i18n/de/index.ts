import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "avatar",
  upload: {
    title: "Avatar Hochladen",
    description: "Ein Profilbild hochladen",
    groups: {
      fileUpload: {
        title: "Datei Hochladen",
        description: "Wählen Sie Ihr Avatar-Bild aus und laden Sie es hoch",
      },
    },
    fields: {
      file: {
        label: "Avatar-Bild",
        description: "Wählen Sie eine Bilddatei für Ihr Profilbild",
        placeholder: "Bilddatei wählen...",
        help: "Laden Sie eine Bilddatei (JPG, PNG, GIF) bis zu 5MB hoch",
        validation: {
          maxSize: "Dateigröße muss unter 5MB sein",
          imageOnly: "Nur Bilddateien sind erlaubt",
        },
      },
    },
    response: {
      title: "Upload-Antwort",
      label: "Upload-Ergebnis",
      description: "Avatar-Upload-Antwort",
      success: "Upload Erfolgreich",
      message: "Ihr Avatar wurde erfolgreich hochgeladen",
      avatarUrl: "Avatar-URL",
      uploadTime: "Upload-Zeit",
      nextSteps: {
        item: "Nächster Schritt",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die hochgeladene Datei ist ungültig oder beschädigt",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um einen Avatar hochzuladen",
      },
      server: {
        title: "Serverfehler",
        description: "Avatar-Upload konnte nicht verarbeitet werden",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist beim Upload aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist beim Upload aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, einen Avatar hochzuladen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Upload aufgetreten",
      },
    },
    success: {
      title: "Avatar Hochgeladen",
      description: "Ihr Profilbild wurde erfolgreich hochgeladen",
    },
  },
  delete: {
    title: "Avatar Löschen",
    description: "Das aktuelle Profilbild entfernen",
    response: {
      title: "Lösch-Antwort",
      label: "Lösch-Ergebnis",
      description: "Avatar-Löschungsantwort",
      success: "Löschen Erfolgreich",
      message: "Ihr Avatar wurde erfolgreich gelöscht",
      nextSteps: {
        item: "Nächster Schritt",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Avatar-Löschungsanfrage ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ihren Avatar zu löschen",
      },
      server: {
        title: "Serverfehler",
        description: "Avatar konnte nicht gelöscht werden",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist beim Löschen aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist beim Löschen aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Avatar zu löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der zu löschende Avatar wurde nicht gefunden",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Löschen aufgetreten",
      },
    },
    success: {
      title: "Avatar Gelöscht",
      description: "Ihr Profilbild wurde erfolgreich entfernt",
    },
  },
};

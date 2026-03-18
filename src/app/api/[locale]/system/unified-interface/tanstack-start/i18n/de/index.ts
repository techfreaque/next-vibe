import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  generate: {
    post: {
      title: "TanStack-Routen Generieren",
      description:
        "TanStack Router Kompatibilitäts-Wrapper für Next.js-Seiten generieren",
      response: {
        fields: {
          success: "Erfolg",
          created: "Erstellte Dateien",
          skipped: "Übersprungene Dateien",
          errors: "Fehler",
          message: "Nachricht",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie sind nicht berechtigt, diese Aktion durchzuführen",
        },
        server: {
          title: "Serverfehler",
          description: "Beim Generieren der Routen ist ein Fehler aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description:
            "Sie haben keine Berechtigung, diese Aktion durchzuführen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Quellverzeichnis nicht gefunden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description:
          "{{created}} Dateien generiert, {{skipped}} Dateien übersprungen, {{errors}} Fehler",
      },
    },
  },
};

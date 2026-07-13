import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  generate: {
    post: {
      title: "Next-App generieren",
      titleShort: "Next gen.",
      description:
        "Generiert Next.js-App-Struktur-Re-Export-Shells (page.tsx / route.ts) in src/generated/app aus der maßgeblichen Quelle. Beachtet 'use custom'.",
      tag: "generieren",
      response: {
        success: "Generierung erfolgreich",
        fields: {
          success: "Erfolg",
          created: "Erstellt",
          skipped: "Übersprungen",
          errors: "Fehler",
          message: "Nachricht",
        },
      },
      errors: {
        validation: {
          title: "Ungültige Parameter",
          description: "Die Generierungsparameter sind ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie haben keine Berechtigung, diesen Generator auszuführen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Bei der Generierung der Shells ist ein Fehler aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Der Zugriff auf diesen Generator ist verboten",
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
          description: "Bei der Generierung ist ein Konflikt aufgetreten",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Es gibt nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Next-App-Shells erfolgreich generiert",
      },
    },
  },
};

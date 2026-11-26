import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um auf benutzerdefinierte Skills zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen das Skille ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt mit dem aktuellen Zustand ist aufgetreten",
      },
    },
  },
  title: "KI-Aktivität",
  description:
    "Prüfen Sie den Modellkatalog und die neuen Unterhaltungen der letzten sieben Tage.",
  models: "Modelle im Katalog",
  providers: "Modellanbieter",
  skills: "Veröffentlichte Community-Skills",
  conversations: "Neue Unterhaltungen",
  reported: "Gemeldete Skills",
  attention: "Zu prüfen",
  clear: "Keine gemeldeten Skills.",
  unavailable: "Moderationsstatus nicht verfügbar.",
  recent: "Letzte Aktivität",
  loading: "KI-Aktivität wird geladen…",
  failed: "KI-Aktivität konnte nicht geladen werden.",
};

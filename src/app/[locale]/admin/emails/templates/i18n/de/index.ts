import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  overview: {
    description: "E-Mail-Vorlagen anzeigen und in der Vorschau anzeigen",
    template: "Vorlage",
    templates: "Vorlagen",
    version: "Version",
    id: "ID",
    view_preview: "Vorschau anzeigen",
    total: "Gesamtvorlagen",
  },
  preview: {
    back_to_templates: "Zurück zu den Vorlagen",
    previous: "Vorherige Vorlage",
    next: "Nächste Vorlage",
    id: "Vorlagen-ID",
    version: "Version",
    category: "Kategorie",
    path: "Vorlagenpfad",
    send_test: "Test-E-Mail senden",
    loading: "Vorschau wird geladen...",
    error_loading: "E-Mail-Vorschau konnte nicht geladen werden",
  },
  test: {
    title: "Test-E-Mail",
    description: "Senden Sie eine Test-E-Mail, um die Vorlage zu überprüfen",
    recipient: "Empfänger-E-Mail",
    template: "Vorlage",
    success: "Test-E-Mail erfolgreich versendet",
    send: "Test-E-Mail senden",
    sending: "Wird gesendet...",
  },
};

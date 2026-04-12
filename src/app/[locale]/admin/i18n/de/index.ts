import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Admin-Dashboard",
    subtitle: "Verwalten Sie Ihre Anwendung von hier aus",
  },
  vibeFrame: {
    selectEndpoint: "Endpunkt auswählen...",
    searchEndpoints: "Endpunkte suchen...",
    value: "{{value}}",
  },
  common: {
    active: "Aktiv",
    filter: "Filter",
    refresh: "Aktualisieren",
    loading: "Wird geladen...",
    weekday: {
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
    },
    actions: {
      back: "Zurück",
      save: "Speichern",
      saving: "Wird gespeichert...",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      create: "Erstellen",
      update: "Aktualisieren",
      view: "Ansehen",
      search: "Suchen",
      filter: "Filtern",
      reset: "Zurücksetzen",
      submit: "Absenden",
      close: "Schließen",
      previous: "Zurück",
      next: "Weiter",
    },
  },
};

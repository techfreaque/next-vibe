import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as cronTranslations } from "../../cron/i18n/de";
import { translations as emailsTranslations } from "../../emails/i18n/de";
import { translations as leadsTranslations } from "../../leads/i18n/de";
import { translations as usersTranslations } from "../../users/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  cron: cronTranslations,
  emails: emailsTranslations,
  leads: leadsTranslations,
  users: usersTranslations,
  dashboard: {
    title: "Admin-Dashboard",
    subtitle: "Verwalten Sie Ihre Anwendung von hier aus",
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

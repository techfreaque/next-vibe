import type { translations as EnglishListTranslations } from "../../en/users/list";

export const translations: typeof EnglishListTranslations = {
  title: "Alle Benutzer",
  description: "Alle Benutzerkonten im System durchsuchen und verwalten",
  empty: {
    title: "Keine Benutzer gefunden",
    description:
      "Keine Benutzer entsprechen Ihren aktuellen Filtern. Versuchen Sie, Ihre Suchkriterien anzupassen.",
    message: "Keine Benutzer entsprechen Ihren aktuellen Filtern.",
  },
  filters: {
    title: "Filter",
    placeholder:
      "Verwenden Sie die obigen Filter, um Benutzer zu suchen und zu filtern.",
    clear: "Filter löschen",
    search: {
      placeholder: "Benutzer nach Name, E-Mail oder Unternehmen suchen...",
    },
    status: {
      label: "Status",
      all: "Alle Status",
      active: "Aktiv",
      inactive: "Inaktiv",
      emailVerified: "E-Mail verifiziert",
      emailUnverified: "E-Mail nicht verifiziert",
    },
    role: {
      label: "Rolle",
      all: "Alle Rollen",
      public: "Öffentlich",
      customer: "Kunde",
      partnerAdmin: "Partner Admin",
      partnerEmployee: "Partner Mitarbeiter",
      admin: "Administrator",
    },
    country: {
      label: "Land",
      all: "Alle Länder",
    },
    language: {
      label: "Sprache",
      all: "Alle Sprachen",
    },
    sortBy: {
      label: "Sortieren nach",
      createdAt: "Erstellungsdatum",
      updatedAt: "Aktualisierungsdatum",
      email: "E-Mail",
      firstName: "Vorname",
      lastName: "Nachname",
      company: "Unternehmen",
    },
    sortOrder: {
      label: "Reihenfolge",
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
  },
  results: {
    showing: "Zeige {{start}} bis {{end}} von {{total}} Benutzern",
  },
  pagination: {
    showing: "Zeige {{start}} bis {{end}} von {{total}} Benutzern",
    page: "Seite {{current}} von {{total}}",
    per_page: "Pro Seite",
    of: "von",
  },
};

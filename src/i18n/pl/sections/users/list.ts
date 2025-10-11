import type { listTranslations as EnglishListTranslations } from "../../../en/sections/users/list";

export const listTranslations: typeof EnglishListTranslations = {
  title: "Wszyscy użytkownicy",
  description:
    "Przeglądaj i zarządzaj wszystkimi kontami użytkowników w systemie",
  empty: {
    title: "Nie znaleziono użytkowników",
    description:
      "Żaden użytkownik nie pasuje do Twoich obecnych filtrów. Spróbuj dostosować kryteria wyszukiwania.",
    message: "Żaden użytkownik nie pasuje do Twoich obecnych filtrów.",
  },
  filters: {
    title: "Filtry",
    placeholder:
      "Użyj powyższych filtrów, aby wyszukać i filtrować użytkowników.",
    clear: "Wyczyść filtry",
    search: {
      placeholder: "Wyszukaj użytkowników po nazwie, e-mailu lub firmie...",
    },
    status: {
      label: "Status",
      all: "Wszystkie statusy",
      active: "Aktywny",
      inactive: "Nieaktywny",
      emailVerified: "E-mail zweryfikowany",
      emailUnverified: "E-mail niezweryfikowany",
    },
    role: {
      label: "Rola",
      all: "Wszystkie role",
      public: "Publiczny",
      customer: "Klient",
      partnerAdmin: "Administrator partnera",
      partnerEmployee: "Pracownik partnera",
      admin: "Administrator",
    },
    country: {
      label: "Kraj",
      all: "Wszystkie kraje",
    },
    language: {
      label: "Język",
      all: "Wszystkie języki",
    },
    sortBy: {
      label: "Sortuj według",
      createdAt: "Data utworzenia",
      updatedAt: "Data aktualizacji",
      email: "E-mail",
      firstName: "Imię",
      lastName: "Nazwisko",
      company: "Firma",
    },
    sortOrder: {
      label: "Kolejność",
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
  results: {
    showing: "Pokazuje {{start}} do {{end}} z {{total}} użytkowników",
  },
  pagination: {
    showing: "Pokazuje {{start}} do {{end}} z {{total}} użytkowników",
    page: "Strona {{current}} z {{total}}",
    per_page: "Na stronę",
    of: "z",
  },
};

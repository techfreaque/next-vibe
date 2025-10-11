import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../../en/sections/businessInfo/audience/form/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  targetAudience: {
    label: "Grupa Docelowa",
    placeholder: "Opisz swoich idealnych klientów...",
    description: "Szczegółowy opis Twojej grupy docelowej",
  },
  ageRange: {
    label: "Przedział Wiekowy",
    placeholder: "np. 25-45",
    description: "Przedział wiekowy Twojej grupy docelowej",
  },
  gender: {
    label: "Płeć",
    placeholder: "Wybierz docelową płeć",
    description: "Rozkład płci w Twojej grupie docelowej",
    options: {
      "all": "Wszystkie Płcie",
      "male": "Mężczyzna",
      "female": "Kobieta",
      "non-binary": "Niebinarna",
      "other": "Inna",
    },
  },
  location: {
    label: "Lokalizacja",
    placeholder: "np. Polska, Europa",
    description: "Lokalizacja geograficzna Twojej grupy docelowej",
  },
  income: {
    label: "Poziom Dochodów",
    placeholder: "np. 50k-100k PLN",
    description: "Przedział dochodów Twojej grupy docelowej",
  },
  interests: {
    label: "Zainteresowania",
    placeholder: "Czym się interesują?",
    description: "Główne zainteresowania i hobby Twojej grupy docelowej",
  },
  values: {
    label: "Wartości",
    placeholder: "Co cenią?",
    description: "Podstawowe wartości ważne dla Twojej grupy docelowej",
  },
  painPoints: {
    label: "Punkty Bólu",
    placeholder: "Z jakimi problemami się borykają?",
    description: "Główne wyzwania, z którymi boryka się Twoja grupa docelowa",
  },
  motivations: {
    label: "Motywacje",
    placeholder: "Co ich motywuje?",
    description: "Co napędza i motywuje Twoją grupę docelową",
  },
  lifestyle: {
    label: "Styl Życia",
    placeholder: "Opisz ich styl życia...",
    description: "Charakterystyka stylu życia Twojej grupy docelowej",
  },
  onlineBehavior: {
    label: "Zachowania Online",
    placeholder: "Jak zachowują się online?",
    description: "Nawyki cyfrowe i wzorce zachowań online",
  },
  purchaseBehavior: {
    label: "Zachowania Zakupowe",
    placeholder: "Jak podejmują decyzje zakupowe?",
    description: "Wzorce zakupowe i proces podejmowania decyzji",
  },
  preferredChannels: {
    label: "Preferowane Kanały",
    placeholder: "Gdzie spędzają czas online?",
    description: "Preferowane kanały komunikacji i mediów",
  },
  additionalNotes: {
    label: "Dodatkowe Uwagi",
    placeholder: "Dodatkowe informacje o Twojej grupie docelowej...",
    description: "Dodatkowe spostrzeżenia o Twojej grupie docelowej",
  },
};

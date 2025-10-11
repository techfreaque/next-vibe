import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../../en/sections/businessInfo/business/form/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  businessType: {
    label: "Typ Działalności",
    placeholder: "np. SaaS, E-commerce, Konsulting",
    description: "Jaki typ działalności prowadzisz?",
  },
  businessName: {
    label: "Nazwa Firmy",
    placeholder: "Nazwa Twojej firmy",
    description: "Oficjalna nazwa Twojej firmy",
    notSet: "Nie ustawiono - zaktualizuj w profilu",
    editInProfile: "Edytuj nazwę firmy w sekcji profilu",
  },
  industry: {
    label: "Branża",
    placeholder: "np. Technologia, Opieka zdrowotna, Finanse",
    description: "W jakiej branży działa Twoja firma?",
  },
  businessSize: {
    label: "Wielkość Firmy",
    placeholder: "Wybierz wielkość firmy",
    description: "Ilu pracowników ma Twoja firma?",
    options: {
      startup: "Startup (1-10 pracowników)",
      small: "Mała (11-50 pracowników)",
      medium: "Średnia (51-200 pracowników)",
      large: "Duża (201-1000 pracowników)",
      enterprise: "Enterprise (1000+ pracowników)",
    },
  },
  businessEmail: {
    label: "E-mail Firmowy",
    placeholder: "kontakt@twojafirma.pl",
    description: "Główny adres e-mail kontaktowy firmy",
  },
  businessPhone: {
    label: "Telefon Firmowy",
    placeholder: "+48 123 456 789",
    description: "Główny numer telefonu kontaktowego",
  },
  website: {
    label: "Strona Internetowa",
    placeholder: "https://twojafirma.pl",
    description: "Adres URL strony internetowej Twojej firmy",
  },
  country: {
    label: "Kraj",
    placeholder: "Polska",
    description: "Kraj, w którym znajduje się Twoja firma",
  },
  city: {
    label: "Miasto",
    placeholder: "Warszawa",
    description: "Miasto, w którym znajduje się Twoja firma",
  },
  foundedYear: {
    label: "Rok Założenia",
    placeholder: "2020",
    description: "Rok założenia Twojej firmy",
  },
  description: {
    label: "Opis Działalności",
    placeholder: "Opisz czym zajmuje się Twoja firma...",
    description: "Krótki opis Twojej firmy i usług",
  },
};

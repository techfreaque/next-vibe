import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessInfo/profile/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Informacje osobiste",
  description: "Zaktualizuj swoje dane osobiste i informacje kontaktowe.",
  personalInfo: {
    title: "Informacje osobiste",
    description: "Twoje podstawowe dane osobiste",
  },
  additionalInfo: {
    title: "Dodatkowe informacje",
    description: "Opcjonalne szczegóły o sobie",
  },
  success: {
    title: "Profil zaktualizowany",
    description: "Informacje Twojego profilu zostały pomyślnie zapisane.",
  },
  error: {
    title: "Błąd",
    description: "Nie udało się zaktualizować profilu",
  },
  fields: {
    firstName: {
      label: "Imię",
      placeholder: "Wprowadź swoje imię",
    },
    lastName: {
      label: "Nazwisko",
      placeholder: "Wprowadź swoje nazwisko",
    },
    bio: {
      label: "Bio",
      placeholder: "Opowiedz nam o sobie...",
      description: "Krótki opis o sobie i swoim doświadczeniu.",
    },
    phone: {
      label: "Numer telefonu",
      placeholder: "+48 123 456 789",
    },
    website: {
      label: "Strona internetowa",
      placeholder: "https://twojastrona.pl",
    },
    jobTitle: {
      label: "Stanowisko",
      placeholder: "np. Menedżer marketingu",
    },
    company: {
      label: "Firma",
      placeholder: "np. Acme Sp. z o.o.",
    },
  },
  submit: {
    save: "Zapisz profil",
    saving: "Zapisywanie...",
  },
};

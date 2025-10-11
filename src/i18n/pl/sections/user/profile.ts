import type { profileTranslations as EnglishProfileTranslations } from "../../../en/sections/user/profile";

export const profileTranslations: typeof EnglishProfileTranslations = {
  title: "Informacje Profilu",
  description: "Zaktualizuj swoje osobiste informacje profilu.",
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
    },
    website: {
      label: "Strona internetowa",
      placeholder: "https://example.com",
    },
    phone: {
      label: "Telefon",
      placeholder: "+48 123 456 789",
    },
  },
  success: {
    title: "Profil Zaktualizowany",
    description: "Twój profil został pomyślnie zaktualizowany.",
  },
  error: {
    title: "Aktualizacja Profilu Nie Powiodła Się",
    description: "Nie udało się zaktualizować profilu. Spróbuj ponownie.",
  },
};

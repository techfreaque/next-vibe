import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/contactErrors/contact/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja formularza kontaktowego nie powiodła się",
      description: "Sprawdź swoje dane kontaktowe i spróbuj ponownie",
    },
    unauthorized: {
      title: "Formularz kontaktowy nieautoryzowany",
      description: "Nie masz uprawnień do przesłania formularza kontaktowego",
    },
    server: {
      title: "Błąd serwera formularza kontaktowego",
      description:
        "Nie można przesłać formularza kontaktowego z powodu błędu serwera",
    },
    unknown: {
      title: "Formularz kontaktowy nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas przesyłania formularza kontaktowego",
    },
  },
  success: {
    title: "Wiadomość wysłana pomyślnie",
    description: "Twoja wiadomość kontaktowa została wysłana",
  },
};

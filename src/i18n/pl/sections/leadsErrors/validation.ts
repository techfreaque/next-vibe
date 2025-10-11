import type { validationTranslations as EnglishValidationTranslations } from "../../../en/sections/leadsErrors/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
  email: {
    invalid: "Nieprawidłowy adres e-mail",
  },
  businessName: {
    required: "Nazwa firmy jest wymagana",
  },
  website: {
    invalid: "Nieprawidłowy adres URL strony internetowej",
  },
  language: {
    tooShort: "Kod języka musi mieć co najmniej 2 znaki",
    tooLong: "Kod języka może mieć maksymalnie 5 znaków",
  },
  country: {
    invalid: "Nieprawidłowy kod kraju",
  },
};

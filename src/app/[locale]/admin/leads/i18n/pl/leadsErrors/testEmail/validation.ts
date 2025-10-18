import type { translations as EnglishValidationTranslations } from "../../../en/leadsErrors/testEmail/validation";

export const translations: typeof EnglishValidationTranslations = {
  journeyVariant: {
    invalid: "Nieprawidłowy wariant podróży e-mailowej",
  },
  stage: {
    invalid: "Nieprawidłowy etap kampanii e-mailowej",
  },
  testEmail: {
    invalid: "Nieprawidłowy adres e-mail testowego",
  },
  leadData: {
    email: {
      invalid: "Nieprawidłowy adres e-mail leada",
    },
    businessName: {
      required: "Nazwa firmy leada jest wymagana",
      tooLong: "Nazwa firmy leada jest za długa",
    },
    contactName: {
      tooLong: "Imię i nazwisko kontaktu leada jest za długie",
    },
    phone: {
      invalid: "Nieprawidłowy numer telefonu leada",
    },
    website: {
      invalid: "Nieprawidłowy adres URL strony leada",
    },
    country: {
      invalid: "Nieprawidłowy kraj leada",
    },
    language: {
      invalid: "Nieprawidłowy język leada",
    },
    status: {
      invalid: "Nieprawidłowy status leada",
    },
    source: {
      invalid: "Nieprawidłowe źródło leada",
    },
    notes: {
      tooLong: "Notatki leada są za długie",
    },
  },
};

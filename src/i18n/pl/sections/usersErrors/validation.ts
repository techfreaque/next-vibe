import type { validationTranslations as EnglishValidationTranslations } from "../../../en/sections/usersErrors/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
  id: {
    invalid: "Nieprawidłowy identyfikator użytkownika",
  },
  email: {
    invalid: "Nieprawidłowy adres e-mail",
  },
  password: {
    tooShort: "Hasło musi mieć co najmniej 8 znaków",
    tooLong: "Hasło może mieć maksymalnie 128 znaków",
  },
  firstName: {
    required: "Imię jest wymagane",
    tooLong: "Imię może mieć maksymalnie 100 znaków",
  },
  lastName: {
    required: "Nazwisko jest wymagane",
    tooLong: "Nazwisko może mieć maksymalnie 100 znaków",
  },
  company: {
    required: "Nazwa firmy jest wymagana",
    tooLong: "Nazwa firmy może mieć maksymalnie 255 znaków",
  },
  phone: {
    invalid: "Nieprawidłowy format numeru telefonu",
  },
  preferredContactMethod: {
    invalid: "Nieprawidłowa preferowana metoda kontaktu",
  },
  imageUrl: {
    invalid: "Nieprawidłowy adres URL obrazu",
  },
  bio: {
    tooLong: "Biografia może mieć maksymalnie 1000 znaków",
  },
  website: {
    invalid: "Nieprawidłowy adres URL strony internetowej",
  },
  jobTitle: {
    tooLong: "Stanowisko może mieć maksymalnie 255 znaków",
  },
};

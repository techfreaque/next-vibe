import type { createTranslations as EnglishCreateTranslations } from "../../../en/sections/users/create";

export const createTranslations: typeof EnglishCreateTranslations = {
  title: "Utwórz użytkownika",
  description: "Utwórz nowe konto użytkownika",
  fields: {
    email: "Adres e-mail użytkownika",
    password: "Hasło użytkownika (minimum 8 znaków)",
    firstName: "Imię użytkownika",
    lastName: "Nazwisko użytkownika",
    company: "Nazwa firmy użytkownika",
    phone: "Numer telefonu użytkownika",
    preferredContactMethod: "Preferowana metoda kontaktu",
    imageUrl: "URL zdjęcia profilowego użytkownika",
    bio: "Biografia użytkownika",
    website: "URL strony internetowej użytkownika",
    jobTitle: "Stanowisko użytkownika",
    emailVerified: "Czy e-mail jest zweryfikowany",
    isActive: "Czy konto użytkownika jest aktywne",
    leadId: "Powiązane ID leada",
    roles: "Role użytkownika do przypisania",
  },
};

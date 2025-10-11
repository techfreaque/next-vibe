import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/pages/help/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Skontaktuj Się z Nami",
  name: "Twoje Imię",
  email: "Adres E-mail",
  phone: "Numer Telefonu",
  company: "Firma",
  subject: "Temat",
  namePlaceholder: "Wprowadź swoje imię",
  emailPlaceholder: "Wprowadź swój adres e-mail",
  companyPlaceholder: "Wprowadź nazwę swojej firmy",
  subjectPlaceholder: "Czego to dotyczy?",
  messagePlaceholder: "Jak możemy Ci pomóc?",
  preferredContactMethod: "Preferowana Metoda Kontaktu",
  preferredContactOptions: {
    email: "E-mail",
    phone: "Telefon",
  },
  meetingPreferenceType: "Preferencje Spotkania",
  meetingPreferenceOptions: {
    virtual: "Spotkanie Wirtualne",
    inPerson: "Spotkanie Osobiste",
  },
  message: "Twoja Wiadomość",
  submit: "Wyślij Wiadomość",
  sending: "Wysyłanie...",
  success: {
    title: "Sukces!",
    description:
      "Twoja wiadomość została wysłana pomyślnie! Odpowiemy tak szybko, jak to możliwe.",
  },
  error: {
    title: "Nie udało się wysłać wiadomości",
    description:
      "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.",
  },
};

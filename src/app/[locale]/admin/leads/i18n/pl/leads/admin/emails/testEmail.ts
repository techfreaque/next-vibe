import type { translations as EnglishTestEmailTranslations } from "../../../../en/leads/admin/emails/testEmail";

export const translations: typeof EnglishTestEmailTranslations = {
  button: "Wyślij E-mail Testowy",
  title: "Wyślij E-mail Testowy",
  send: "Wyślij E-mail Testowy",
  sending: "Wysyłanie...",
  success: "E-mail testowy wysłany pomyślnie na {{email}}",
  prefix: "[TEST]",
  recipient: {
    title: "Odbiorca Testowy",
    name: "Odbiorca Testowy",
    email: {
      label: "Adres E-mail Testowy",
      placeholder: "Wprowadź adres e-mail do otrzymania testu",
      description: "Adres e-mail, na który zostanie wysłany e-mail testowy",
    },
  },
  leadData: {
    title: "Dane Leada dla Szablonu",
    businessName: {
      label: "Nazwa Firmy",
      placeholder: "Przykładowa Firma Sp. z o.o.",
    },
    contactName: {
      label: "Imię i Nazwisko Kontaktu",
      placeholder: "Jan Kowalski",
    },
    phone: {
      label: "Numer Telefonu",
      placeholder: "+48123456789",
    },
    website: {
      label: "Strona Internetowa",
      placeholder: "https://example.com",
    },
    country: {
      label: "Kraj",
    },
    language: {
      label: "Język",
    },
    status: {
      label: "Status Leada",
    },
    source: {
      label: "Źródło Leada",
    },
    notes: {
      label: "Notatki",
      placeholder: "Testowy lead do podglądu e-maila",
    },
  },
  mockData: {
    businessName: "Acme Digital Solutions Sp. z o.o.",
    contactName: "Anna Nowak",
    phone: "+48-22-123-4567",
    website: "https://acme-digital.pl",
    notes:
      "Zainteresowana premium usługami zarządzania mediami społecznościowymi. Klient o wysokim potencjale z ugruntowanym biznesem.",
  },
};

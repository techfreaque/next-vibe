import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../en/sections/leadsErrors/testEmail/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  journeyVariant: {
    description: "Wybierz wariant podróży e-mailowej do testowania",
  },
  stage: {
    description: "Wybierz etap kampanii e-mailowej do testowania",
  },
  testEmail: {
    description:
      "Wprowadź adres e-mail, na który zostanie wysłany e-mail testowy",
  },
  leadData: {
    email: {
      description: "Adres e-mail, który pojawi się w szablonie e-maila",
    },
    businessName: {
      description: "Nazwa firmy, która pojawi się w szablonie e-maila",
    },
    contactName: {
      description:
        "Imię i nazwisko kontaktu, które pojawi się w szablonie e-maila",
    },
    phone: {
      description: "Numer telefonu, który pojawi się w szablonie e-maila",
    },
    website: {
      description: "Adres URL strony, który pojawi się w szablonie e-maila",
    },
    country: {
      description:
        "Kraj, który zostanie użyty do lokalizacji w szablonie e-maila",
    },
    language: {
      description:
        "Język, który zostanie użyty do lokalizacji w szablonie e-maila",
    },
    status: {
      description: "Status leada, który zostanie użyty w szablonie e-maila",
    },
    source: {
      description: "Źródło leada, które zostanie użyte w szablonie e-maila",
    },
    notes: {
      description: "Notatki, które zostaną użyte w szablonie e-maila",
    },
  },
};

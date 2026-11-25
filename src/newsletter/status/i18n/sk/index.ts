import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stav odberu newslettera",
  titleShort: "Stav odberu newslettera",
  description: "Overiť stav odberu newslettera pre e-mailovú adresu",
  category: "Newsletter",
  tags: {
    status: "Stav",
  },
  form: {
    title: "Overiť stav odberu newslettera",
    description: "Zadajte e-mailovú adresu, ktorej stav odberu chcete overiť",
  },
  email: {
    label: "E-mailová adresa",
    description: "E-mailová adresa na overenie stavu odberu",
    placeholder: "user@example.com",
    helpText: "Na overenie vlastného odberu nechaj pole prázdne",
  },
  response: {
    subscribed: "Stav odberu",
    status: "Aktuálny stav",
    confirmed: "Potvrdené",
    email: "E-mailová adresa",
  },
  errors: {
    validation: {
      title: "Neplatný e-mail",
      description: "Zadajte platnú e-mailovú adresu",
    },
    internal: {
      title: "Interná chyba",
      description: "Pri overovaní stavu odberu nastala chyba",
      detail: "Overenie stavu odberu zlyhalo: {{error}}",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Nemáte oprávnenie overiť stav tohto odberu",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Pre túto e-mailovú adresu sa nenašli údaje o odbere",
    },
  },
  success: {
    title: "Stav načítaný",
    description: "Stav odberu newslettera bol načítaný",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Status newslettera",
  description: "Sprawdź status subskrypcji newslettera dla adresu e-mail",
  category: "Newsletter",
  tags: {
    status: "Status",
  },
  form: {
    title: "Sprawdź status newslettera",
    description: "Wprowadź adres e-mail, aby sprawdzić status subskrypcji newslettera",
  },
  email: {
    label: "Adres e-mail",
    description: "Adres e-mail, dla którego chcesz sprawdzić status subskrypcji",
    placeholder: "użytkownik@przykład.pl",
    helpText: "Wprowadź adres e-mail, który chcesz sprawdzić",
  },
  response: {
    subscribed: "Status subskrypcji",
    status: "Aktualny status",
  },
  errors: {
    validation: {
      title: "Nieprawidłowy e-mail",
      description: "Proszę podać prawidłowy adres e-mail",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd podczas sprawdzania statusu subskrypcji",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do sprawdzenia tego statusu subskrypcji",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Brak informacji o subskrypcji dla tego adresu e-mail",
    },
  },
  success: {
    title: "Status pobrany",
    description: "Pomyślnie pobrano status subskrypcji newslettera",
  },
};

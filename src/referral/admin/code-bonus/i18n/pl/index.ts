import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Polecenia",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "Bonus kodu polecającego",
    titleShort: "Bonus kodu",
    description:
      "Ustaw jednorazowe kredyty bonusowe, które kod polecający daje nowym osobom. Wypłacane przy pierwszym płatnym planie, nigdy przy darmowej rejestracji. 0 usuwa bonus.",
    fields: {
      code: {
        label: "Kod polecający",
        description: "Kod do zmiany (wielkość liter bez znaczenia)",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "Kredyty bonusowe",
        description:
          "Przyznawane raz z pierwszym płatnym planem. 0 = brak bonusu.",
        placeholder: "100",
      },
    },
    response: {
      code: "Kod",
      ownerEmail: "Właściciel kodu",
      previousBonusCredits: "Poprzedni bonus",
      subscriptionBonusCredits: "Kredyty bonusowe",
    },
    widget: {
      back: "Wstecz",
      hint: 'Widoczne przy rejestracji jako "+N kredytów bonusowych z pierwszą subskrypcją". Raz na użytkownika.',
      submit: "Zapisz bonus",
      set: "{{code}} ({{owner}}): +{{credits}} kredytów z pierwszym planem (było {{previous}}).",
      cleared: "{{code}} ({{owner}}): bez bonusu (było {{previous}}).",
    },
  },
  errors: {
    validation: {
      title: "Błędne dane",
      description: "Sprawdź kod i liczbę kredytów",
    },
    unauthorized: {
      title: "Niezalogowany",
      description: "Zaloguj się jako admin, żeby ustawiać bonusy",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Tylko admini ustawiają bonusy kodów",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Kod nie istnieje",
    },
    conflict: {
      title: "Konflikt",
      description: "Kod zmienił się w międzyczasie, spróbuj ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zapisać bonusu",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś poszło nie tak",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
    codeNotFound: "Kod polecający {{code}} nie istnieje",
  },
  success: {
    title: "Zapisano",
    description: "Bonus kodu zaktualizowany",
  },
};

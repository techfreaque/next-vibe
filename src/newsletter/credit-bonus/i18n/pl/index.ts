import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    credits: "Kredyty",
  },
  enum: {
    offer: {
      available: "Dostępny",
      pendingConfirmation: "Czeka na potwierdzenie e-mailem",
      active: "Bonus aktywny",
      notEligible: "Niedostępny",
    },
  },
  response: {
    offer: "Bonus za newsletter",
    email: "E-mail konta",
    bonusCredits: "Kredyty bonusowe co miesiąc",
    freeRefillAt: "Darmowe kredyty odnowią się",
  },
  get: {
    title: "Bonus kredytów za newsletter",
    titleShort: "Bonus za newsletter",
    description:
      "Sprawdza, czy Twoje konto może jeszcze dostać comiesięczny bonus kredytów za newsletter. Tylko dla kont.",
  },
  post: {
    title: "Odbierz bonus za newsletter",
    titleShort: "Odbierz bonus",
    description:
      "Zapisuje e-mail Twojego konta do newslettera i daje dodatkowe darmowe kredyty co miesiąc. Tylko dla kont, raz na konto.",
  },
  errors: {
    validation: {
      title: "Nieprawidłowe żądanie",
      description: "Nie udało się przetworzyć żądania",
    },
    unauthorized: {
      title: "Potrzebne konto",
      description:
        "Bonus za newsletter jest tylko dla kont. Załóż darmowe konto albo się zaloguj.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Nie możesz odebrać tego bonusu",
    },
    notFound: {
      title: "Nie znaleziono konta",
      description: "Nie udało się znaleźć Twojego konta",
    },
    internal: {
      title: "Coś poszło nie tak",
      description: "Nie udało się sprawdzić bonusu. Spróbuj jeszcze raz.",
    },
  },
  success: {
    title: "Gotowe",
    description: "Status bonusu za newsletter wczytany",
  },
  widget: {
    available: "+{{bonusCredits}} darmowych kredytów co miesiąc",
    availableHint:
      "Zapisz {{email}} do newslettera. Najpierw wyślemy link potwierdzający.",
    claim: "Odbierz +{{bonusCredits}} kredytów/mies.",
    pending:
      "Sprawdź skrzynkę ({{email}}). Kliknij link potwierdzający, żeby odblokować +{{bonusCredits}} kredytów/mies.",
    active: "Bonus za newsletter aktywny: +{{bonusCredits}} kredytów/mies.",
    notEligible: "To konto nie może dostać bonusu za newsletter.",
    refill: "Darmowe kredyty odnowią się {{date}}.",
  },
};

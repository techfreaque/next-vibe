import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  token: {
    label: "Kod potwierdzenia",
    description: "Kod z linku w Twoim mailu powitalnym",
    placeholder: "Wklej kod z maila",
  },
  response: {
    confirmed: "Potwierdzono",
    email: "E-mail",
    bonusCredits: "Bonusowe kredyty miesięcznie",
  },
  post: {
    title: "Potwierdź e-mail newslettera",
    titleShort: "Potwierdź e-mail",
    description:
      "Potwierdź adres newslettera kodem z maila powitalnego. Odblokowuje miesięczny bonus darmowych kredytów.",
    errors: {
      validation: {
        title: "Nieprawidłowy kod",
        description: "Brakuje kodu potwierdzenia albo jest uszkodzony",
      },
      notFound: {
        title: "Link wygasł lub jest nieprawidłowy",
        description:
          "Ten link potwierdzający nie działa. Zapisz się ponownie, a wyślemy nowy.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak dostępu",
      },
      internal: {
        title: "Potwierdzenie nie powiodło się",
        description:
          "Coś poszło nie tak po naszej stronie. Otwórz link jeszcze raz.",
      },
    },
    success: {
      title: "E-mail potwierdzony",
      description: "Bonus trafia na Twoje darmowe konto",
    },
  },
  widget: {
    heroTitle: "Jedno kliknięcie. +{{bonusCredits}} kredytów co miesiąc.",
    heroDescription:
      "Potwierdź adres. Na darmowym koncie bonus od razu trafi do Twojej puli.",
    confirmButton: "Potwierdź mój e-mail",
    confirming: "Potwierdzam...",
    confirmedTitle:
      "Gotowe. +{{bonusCredits}} kredytów miesięcznie na Twoim darmowym koncie.",
    confirmedDescription:
      "Jesteś zalogowany? Bonus jest już w Twojej darmowej puli i odnawia się co miesiąc, dopóki jesteś zapisany. Nie masz konta? Załóż je za darmo w tej przeglądarce, żeby go odblokować.",
    startChatting: "Zacznij czatować",
  },
};

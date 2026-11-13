import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Polecenia",
  tags: {
    referral: "polecenia",
    links: "linki",
  },
  get: {
    title: "Moje linki śledzące",
    titleShort: "Linki śledzące",
    description:
      "Twoje linki polecające, jeden na każde miejsce publikacji, z wizytami, rejestracjami i zarobkiem dla każdego.",
    response: {
      links: "Linki",
    },
    widget: {
      title: "Linki śledzące",
      subtitle:
        "Jeden link na jedno miejsce. Zobaczysz, który film, post albo newsletter naprawdę zarabia.",
      create: "Nowy link",
      refresh: "Odśwież",
      loading: "Ładuję twoje linki...",
      copy: "Kopiuj",
      copied: "Skopiowano",
      visits: "Wizyty",
      signups: "Rejestracje",
      paid: "Płacący",
      earned: "Zarobione",
      pending: "{{amount}} w oczekiwaniu",
      code: "Kod {{code}}",
      landsOn: "Prowadzi na {{path}}",
      empty: {
        title: "Nie masz jeszcze linków śledzących",
        hint: "Zrób jeden na każdy film, post albo wydanie newslettera. Każda wizyta, rejestracja i płatność trafia na jego konto.",
        cta: "Utwórz pierwszy link",
      },
      cli: {
        header: "Linki śledzące: {{count}}",
        funnel:
          "{{visits}} wizyt, {{signups}} rejestracji, {{paid}} płacących, {{earned}} zarobione ({{pending}} w oczekiwaniu)",
      },
    },
  },
  post: {
    title: "Utwórz link śledzący",
    titleShort: "Nowy link",
    description:
      "Utwórz link polecający dla jednego miejsca publikacji. Zawiera twój kod polecający i tagi UTM, więc wizyty, rejestracje i płatności liczą się osobno dla każdego linku.",
    submit: "Utwórz link",
    fields: {
      name: {
        label: "Nazwa",
        description: "Widzisz ją tylko ty. Nazwij miejsce publikacji.",
        placeholder: "Recenzja na YouTube, listopad",
      },
      source: {
        label: "Gdzie go udostępnisz",
        description: "Platforma lub strona, np. youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "Kampania",
        description:
          "Grupuje linki, np. jeden film albo jedno wydanie. Opcjonalnie.",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "Medium",
        description: "Rodzaj publikacji. Domyślnie referral.",
        placeholder: "video",
      },
      destinationPath: {
        label: "Strona docelowa",
        description: "Ścieżka w serwisie, na którą trafią odwiedzający",
        placeholder: "/",
      },
      code: {
        label: "Kod polecający",
        description:
          "Jeden z twoich kodów. Puste pole użyje pierwszego aktywnego.",
        placeholder: "MOJKOD",
      },
    },
    response: {
      id: "ID linku",
      url: "Link",
      code: "Kod polecający",
    },
    widget: {
      back: "Wróć",
      hint: "Jeden link na jedno miejsce. Wtedy widzisz dokładnie, który przyprowadza płacących.",
      presets: "Gdzie go udostępnisz?",
      created: "Twój link jest gotowy",
      copy: "Kopiuj",
      copied: "Skopiowano",
    },
  },
  errors: {
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź zaznaczone pola",
    },
    unauthorized: {
      title: "Nie jesteś zalogowany",
      description: "Zaloguj się, by zarządzać linkami",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Nie możesz zarządzać tymi linkami",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Ten link nie istnieje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Coś się w międzyczasie zmieniło, odśwież i spróbuj ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się wykonać żądania",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś nieoczekiwanie poszło nie tak",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz albo odrzuć zmiany",
    },
    noCode:
      "Najpierw utwórz swój kod polecający. Linki śledzące są na nim oparte.",
    notYourCode: "Kod {{code}} nie jest jednym z twoich aktywnych kodów",
    invalidDestination:
      "Ścieżka docelowa musi zaczynać się od / i prowadzić do tego serwisu",
  },
  success: {
    title: "Gotowe",
    description: "Link gotowy",
  },
};

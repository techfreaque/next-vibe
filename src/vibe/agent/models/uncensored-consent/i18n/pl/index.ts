import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    consent: "Zgoda",
  },

  get: {
    title: "Zgoda na modele bez cenzury",
    titleShort: "Zgoda: bez cenzury",
    description:
      "Pokazuje, czy to konto lub gość potwierdził pełnoletność i akceptuje niefiltrowane odpowiedzi modeli bez cenzury. Bez potwierdzenia te modele nie ruszą.",
    response: {
      consented: "Potwierdzone",
      consentedAt: "Potwierdzone dnia",
      version: "Wersja zgody",
    },
    success: {
      title: "Status wczytany",
      description: "Aktualny status zgody na modele bez cenzury",
    },
  },

  post: {
    title: "Odblokuj modele bez cenzury",
    titleShort: "Odblokuj bez cenzury",
    description:
      "Jednorazowe potwierdzenie dla modeli bez cenzury: masz ukończone 18 lat i akceptujesz, że mogą generować obraźliwe, fałszywe, niebezpieczne, nielegalne lub złośliwe treści, bez filtra. Potwierdza to człowiek, nigdy AI w jego imieniu.",
    fields: {
      confirm: {
        label: "Mam 18+ i się zgadzam",
        description:
          "Ustaw na true, aby potwierdzić: masz ukończone 18 lat, akceptujesz niefiltrowane odpowiedzi i bierzesz odpowiedzialność za ich wykorzystanie.",
      },
    },
    success: {
      title: "Modele bez cenzury odblokowane",
      description: "Potwierdzenie zapisane. Nie zapytamy ponownie.",
    },
  },

  delete: {
    title: "Wycofaj zgodę",
    titleShort: "Wycofaj zgodę",
    description:
      "Wycofuje potwierdzenie dla modeli bez cenzury. Pozostaną zablokowane, dopóki nie potwierdzisz ponownie.",
    success: {
      title: "Zgoda wycofana",
      description: "Modele bez cenzury są znowu zablokowane.",
    },
  },

  errors: {
    validation: {
      title: "Brak potwierdzenia",
      description: "Potwierdź pełnoletność i warunki, aby kontynuować.",
    },
    unauthorized: {
      title: "Brak uprawnień",
      description: "Nie możesz zmienić tej zgody.",
    },
    forbidden: {
      title: "Zabronione",
      description: "Ta akcja nie jest tu dostępna.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono konta ani sesji gościa.",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zapisać. Spróbuj ponownie.",
    },
    network: {
      title: "Błąd sieci",
      description: "Serwer nieosiągalny. Sprawdź połączenie.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś poszło nie tak. Spróbuj ponownie.",
    },
    conflict: {
      title: "Konflikt",
      description: "Zgoda zmieniła się w innej karcie. Odśwież stronę.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw potwierdź albo anuluj.",
    },
    noIdentity: "Brak konta i sesji gościa. Odśwież stronę i spróbuj ponownie.",
    saveFailed: "Nie udało się zapisać. Spróbuj ponownie.",
  },

  gate: {
    required:
      "{{model}} działa bez cenzury. Potrzebne jednorazowe potwierdzenie: masz 18+ i akceptujesz, że modele bez cenzury mogą generować obraźliwe, fałszywe, niebezpieczne, nielegalne lub złośliwe treści, bez filtra. Człowiek potwierdza to w czacie albo uruchamia: vibe uncensored-consent-agree --confirm=true",
    apiRequired:
      "{{model}} działa bez cenzury. To konto nie potwierdziło pełnoletności ani zgody na niefiltrowane odpowiedzi. Zaznacz raz pole modeli bez cenzury na stronie kluczy API i spróbuj ponownie.",
  },

  dialog: {
    eyebrow: "Modele bez cenzury",
    title: "Tylko dla dorosłych. Bez filtra.",
    stance:
      "To ludzie decydują, co czytają. Nie korporacja. Dlatego pytamy raz, zamiast filtrować każdą odpowiedź.",
    modelLine: "Wybrany model: {{model}}.",
    pointAge: "Mam ukończone 18 lat.",
    pointContent:
      "Modele bez cenzury mogą generować obraźliwe, fałszywe, niebezpieczne, nielegalne lub złośliwe treści.",
    pointNoFilter: "Nic tego nie filtruje. Ani model, ani my.",
    pointResponsible:
      "Biorę odpowiedzialność za to, jak wykorzystam to, co napisze.",
    agree: "Mam 18+ i się zgadzam",
    agreeing: "Zapisywanie…",
    pickAnother: "Wybierz inny model",
    close: "Zamknij",
    footnote:
      "Pytamy tylko raz. Zgodę cofniesz w każdej chwili w ustawieniach.",
    saveFailed: "Nie udało się zapisać. Spróbuj ponownie.",
  },

  widget: {
    title: "Modele bez cenzury",
    statusOn: "Odblokowane",
    statusOff: "Zablokowane",
    since: "Potwierdzone {{date}}",
    onBody:
      "Potwierdzono pełnoletność i zgodę na niefiltrowane odpowiedzi. Modele bez cenzury odpowiadają bez filtrów.",
    offBody:
      "Modele bez cenzury pozostaną zablokowane, dopóki nie potwierdzisz pełnoletności i zgody na niefiltrowane odpowiedzi.",
    outdatedBody:
      "Treść zgody się zmieniła. Potwierdź ponownie, aby dalej korzystać z modeli bez cenzury.",
    withdraw: "Wycofaj zgodę",
    withdrawing: "Wycofywanie…",
    unlock: "Odblokuj modele bez cenzury",
    guestNote:
      "Zapisane w tej przeglądarce. Po rejestracji przejdzie na Twoje konto.",
    loading: "Wczytywanie zgody…",
    back: "Wstecz",
    menuLabel: "Modele bez cenzury",
    menuOn: "Wł.",
    menuOff: "Wył.",
  },
};

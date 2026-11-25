import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Zgłoszenie IndexNow",
    titleShort: "IndexNow",
    description:
      "Zgłasza Bing, Yandex, Seznam, Naver i Yep każdy nowy lub zmieniony adres z mapy strony. Tylko na produkcji, pomija adresy już wysłane.",
    tag: "SEO",
    container: {
      title: "Przebieg IndexNow",
      description: "Co trafiło do wyszukiwarek",
    },
    fields: {
      force: {
        label: "Wyślij wszystko ponownie",
        description:
          "Wyślij każdy adres z mapy strony, nie tylko nowe lub zmienione.",
      },
      dryRun: {
        label: "Próba",
        description: "Policz oczekujące adresy bez wysyłania.",
      },
    },
    response: {
      status: "Status",
      host: "Host",
      totalUrls: "Adresy w mapie strony",
      pendingUrls: "Oczekujące adresy",
      submittedUrls: "Wysłane adresy",
      requests: "Wysłane żądania",
    },
    errors: {
      unauthorized: {
        title: "Brak logowania",
        description: "Zaloguj się jako admin, aby wysłać adresy.",
      },
      forbidden: {
        title: "Tylko dla adminów",
        description: "Tylko admini mogą wysyłać adresy do IndexNow.",
      },
      server: {
        title: "Wysyłka nieudana",
        description:
          "IndexNow odrzucił zgłoszenie albo nie udało się zbudować mapy strony. Sprawdź log serwera.",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś poszło nie tak podczas wysyłania adresów.",
      },
      validation: { title: "Błędne dane", description: "Sprawdź opcje." },
      keyUnreachable: {
        title: "Plik klucza niedostępny",
        description:
          "Plik klucza IndexNow w katalogu głównym strony nie zwrócił 200 z kluczem, więc nic nie wysłano. Sprawdź log serwera.",
      },
      network: {
        title: "IndexNow nie odpowiada",
        description:
          "API IndexNow nie odpowiedziało. Następny przebieg wyśle oczekujące adresy ponownie.",
      },
    },
    success: { title: "Gotowe", description: "Przebieg IndexNow zakończony." },
  },
  enums: {
    status: {
      submitted: "Wysłano",
      unchanged: "Nic nowego",
      dryRun: "Próba",
      notProduction: "Pominięto (nie produkcja)",
    },
  },
  task: {
    description:
      "Co godzinę: wysyła nowe lub zmienione adresy z mapy strony do IndexNow (Bing, Yandex i partnerzy).",
  },
};

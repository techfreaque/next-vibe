import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie serwerem",
  tags: {
    imagePush: "Wysyłka obrazu",
  },
  post: {
    title: "Zbuduj i wyślij obraz",
    titleShort: "Wyślij obraz",
    description:
      "Buduje produkcyjny obraz Docker i dostarcza go do rejestru lub bezpośrednio na serwer przez SSH, dzięki czemu serwer wdrożeniowy tylko go pobiera (lub już go ma) zamiast budować",
    form: {
      title: "Konfiguracja wysyłki obrazu",
      description: "Skonfiguruj nazwę obrazu, tag i docelową platformę",
      submit: "Zbuduj i wyślij",
      runAgain: "Uruchom ponownie",
    },
    fields: {
      image: {
        title: "Obraz",
        description:
          "Rejestr + nazwa obrazu do zbudowania i wysłania. Domyślnie DOCKER_IMAGE_NAME z pliku .env.",
      },
      tag: {
        title: "Tag",
        description:
          "Tag obrazu. Domyślnie krótki SHA bieżącego commita Git. 'latest' jest zawsze dodatkowo tagowany i wysyłany.",
      },
      push: {
        title: "Wyślij",
        description:
          "Wyślij do rejestru po zbudowaniu. Wyłącz, aby zbudować tylko lokalnie - wysyłka wymaga wcześniejszego 'docker login'.",
      },
      platform: {
        title: "Platforma",
        description:
          "Docelowa platforma budowania (docker buildx --platform). Musi odpowiadać architekturze serwera wdrożeniowego - zwykle linux/amd64.",
      },
      sshTarget: {
        title: "Cel SSH",
        description:
          "user@host do przesłania zbudowanego obrazu bezpośrednio przez SSH zamiast do rejestru (np. root@203.0.113.5) - domyślnie SSH_SERVER, jeśli ustawiony. Używa SSH_SERVER_PWD do uwierzytelniania hasłem, w przeciwnym razie Twojego własnego klucza/konfiguracji SSH. Zostaw puste, aby zamiast tego wysłać do rejestru.",
      },
      success: {
        title: "Sukces",
      },
      output: {
        title: "Wynik",
      },
      resolvedImage: {
        title: "Obraz",
      },
      tags: {
        title: "Wysłane tagi",
      },
      duration: {
        title: "Czas trwania (ms)",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podano nieprawidłowe parametry wysyłki obrazu",
      },
      network: {
        title: "Błąd sieci",
        description:
          "Połączenie sieciowe nie powiodło się podczas wysyłki obrazu",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby zbudować i wysłać obraz",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do budowania i wysyłania obrazu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobów wysyłki obrazu",
      },
      server: {
        title: "Błąd serwera",
        description: "Budowanie lub wysyłka obrazu Docker nie powiodła się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Podczas wysyłki obrazu wystąpił nieznany błąd",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt wysyłki obrazu",
      },
      unsavedChanges: {
        title: "Nieznany błąd",
        description: "Podczas wysyłki obrazu wystąpił nieznany błąd",
      },
    },
    success: {
      title: "Obraz wysłany",
      description: "Obraz Docker zbudowany i wysłany pomyślnie",
    },
    repository: {
      messages: {
        buildStart: "🐳 Budowanie {{image}}:{{tag}} ...",
        buildSuccess: "✅ Zbudowano {{refs}} (nie wysłano)",
        pushSuccess: "🚀 Wysłano {{refs}}",
        buildExitCode: "docker buildx zakończył się kodem {{code}}",
        buildKilled: "docker buildx został zabity sygnałem {{signal}}",
        dockerBuildFailed:
          "Budowanie obrazu Docker nie powiodło się: {{error}}",
        gitShaFailed: "Nie udało się ustalić bieżącego SHA commita Git",
        gitShaFailedDetail:
          "Nie udało się ustalić bieżącego SHA commita Git: {{error}}",
        sshTransferStart: "📡 Przesyłanie {{refs}} do {{target}} przez ssh ...",
        sshTransferSuccess: "🚀 Przesłano {{refs}} do {{target}} przez ssh",
        sshTransferFailed:
          "Przesyłanie ssh do {{target}} nie powiodło się: {{error}}",
      },
    },
  },
};

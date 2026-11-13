import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Konserwacja",
  },
  post: {
    title: "Sprzątanie zawieszonych odpowiedzi",
    titleShort: "Zawieszone odpowiedzi",
    description:
      "Odblokowuje czaty, które utknęły w stanie 'streaming', bo proces piszący odpowiedź padł. Częściowa odpowiedź zostaje zapisana i oznaczona jako przerwana, a wiadomości w kolejce ruszają. Trwające odpowiedzi na żadnym węźle nie są ruszane.",
    container: {
      title: "Sprzątanie zawieszonych odpowiedzi",
      description: "Podejrzyj lub odblokuj zawieszone czaty",
    },
    fields: {
      localThresholdMinutes: {
        label: "Próg lokalny (min)",
        description:
          "Odblokuj lokalny przebieg, gdy jego proces tak długo nie daje znaku życia",
      },
      remoteThresholdMinutes: {
        label: "Próg zdalny (min)",
        description:
          "Odblokuj przebieg z innej instancji, gdy tak długo nic nie przyszło",
      },
      batchSize: {
        label: "Maks. czatów",
        description: "Górny limit odblokowanych czatów na przebieg",
      },
      dryRun: {
        label: "Próba",
        description: "Pokaż zawieszone czaty, niczego nie zmieniaj",
      },
    },
    response: {
      candidates: "Znalezione zawieszone czaty",
      reaped: "Odblokowane czaty",
      lost: "Pominięte: znów aktywne",
      failed: "Nieudane",
      queuedStarted: "Uruchomione wiadomości z kolejki",
      threadIds: "ID czatów",
      executionTimeMs: "Czas wykonania (ms)",
    },
    success: {
      title: "Gotowe",
      description: "Zawieszone czaty odblokowane",
    },
  },
  interrupted: {
    content:
      "Serwer zrestartował się w trakcie tej odpowiedzi. Częściowa odpowiedź jest zapisana. Ponów, żeby kontynuować.",
  },
  errors: {
    failed: "Sprzątanie zawieszonych odpowiedzi nie powiodło się: {{error}}",
    server: {
      title: "Błąd sprzątania",
      description: "Sprzątanie zawieszonych odpowiedzi nie powiodło się",
    },
  },
  task: {
    name: "Sprzątanie zawieszonych odpowiedzi",
    description:
      "Co 5 minut: odblokowuje czaty, które proces zostawił w stanie 'streaming', padając w trakcie odpowiedzi",
  },
};

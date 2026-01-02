import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Operacje Docker",
  description: "Wykonywanie poleceń Docker i zarządzanie kontenerami",
  category: "Docker",
  tags: {
    docker: "Docker",
    utils: "Narzędzia",
    dockeroperations: "Operacje Docker",
  },
  container: {
    title: "Operacje Docker",
    description: "Wykonywanie poleceń Docker z właściwą obsługą błędów",
  },
  fields: {
    command: {
      label: "Polecenie Docker",
      description: "Polecenie Docker do wykonania",
      placeholder: "docker ps",
    },
    options: {
      label: "Opcje wykonania",
      description: "Opcje konfiguracji dla wykonania polecenia",
      placeholder: "Skonfiguruj opcje timeout i logowania",
    },
  },
  response: {
    success: {
      label: "Polecenie pomyślne",
    },
    output: {
      label: "Wynik polecenia",
    },
    error: {
      label: "Szczegóły błędu",
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry polecenia Docker",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane uwierzytelnienie dla operacji Docker",
    },
    forbidden: {
      title: "Zabronione",
      description: "Niewystarczające uprawnienia dla operacji Docker",
    },
    internal: {
      title: "Błąd Docker",
      description: "Wykonanie polecenia Docker nie powiodło się",
    },
    timeout: {
      title: "Timeout polecenia",
      description: "Polecenie Docker przekroczyło limit czasu",
    },
    executionFailed: {
      title: "Wykonanie nie powiodło się",
      description: "Wykonanie polecenia Docker nie powiodło się",
    },
    composeDownFailed: {
      title: "Compose Down nie powiodło się",
      description: "Operacja Docker Compose down nie powiodła się",
    },
    composeUpFailed: {
      title: "Compose Up nie powiodło się",
      description: "Operacja Docker Compose up nie powiodła się",
    },
  },
  success: {
    title: "Polecenie Docker pomyślne",
    description: "Polecenie Docker wykonane pomyślnie",
  },
  messages: {
    executingCommand: "Wykonywanie polecenia Docker: {command}",
    timeoutError: "Polecenie Docker przekroczyło limit czasu po {timeout}ms: {command}",
    commandFailed: "Polecenie Docker nie powiodło się z kodem {code}: {command}",
    executionFailed: "Nie udało się wykonać polecenia Docker: {command}",
    commandError: "Błąd polecenia Docker: {error}",
  },
};

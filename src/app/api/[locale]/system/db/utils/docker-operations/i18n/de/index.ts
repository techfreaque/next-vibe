import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Docker-Operationen",
  description: "Docker-Befehle ausführen und Container verwalten",
  category: "Docker",
  tags: {
    docker: "Docker",
    utils: "Utilities",
    dockeroperations: "Docker-Operationen",
  },
  container: {
    title: "Docker-Operationen",
    description: "Docker-Befehle mit ordnungsgemäßer Fehlerbehandlung ausführen",
  },
  fields: {
    command: {
      label: "Docker-Befehl",
      description: "Der auszuführende Docker-Befehl",
      placeholder: "docker ps",
    },
    options: {
      label: "Ausführungsoptionen",
      description: "Konfigurationsoptionen für die Befehlsausführung",
      placeholder: "Timeout- und Protokollierungsoptionen konfigurieren",
    },
  },
  response: {
    success: {
      label: "Befehl erfolgreich",
    },
    output: {
      label: "Befehlsausgabe",
    },
    error: {
      label: "Fehlerdetails",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Docker-Befehlsparameter",
    },
    unauthorized: {
      title: "Unberechtigt",
      description: "Authentifizierung für Docker-Operationen erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Unzureichende Berechtigungen für Docker-Operationen",
    },
    internal: {
      title: "Docker-Fehler",
      description: "Docker-Befehlsausführung fehlgeschlagen",
    },
    timeout: {
      title: "Befehl-Timeout",
      description: "Docker-Befehl hat Timeout-Limit überschritten",
    },
    executionFailed: {
      title: "Ausführung fehlgeschlagen",
      description: "Docker-Befehlsausführung fehlgeschlagen",
    },
    composeDownFailed: {
      title: "Compose Down fehlgeschlagen",
      description: "Docker Compose Down-Operation fehlgeschlagen",
    },
    composeUpFailed: {
      title: "Compose Up fehlgeschlagen",
      description: "Docker Compose Up-Operation fehlgeschlagen",
    },
  },
  success: {
    title: "Docker-Befehl erfolgreich",
    description: "Docker-Befehl erfolgreich ausgeführt",
  },
  messages: {
    executingCommand: "Docker-Befehl wird ausgeführt: {command}",
    timeoutError: "Docker-Befehl Timeout nach {timeout}ms: {command}",
    commandFailed: "Docker-Befehl fehlgeschlagen mit Code {code}: {command}",
    executionFailed: "Fehler beim Ausführen des Docker-Befehls: {command}",
    commandError: "Docker-Befehl Fehler: {error}",
  },
};

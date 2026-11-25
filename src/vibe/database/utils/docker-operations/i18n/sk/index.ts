import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Operácie Dockeru",
  titleShort: "Docker DB",
  description: "Spúšťa príkazy Dockeru a spravuje kontajnery.",
  category: "Docker",
  tags: {
    docker: "Docker",
    utils: "Nástroje",
    dockeroperations: "Operácie Dockeru",
  },
  container: {
    title: "Operácie Dockeru",
    description: "Spúšťa príkazy Dockeru a spracúva ich chyby.",
  },
  fields: {
    command: {
      label: "Príkaz Dockeru",
      description: "Príkaz Dockeru, ktorý chceš vykonať",
      placeholder: "docker ps",
    },
    options: {
      label: "Možnosti vykonania",
      description: "Konfiguračné možnosti pre spustenie príkazu",
      placeholder: "Nastav časový limit a zaznamenávanie výstupu.",
    },
  },
  response: {
    success: {
      label: "Úspech príkazu",
    },
    output: {
      label: "Výstup príkazu",
    },
    error: {
      label: "Podrobnosti o chybe",
    },
  },
  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre príkazu Docker",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Ak chceš vykonávať operácie Dockeru, prihlás sa.",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Nemáš oprávnenie vykonávať operácie Dockeru.",
    },
    internal: {
      title: "Chyba Dockeru",
      description: "Príkaz Dockeru sa nepodarilo vykonať.",
    },
    timeout: {
      title: "Vypršal časový limit príkazu",
      description: "Príkaz Dockeru prekročil časový limit.",
    },
    executionFailed: {
      title: "Vykonanie zlyhalo: {{error}}",
      description: "Príkaz Dockeru sa nepodarilo vykonať.",
    },
    composeDownFailed: {
      title: "Príkaz docker compose down zlyhal: {{error}}",
      description: "Príkaz Docker Compose down zlyhal.",
    },
    composeUpFailed: {
      title: "Príkaz docker compose up zlyhal: {{error}}",
      description: "Príkaz Docker Compose up zlyhal.",
    },
  },
  success: {
    title: "Príkaz Dockeru bol úspešný",
    description: "Príkaz Dockeru sa úspešne vykonal.",
  },
  messages: {
    executingCommand: "Spúšťam príkaz Docker: {command}",
    timeoutError:
      "Príkaz Dockeru prekročil časový limit {timeout} ms: {command}",
    commandFailed: "Príkaz Docker zlyhal s kódom {code}: {command}",
    executionFailed: "Nepodarilo sa spustiť príkaz Docker: {command}",
    commandError: "Chyba príkazu Docker: {error}",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operácie s databázou",

  dockerOperations: {
    title: "Operácie Dockeru",
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
        title: "Vykonanie zlyhalo",
        description: "Príkaz Dockeru sa nepodarilo vykonať.",
      },
      composeDownFailed: {
        title: "Príkaz docker compose down zlyhal",
        description: "Príkaz Docker Compose down zlyhal.",
      },
      composeUpFailed: {
        title: "Príkaz docker compose up zlyhal",
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
  },
  title: "Nástroje databázy",
  titleShort: "Nástroje databázy",
  description: "Pomocné nástroje na prácu s databázou",
  tag: "nástroje",
  includeDetails: {
    title: "Zahrnúť podrobnosti",
    description: "Zahrnúť podrobné informácie do odpovede",
  },
  checkConnections: {
    title: "Skontrolovať pripojenia",
    description: "Kontrola stavu pripojenia k databáze",
  },
  status: {
    title: "Prevádzkový stav",
  },
  timestamp: {
    title: "Časová pečiatka",
  },
  connections: {
    title: "Stav pripojenia",
    primary: "Primárne pripojenie",
    replica: "Pripojenie k replike",
  },
  details: {
    title: "Databázové údaje",
    version: "Verzia",
    uptime: "Čas prevádzky (sekundy)",
    activeConnections: "Aktívne spojenia",
    maxConnections: "Najviac pripojení",
  },
  errors: {
    health_check_failed: "Kontrola stavu databázy zlyhala: {{error}}",
    connection_failed: "Databázové pripojenie zlyhalo: {{error}}",
    stats_failed: "Štatistiky databázy sa nepodarilo načítať: {{error}}",
    docker_check_failed: "Kontrola dostupnosti Dockeru zlyhala: {{error}}",
    reset_failed: "Reset databázy zlyhal.",
    manage_failed: "Operácia správy databázy zlyhala.",
    reset_operation_failed: "Reset zlyhal.",
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre databázového nástroja",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Ak chceš používať databázové nástroje, prihlás sa.",
    },
    internal: {
      title: "Interná chyba",
      description: "Operácia databázového nástroja zlyhala",
    },
  },
  success: {
    title: "Databázová operácia sa dokončila",
    description: "Databázové nástroje dokončili operácie.",
  },
  docker: {
    executing_command: "Spúšťam príkaz Docker: {{command}}",
    command_timeout:
      "Príkaz Dockeru prekročil časový limit {{timeout}} ms: {{command}}",
    command_failed: "Príkaz Docker zlyhal s kódom {{code}}: {{command}}",
    execution_failed: "Nepodarilo sa spustiť príkaz Docker: {{command}}",
    command_error: "Chyba príkazu Docker: {{error}}",
    stopping_containers: "Zastavujem kontajnery...",
    starting_containers: "Spúšťam kontajnery...",
  },
};

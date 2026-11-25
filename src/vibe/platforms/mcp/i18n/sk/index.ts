import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    category: "Nástroje MCP",
    tags: {
      mcp: "MCP",
    },
    get: {
      title: "Zoznam nástrojov MCP",
      description:
        "Zobraziť všetky nástroje MCP dostupné prihlásenému používateľovi",
      fields: {
        name: "Názov nástroja",
        description: "Opis",
        inputSchema: "Vstupná schéma",
      },
      response: {
        title: "Zoznam nástrojov MCP",
        description: "Zoznam dostupných nástrojov MCP",
      },
      errors: {
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatné parametre požiadavky",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte povolenie na prístup k tomuto zdroju.",
        },
        notFound: {
          title: "Nenájdené",
          description: "Zdroj sa nenašiel.",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Zistený konflikt zdrojov",
        },
      },
      success: {
        title: "Úspech",
        description: "Nástroje úspešne získané",
      },
    },
  },
  execute: {
    category: "Vykonanie cez MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Spustiť nástroj MCP",
      titleShort: "Server MCP",
      description: "Spustiť nástroj MCP podľa názvu so zadanými argumentmi",
      fields: {
        title: "Parametre spustenia nástroja",
        description: "Parametre na spustenie nástroja",
        name: {
          title: "Názov nástroja",
          description:
            "Názov nástroja, ktorý sa má spustiť, napríklad core:system:db:ping",
          placeholder: "core:system:db:ping",
        },
        arguments: {
          title: "Argumenty",
          description: "Argumenty nástroja vo formáte kľúč a hodnota",
          placeholder: "{}",
        },
      },
      response: {
        title: "Výsledok spustenia nástroja",
        description: "Výsledok vykonania nástroja",
        result: {
          content: {
            type: "Typ obsahu",
            text: "Obsah",
          },
          isError: "Obsahuje chybu",
        },
      },
      errors: {
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatný názov alebo argumenty nástroja",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte povolenie na spustenie tohto nástroja",
        },
        notFound: {
          title: "Nástroj sa nenašiel",
          description: "Zadaný nástroj neexistuje",
        },
        server: {
          title: "Chyba servera",
          description: "Spustenie nástroja zlyhalo",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Zistený konflikt zdrojov",
        },
      },
      success: {
        title: "Úspech",
        description: "Úspešne spustený nástroj",
      },
    },
  },
  serve: {
    category: "Server MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Spustiť MCP server",
      titleShort: "Server MCP",
      description: "Spustiť server Model Context Protocol",
      response: {
        title: "Stav servera MCP",
        description: "Stav servera MCP",
      },
      errors: {
        validation: {
          title: "Overenie vstupu zlyhalo",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Zlyhalo spustenie servera MCP",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
      },
      success: {
        title: "Úspech",
        description: "MCP server úspešne spustený",
      },
    },
  },
  registry: {
    toolNotFound: "Nástroj sa nenašiel.",
    endpointNotFound: "Koncový bod sa nenašiel.",
    permissionDenied: "Prístup zamietnutý",
    toolExecutionFailed: "Spustenie nástroja zlyhalo",
  },
};

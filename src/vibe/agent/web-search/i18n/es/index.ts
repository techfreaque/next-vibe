import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  enums: {
    provider: {
      AUTO: "Auto (recomendado)",
      BRAVE: "Brave Search",
      KAGI: "Kagi FastGPT",
    },
  },
  get: {
    title: "Buscar en la Web",
    titleShort: "Web Search",
    dynamicTitle: "Buscar: {{query}}",
    description:
      "Busque Internet para información actual, noticias, hechos o eventos recientes. Automáticamente viaja a su proveedor de búsqueda preferido.",
    form: {
      title: "Web Search",
      description: "Buscar en la web con su proveedor preferido",
    },
    submitButton: {
      label: "Buscar",
      loadingText: "Buscando...",
    },
    backButton: {
      label: "Atrás",
    },
    fields: {
      query: {
        title: "Búsqueda",
        description:
          "Consulta de búsqueda clara y específica. Usa palabras clave en lugar de preguntas.",
        placeholder: "Introduzca su consulta de búsqueda...",
      },
      provider: {
        title: "Proveedor de búsqueda",
        description:
          "Que motor de búsqueda para usar. Auto elige su predeterminado o el más barato disponible.",
        options: {
          auto: "Auto (recomendado)",
          brave: "Brave Search",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "Resultados máximos",
        description: "Número de resultados a la vuelta (1-10). Brave sólo.",
      },
      includeNews: {
        title: "Incluir noticias",
        description:
          "Incluir los resultados de las noticias para eventos actuales. Brave sólo.",
      },
      freshness: {
        title: "Frescura",
        description: "Filtrar resultados por lo recientes que son. Brave sólo.",
        options: {
          day: "Día pasado",
          week: "Semana pasada",
          month: "Mes pasado",
          year: "Año pasado",
        },
      },
    },
    response: {
      provider: {
        title: "Proveedor",
        description: "Que proveedor de búsqueda se utilizó",
      },
      output: {
        title: "AI Respuesta",
        description: "AI -generated summary (Kagi only)",
      },
      results: {
        title: "Resultados",
        description: "Resultados de búsqueda web",
        result: "Resultado",
        item: {
          title: "Resultado de la búsqueda",
          description: "Resultado de búsqueda individual",
          url: "URL",
          snippet: "Snippet",
          age: "Edad",
          source: "Fuente",
        },
      },
    },
    widget: {
      aiDefaultLabel: "AI default:",
      switchTo: "Cambiar a",
      separatorDot: "·",
      via: "via {{provider}}",
      braveBanner: "Su AI busca con Kagi",
      kagiBanner: "Su AI busca con Brave",
      useBrave: "Use Brave",
      useKagi: "Use Kagi",
    },
    errors: {
      queryEmpty: {
        title: "Se requiere la consulta de búsqueda",
        description: "Proporcione una consulta de búsqueda",
      },
      queryTooLong: {
        title: "La búsqueda es demasiado larga (máx. caracteres {{maxLength}})",
        description: "La consulta debe ser de 400 caracteres o menos",
      },
      noProvider: {
        title: "No hay proveedor de búsqueda disponible",
        description:
          "No hay búsqueda Las teclas API están configuradas. Configurar Brave Search o Kagi en su archivo.env.",
      },
      noProviderAdmin: {
        title:
          "No se ha configurado ningún proveedor de búsqueda. Añadir BRAVE_SEARCH_API_KEY o KAGI_API_KEY a tu archivo.env.",
        description:
          "Brave Buscar: https://api.search.brave.com/app/keys. Kagi : https://kagi.com/settings?p=api",
      },
      noProviderUser: {
        title: "La búsqueda web no está disponible en este momento.",
        description:
          "El administrador aún no ha configurado un proveedor de búsqueda.",
      },
      providerUnavailable: {
        title: "Proveedor de búsqueda no disponible",
        description:
          "El proveedor de búsqueda seleccionado no está configurado. Elija un proveedor diferente o use auto.",
      },
      timeout: {
        title: "Solicitud de búsqueda cronometrada",
        description: "La búsqueda tardó demasiado en completar",
      },
      searchFailed: {
        title: "Búsqueda fallada",
        description: "Se produjo un error mientras se buscaba",
      },
      validation: {
        title: "Búsqueda inválida",
        description:
          "Por favor, compruebe sus parámetros de búsqueda e inténtelo de nuevo",
      },
      internal: {
        title: "Algo que estaba mal.",
        description:
          "No podríamos completar tu búsqueda. Por favor, inténtelo de nuevo.",
      },
    },
    success: {
      title: "Búsqueda exitosa",
      description: "La búsqueda web se completó con éxito",
    },
  },
  tags: {
    search: "Buscar",
    web: "Web",
    internet: "Internet",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Buscar en la Web",
    titleShort: "Brave Search",
    dynamicTitle: "Buscar: {{query}}",
    description:
      "Busque Internet para información actual, noticias, hechos o eventos recientes. Use esto cuando necesite información actualizada o para verificar hechos.",
    form: {
      title: "Parámetros de búsqueda",
      description: "Configura tu consulta de búsqueda web",
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
      maxResults: {
        title: "Resultados máximos",
        description: "Número de resultados a la vuelta (1-10)",
      },
      includeNews: {
        title: "Incluir noticias",
        description:
          "Incluir los resultados de las noticias para eventos actuales",
      },
      freshness: {
        title: "Frescura",
        description: "Resultado del filtro por lo recientes que son",
        options: {
          day: "Día pasado",
          week: "Semana pasada",
          month: "Mes pasado",
          year: "Año pasado",
        },
      },
    },
    response: {
      success: {
        title: "Operación completada",
        description: "Ya sea que la búsqueda haya tenido éxito",
      },
      message: {
        title: "Mensaje",
        description: "Mensaje de estado sobre la búsqueda",
      },
      query: {
        title: "Query",
        description: "La consulta de búsqueda que fue ejecutada",
      },
      results: {
        title: "Resultados",
        description: "Array of search results",
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
      cached: {
        title: "Caché",
        description: "Ya se hayan servido los resultados de cache",
      },
      timestamp: {
        title: "Timestamp",
        description: "Cuando se realizó la búsqueda",
      },
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
      notConfigured: {
        title:
          "La tecla {{label}} API no está configurada. Añadir {{envKey}} = <your-key> a tu archivo.env. Obtener su llave en {{url}}",
        description: "Configurar {{label}} para habilitar la búsqueda web",
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

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Buscar con Kagi",
    titleShort: "Kagi Search",
    dynamicTitle: "Kagi: {{query}}",
    description:
      "Busque en Internet o consiga AI - respuestas propulsadas utilizando Kagi. El modo FastGPT proporciona respuestas completas con fuentes, mientras que el modo de búsqueda devuelve resultados directos.",
    form: {
      title: "Parámetros de búsqueda",
      description: "Configura tu consulta de búsqueda Kagi",
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
        description: "Consulta o pregunta clara y específica de búsqueda.",
        placeholder: "Introduzca su consulta de búsqueda...",
      },
      mode: {
        title: "Modo de búsqueda",
        description:
          "Elija entre AI - respuestas propulsadas (FastGPT) o resultados de búsqueda directa",
        options: {
          fastgpt: "FastGPT (AI - respuestas propulsadas)",
          search: "Búsqueda (Resultados directos)",
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
      output: {
        title: "Respuesta",
        description: "AI - respuesta generada de FastGPT",
      },
      query: {
        title: "Query",
        description: "La consulta de búsqueda que fue ejecutada",
      },
      references: {
        title: "Referencias",
        description: "Referencias y citas de fuentes",
        reference: "Referencia",
        item: {
          title: "Referencia",
          description: "Referencia fuente con citación",
          url: "URL",
          snippet: "Snippet",
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
        description: "Configurar {{label}} para habilitar la búsqueda de Kagi",
      },
    },
    success: {
      title: "Búsqueda exitosa",
      description: "La búsqueda Kagi completó con éxito",
    },
  },
  tags: {
    search: "Buscar",
    web: "Web",
    ai: "IA",
  },
};

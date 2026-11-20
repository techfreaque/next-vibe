import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Tómese el contenido de URL",
    titleShort: "Ve a buscar URL",
    description:
      "Obtenga y extraiga contenido de cualquier URL, convirtiéndola en formato marcado legible. Use esto cuando necesite leer o analizar contenido de la página web.",
    form: {
      title: "Parámetros de parásitos URL",
      description: "Configure el URL para obtener contenido de",
    },
    fields: {
      url: {
        title: "URL",
        description:
          "The complete URL to fetch (must include http:// or https://)",
        placeholder: "https://example.com",
      },
      query: {
        title: "Búsqueda de búsqueda (opcional)",
        description:
          "Filtro Regex aplicado después de la captura. Sólo los párrafos que coinciden con el patrón son devueltos, clasificados por cuenta de partido, hasta el límite de caracteres. Omitir para obtener la página completa (trincado medio si grande). Sintaxis: cualquier regex JS - 'authentication', '(login impersignup)', 'clase\\s+\\w+'. Invalid regex vuelve a la coincidencia literal.",
        placeholder: "autenticación",
      },
    },
    response: {
      message: {
        title: "Mensaje",
        description: "Mensaje de estado sobre la operación de embrague",
      },
      content: {
        title: "Contenido",
        description: "El contenido extraído en formato marcado",
      },
      truncated: {
        title: "Truncado",
        description: "Si el contenido fue truncado debido al tamaño",
      },
      truncatedNote: {
        title: "Nota de Truncación",
        description:
          "Detalles sobre la truncación y cómo obtener más contenido",
      },
      url: {
        title: "Original",
        description: "El URL que fue atrapado",
      },
      statusCode: {
        title: "Código de Estado",
        description: "Código de estado HTTP de la respuesta",
      },
      timeElapsed: {
        title: "Tiempo transcurrido (ms)",
        description: "Tiempo para buscar el contenido en milisegundos",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El URL es inválido o desaparecido",
      },
      internal: {
        title: "Error de captura",
        description: "Se produjo un error al buscar el URL",
        // Dedicated key: `title` doubles as the generic errorTypes label, so the
        // detail placeholder lives here instead of leaking into those labels.
        detail: "Error de captura: {{message}}",
      },
      notConfigured: {
        title:
          "La tecla {{label}} API no está configurada. Añadir {{envKey}} = <your-key> a tu archivo.env. Obtener su llave en {{url}}",
        description: "Configurar {{label}} para buscar páginas web",
      },
      timeout: {
        title: "Trae tiempo de salida.",
        description: "El lote URL se acabó.",
        detail:
          "Traer a {{url}} se dio un tiempo. La página puede ser demasiado lenta o indisponible.",
      },
    },
    success: {
      title: "Trae éxito",
      description: "El contenido de URL fue conseguido con éxito",
      detail: "Vestido {{url}}",
    },
  },
  tags: {
    scraping: "Scraping",
    web: "Web",
    content: "Contenido",
  },
  cleanup: {
    post: {
      title: "URL Cache Cleanup",
      titleShort: "URL Cache Cleanup",
      description: "Eliminar archivos de caché URL más de 7 días",
      container: {
        title: "Resultados de limpieza",
        description: "Resumen de los archivos de caché eliminados",
      },
      response: {
        deletedCount: "Archivos suprimidos",
        totalScanned: "Total escaneado",
        retentionDays: "Días de retención",
      },
      success: {
        title: "Cache Cleaned",
        description: "Los archivos de caché Stale URL han sido eliminados",
      },
    },
    errors: {
      server: {
        title: "Error de limpieza",
        description: "Se produjo un error al limpiar el caché URL",
      },
    },
    name: "URL Cache Cleanup",
    description: "Limpieza semanal de los archivos de caché para embrague URL",
  },
};

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operaciones de base de datos",

  tag: "studio",
  post: {
    title: "Database Studio",
    titleShort: "DB Studio",
    description:
      "Estudio de base de datos abierto para la gestión de bases de datos visuales",
    form: {
      title: "Configuración de estudio",
      description: "Configurar parámetros de estudio de bases de datos",
    },
    response: {
      title: "Respuesta del estudio",
      description: "Resultados del lanzamiento de estudios de base",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Autenticación necesaria para el estudio de bases de datos",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de estudio inválidos",
      },
      server: {
        title: "Error del servidor",
        description:
          "Error de servidor interno durante el lanzamiento del estudio",
        detail: "Drizzle Studio no comenzó después de {{seconds}} s: {{error}}",
      },
      internal: {
        title: "Error interno",
        description: "El lanzamiento del estudio de base falló",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Un error desconocido ocurrió durante el lanzamiento del estudio",
      },
      network: {
        title: "Error de red",
        description: "Error de red durante el lanzamiento del estudio",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Autorizaciones insuficientes para el estudio de bases de datos",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos de estudio no encontrados",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto portuario de estudio detectado",
      },
    },
    success: {
      title: "Studio Lanzado",
      description: "Estudio de bases de datos lanzado con éxito",
    },
  },
  fields: {
    port: {
      title: "Port",
      description:
        "Número de puerto para estudio de bases de datos (1024-65535)",
    },
    openBrowser: {
      title: "Navegador abierto",
      description: "Estudio automático abierto en el navegador",
    },
    success: {
      title: "Situación de éxito",
    },
    url: {
      title: "Studio URL",
    },
    portUsed: {
      title: "Puerto real usado",
    },
    output: {
      title: "Producto de lanzamiento",
    },
    duration: {
      title: "Duración de lanzamiento",
    },
  },
};

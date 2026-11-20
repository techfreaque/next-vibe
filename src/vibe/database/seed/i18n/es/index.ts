import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operaciones de base de datos",

  tag: "seed",
  post: {
    title: "Semillas de base de datos",
    titleShort: "Seed DB",
    description: "Base de datos de semillas con datos",
    form: {
      title: "Configuración de semillas",
      description: "Configurar parámetros de visualización",
    },
    response: {
      title: "Respuesta de la semilla",
      description: "Resultados de la operación de búsqueda de bases de datos",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Autenticación necesaria para la visualización de bases de datos",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de semillas inválidos proporcionados",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno durante la visualización",
        detail: "Falló la visualización de la base de datos: {{error}}",
      },
      internal: {
        title: "Error interno",
        description: "Falló la operación de verificación de bases de datos",
      },
      database: {
        title: "Error de base de datos",
        description: "Error de la base de datos ocurrido durante la siembra",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido durante la siembra",
      },
      network: {
        title: "Error de red",
        description: "Error de red durante la siembra",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Autorizaciones insuficientes para la visualización de bases de datos",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos de semillas no encontrados",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos detectado durante la siembra",
      },
    },
    success: {
      title: "Base de datos",
      description: "Comprobación de bases de datos con éxito",
    },
  },
  fields: {
    environment: {
      title: "para el Medio Ambiente",
      description: "Medio ambiente de semillas (dev, test, prod)",
    },
    success: {
      title: "Situación de éxito",
    },
    seedsExecuted: {
      title: "Semillas ejecutadas",
    },
    collections: {
      title: "Colecciones de semillas",
      item: {
        title: "Colección",
      },
      name: {
        title: "Nombre de la colección",
      },
      status: {
        title: "Situación",
      },
      recordsCreated: {
        title: "Registros creados",
      },
    },
    totalRecords: {
      title: "Total Records",
    },
    duration: {
      title: "Duración ms)",
    },
  },
};

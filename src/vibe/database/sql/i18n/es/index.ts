import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operaciones de base de datos",

  tag: "sql",
  post: {
    title: "Ejecutar SQL",
    titleShort: "Corre SQL",
    description: "Ejecutar las consultas SQL en la base de datos",
    form: {
      title: "Configuración de consultas SQL",
      description: "Configurar los parámetros de la consulta SQL",
    },
    response: {
      title: "Respuesta a las preguntas",
      description: "Resultados de ejecución de consultas SQL",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para la ejecución de SQL",
      },
      validation: {
        title: "Error de validación",
        description: "Consulta o parámetros inválidos SQL",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno durante la ejecución de SQL",
      },
      internal: {
        title: "Error interno",
        description: "SQL falló la ejecución de la consulta",
      },
      database: {
        title: "Error de base de datos",
        description:
          "Error de base de datos ocurrido durante la ejecución de consultas",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la ejecución de SQL",
      },
      network: {
        title: "Error de red",
        description: "Error de red durante la ejecución de SQL",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Autorizaciones insuficientes para la ejecución de SQL",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos SQL no encontrados",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto SQL detectado",
      },
    },
    success: {
      title: "Query Executed",
      description: "SQL query ejecutado con éxito",
    },
  },
  fields: {
    query: {
      title: "SQL Query",
      description: "La consulta SQL para ejecutar",
    },
    queryFile: {
      title: "Carretera de archivo de consultas",
      description: "Camino a un archivo SQL para ejecutar",
      placeholder: "/path/to/query.sql",
    },
    dryRun: {
      title: "Simulación",
      description: "Previsualizar la consulta sin ejecutar",
    },
    verbose: {
      title: "Productos de Verbose",
      description: "Mostrar información detallada sobre las consultas",
    },
    limit: {
      title: "Límite de fila",
      description: "Número máximo de filas para regresar (1-1000)",
    },
    success: {
      title: "Situación de éxito",
    },
    output: {
      title: "Producto",
    },
    results: {
      title: "Resultados de las consultas",
    },
    rowCount: {
      title: "Conde",
    },
    queryType: {
      title: "Tipo de consulta",
    },
  },
};

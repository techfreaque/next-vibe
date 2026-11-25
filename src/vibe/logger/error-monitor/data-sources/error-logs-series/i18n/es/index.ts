import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "Ocurrencias",
      distinct: "Clases de error vistas",
      new: "Nuevas clases de error",
      openBacklog: "Backlog abierto (sin resolver ahora)",
    },
    level: {
      all: "Errores y avisos",
      error: "Solo errores",
      warn: "Solo avisos",
    },
  },
  post: {
    title: "Serie de registros de errores",
    titleShort: "Registros de errores",
    description:
      "Volumen de errores en el tiempo. Las ocurrencias y clases vistas vienen del contador diario (por día, historial desde el 22/11/2026). Las nuevas clases cuentan primeras apariciones. El backlog abierto es el número actual de clases sin resolver, guardado en cada ejecución del grafo.",
    fields: {
      resolution: {
        label: "Resolución",
        description:
          "Intervalo de cálculo (ocurrencias y clases como máximo diarias)",
      },
      range: {
        label: "Rango",
        description: "Rango de tiempo a consultar",
      },
      lookback: {
        label: "Retrospectiva",
        description: "Barras extra antes del inicio del rango",
      },
      metric: {
        label: "Métrica",
        description:
          "Qué contar: ocurrencias, clases vistas, nuevas clases o backlog abierto",
      },
      level: {
        label: "Nivel",
        description: "Errores, avisos o ambos",
      },
      result: {
        label: "Recuento de registros de errores",
        description: "Serie temporal de salida",
      },
      meta: {
        label: "Meta",
        description: "Metadatos de ejecución del nodo",
      },
    },
    success: {
      title: "Serie de registros de errores calculada",
      description: "Serie de registros de errores devuelta",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "La consulta falló.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Cuenta o sesión no encontradas",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Solicitud de red falló",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar los cambios primero",
      },
    },
  },
};

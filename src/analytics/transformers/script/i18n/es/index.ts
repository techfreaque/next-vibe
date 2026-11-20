import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Script",
    titleShort: "Script",
    description:
      "Script - aplica una función personalizada de sandboxed a una serie de tiempo",
    fields: {
      source: { label: "Fuente", description: "Serie de tiempo de entrada" },
      fn: {
        label: "Función",
        description:
          "Función del cuerpo puntos de recepción: TimeSeries, debe devolver {timestamp, value}[]",
      },
      resolution: { label: "Resolución", description: "Plazo de cálculo" },
      range: { label: "Rango", description: "Rango de tiempo para calcular" },
      lookback: {
        label: "Mira atrás.",
        description:
          "Barras extra antes de empezar el rango para calentamiento",
      },
      result: {
        label: "Resultado",
        description: "Serie de tiempo de producción",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Script ejecutado",
      description: "Serie de resultados de script devuelto",
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
        description: "La ejecución del script falló",
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

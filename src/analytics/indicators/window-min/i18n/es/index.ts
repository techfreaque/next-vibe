import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Window Min",
    titleShort: "Gana Min",
    description:
      "Precio mínimo de la ventana - rastrea el valor más bajo en una ventana fija",
    fields: {
      source: { label: "Fuente", description: "Serie de tiempo de entrada" },
      resolution: { label: "Resolución", description: "Plazo de cálculo" },
      range: { label: "Rango", description: "Rango de tiempo para calcular" },
      lookback: {
        label: "Mira atrás.",
        description:
          "Barras extra antes de empezar el rango para calentamiento",
      },
      size: {
        label: "Ventana tamaño",
        description: "Número de períodos en la ventana de rodamiento (1–500)",
      },
      result: {
        label: "Window Min",
        description: "Serie de tiempo de producción",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Window Min computed",
      description: "Serie mínima de venta retornada",
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
        description: "La computación de Window Min falló",
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

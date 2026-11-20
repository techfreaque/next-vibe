import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Crossover",
    titleShort: "Crossover",
    description: "Fuegos cuando la serie A cruza por encima de la serie B",
    fields: {
      seriesA: {
        label: "Serie A",
        description: "Primera serie de tiempo de entrada",
      },
      seriesB: {
        label: "Serie B",
        description: "Segunda serie de tiempo de entrada",
      },
      resolution: { label: "Resolución", description: "Plazo de cálculo" },
      range: { label: "Rango", description: "Rango de tiempo para evaluar" },
      lookback: {
        label: "Mira atrás.",
        description:
          "Barras extra antes de empezar el rango para calentamiento",
      },
      signals: {
        label: "Signals",
        description: "Eventos de señalización de salida",
      },
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Evaluate",
      loadingText: "Evaluando...",
    },
    success: {
      title: "Crossover evaluó",
      description: "Actos de señalización devueltos",
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
        description: "La evaluación cruzada falló",
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

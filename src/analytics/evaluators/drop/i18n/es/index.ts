import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Sharp Drop",
    titleShort: "Suelta",
    description:
      "Fuegos cuando un valor cae fuertemente por debajo de su propio promedio de seguimiento",
    fields: {
      source: { label: "Fuente", description: "Serie de tiempo de entrada" },
      resolution: { label: "Resolución", description: "Plazo de cálculo" },
      range: { label: "Rango", description: "Rango de tiempo para evaluar" },
      lookback: {
        label: "Mira atrás.",
        description:
          "Barras extra antes de empezar el rango para calentamiento",
      },
      window: {
        label: "Barras de rastreo",
        description:
          "¿Cuántas barras anteriores forman el promedio de referencia",
      },
      dropPct: {
        label: "Suelta",
        description:
          "Fuego debajo de la base × (1 - gota). 0.5 = una caída del 50%",
      },
      minBaseline: {
        label: "Base de referencia",
        description:
          "Ignorar barras cuya base está por debajo de esto (demasiado pocos datos)",
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
      title: "Suelta evaluada",
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
        description: "Falló la evaluación de la caída",
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
